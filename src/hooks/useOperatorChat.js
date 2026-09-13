import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MAX_MESSAGE_LENGTH, mergeMessages } from '../lib/conversation/types';
import {
  OperatorApiError,
  loadOperatorConversation,
  loadOperatorConversations,
  loadOperatorIdentity,
  loginOperator,
  logoutOperator,
  sendOperatorMessage,
} from '../lib/operator/api';
import { subscribeToOperatorConversations } from '../lib/operator/realtime';
import {
  clearOperatorSession,
  getOperatorDeviceName,
  readOperatorSession,
  saveOperatorSession,
} from '../lib/operator/storage';

const POLL_INTERVAL = 15000;
const makeTemporaryId = () => `operator-temp-${crypto.randomUUID?.() || Date.now()}`;

const sortConversations = (conversations) => [...conversations].sort((left, right) => (
  (Date.parse(right.lastMessageAt || right.createdAt) || 0)
  - (Date.parse(left.lastMessageAt || left.createdAt) || 0)
));

export const useOperatorChat = () => {
  const [session, setSession] = useState(null);
  const [phase, setPhase] = useState('checking');
  const [operator, setOperator] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [notice, setNotice] = useState('');
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('saved');
  const realtimeRef = useRef(null);
  const didBootstrapRef = useRef(false);
  const openRequestRef = useRef(0);
  const selectedIdRef = useRef(null);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const expireSession = useCallback(() => {
    clearOperatorSession();
    realtimeRef.current?.disconnect();
    setSession(null);
    setOperator(null);
    setConversations([]);
    setSelectedId(null);
    setSelectedConversation(null);
    setPhase('login');
  }, []);

  const handleApiError = useCallback((error, fallback) => {
    if (error instanceof OperatorApiError && error.status === 401) {
      expireSession();
      setNotice('Your operator session has expired. Sign in again.');
      return;
    }
    setNotice(error?.message || fallback);
  }, [expireSession]);

  const refreshInbox = useCallback(async ({ quiet = false, token = session?.token } = {}) => {
    if (!token) return;
    if (!quiet) setIsLoadingInbox(true);
    try {
      const result = await loadOperatorConversations({ token });
      setConversations(sortConversations(result.conversations));
      setNotice('');
    } catch (error) {
      handleApiError(error, 'Inbox could not be refreshed.');
    } finally {
      if (!quiet) setIsLoadingInbox(false);
    }
  }, [handleApiError, session?.token]);

  const openConversation = useCallback(async (conversationId) => {
    if (!session?.token) return;
    const requestId = ++openRequestRef.current;
    setSelectedId(conversationId);
    setSelectedConversation((current) => current?.id === conversationId ? current : null);
    setIsLoadingThread(true);
    setNotice('');
    try {
      const conversation = await loadOperatorConversation({ id: conversationId, token: session.token });
      if (openRequestRef.current === requestId) setSelectedConversation(conversation);
    } catch (error) {
      if (openRequestRef.current === requestId) handleApiError(error, 'Conversation could not be loaded.');
    } finally {
      if (openRequestRef.current === requestId) setIsLoadingThread(false);
    }
  }, [handleApiError, session?.token]);

  const reconcileSelectedConversation = useCallback(async (token = session?.token) => {
    const conversationId = selectedIdRef.current;
    if (!token || !conversationId) return;

    try {
      const conversation = await loadOperatorConversation({ id: conversationId, token });
      if (selectedIdRef.current !== conversationId) return;
      setSelectedConversation((current) => ({
        ...conversation,
        messages: mergeMessages(current?.id === conversationId ? current.messages : [], conversation.messages),
      }));
    } catch (error) {
      handleApiError(error, 'Conversation could not be reconciled.');
    }
  }, [handleApiError, session?.token]);

  useEffect(() => {
    if (didBootstrapRef.current) return;
    didBootstrapRef.current = true;

    const storedSession = readOperatorSession();
    if (!storedSession) {
      setPhase('login');
      return;
    }

    setSession(storedSession);
    loadOperatorIdentity(storedSession.token)
      .then((identity) => {
        setOperator(identity || storedSession.operator);
        setPhase('ready');
        return refreshInbox({ token: storedSession.token });
      })
      .catch((error) => handleApiError(error, 'Operator session could not be restored.'));
  }, [handleApiError, refreshInbox]);

  useEffect(() => {
    if (phase !== 'ready' || !session?.token) return undefined;
    const interval = window.setInterval(() => refreshInbox({ quiet: true }), POLL_INTERVAL);
    return () => window.clearInterval(interval);
  }, [phase, refreshInbox, session?.token]);

  const conversationIds = useMemo(
    () => conversations.map((conversation) => conversation.id).sort().join(','),
    [conversations],
  );

  useEffect(() => {
    if (phase !== 'ready' || !session?.token) return undefined;
    const ids = conversationIds ? conversationIds.split(',') : [];
    const realtime = subscribeToOperatorConversations({
      conversationIds: ids,
      token: session.token,
      onStatus: setRealtimeStatus,
      onReconnect: () => {
        refreshInbox({ quiet: true });
        reconcileSelectedConversation(session.token);
      },
      onInboxEvent: () => refreshInbox({ quiet: true }),
      onMessage: (message) => {
        setSelectedConversation((current) => {
          if (!current || current.id !== String(message.conversation_id)) return current;
          return { ...current, messages: mergeMessages(current.messages, [message]) };
        });
        setConversations((current) => sortConversations(current.map((conversation) => (
          conversation.id === String(message.conversation_id)
            ? { ...conversation, lastMessage: message, lastMessageAt: message.created_at }
            : conversation
        ))));
      },
    });
    realtimeRef.current = realtime;
    return () => realtime.disconnect();
  }, [conversationIds, phase, reconcileSelectedConversation, refreshInbox, session?.token]);

  const login = useCallback(async ({ email, password }) => {
    setPhase('authenticating');
    setNotice('');
    try {
      const auth = await loginOperator({ email, password, deviceName: getOperatorDeviceName() });
      const nextSession = saveOperatorSession(auth);
      setSession(nextSession);
      setOperator(auth.operator);
      setPhase('ready');
      await refreshInbox({ token: auth.token });
    } catch (error) {
      setPhase('login');
      setNotice(error?.message || 'Sign in failed.');
    }
  }, [refreshInbox]);

  const logout = useCallback(async () => {
    const token = session?.token;
    expireSession();
    setNotice('');
    if (token) {
      try {
        await logoutOperator(token);
      } catch {
        // Local logout is still complete when the network is unavailable.
      }
    }
  }, [expireSession, session?.token]);

  const sendMessage = useCallback(async (body) => {
    const cleanBody = body.trim();
    if (!session?.token || !selectedId || !cleanBody || cleanBody.length > MAX_MESSAGE_LENGTH || isSending) return false;

    const temporaryMessage = {
      id: makeTemporaryId(),
      conversation_id: selectedId,
      sender: { type: 'operator', name: operator?.name || 'Zaka' },
      body: cleanBody,
      created_at: new Date().toISOString(),
      status: 'sending',
    };
    setIsSending(true);
    setNotice('');
    setSelectedConversation((current) => current
      ? { ...current, messages: mergeMessages(current.messages, [temporaryMessage]) }
      : current);

    try {
      const message = await sendOperatorMessage({ id: selectedId, token: session.token, body: cleanBody });
      setSelectedConversation((current) => current
        ? {
          ...current,
          messages: mergeMessages(
            current.messages.filter((item) => item.id !== temporaryMessage.id),
            [message],
          ),
        }
        : current);
      setConversations((current) => sortConversations(current.map((conversation) => (
        conversation.id === selectedId
          ? { ...conversation, lastMessage: message, lastMessageAt: message.created_at }
          : conversation
      ))));
      realtimeRef.current?.whisperTyping(selectedId, false);
      return true;
    } catch (error) {
      setSelectedConversation((current) => current
        ? {
          ...current,
          messages: current.messages.map((message) => (
            message.id === temporaryMessage.id ? { ...message, status: 'failed' } : message
          )),
        }
        : current);
      handleApiError(error, 'Message was not sent.');
      return false;
    } finally {
      setIsSending(false);
    }
  }, [handleApiError, isSending, operator?.name, selectedId, session?.token]);

  return {
    conversations,
    isAuthenticating: phase === 'authenticating',
    isChecking: phase === 'checking',
    isLoadingInbox,
    isLoadingThread,
    isReady: phase === 'ready',
    isSending,
    login,
    logout,
    notice,
    openConversation,
    operator,
    realtimeStatus,
    refreshInbox,
    selectedConversation,
    selectedId,
    sendMessage,
    showInbox: () => setSelectedId(null),
    whisperTyping: (typing) => selectedId && realtimeRef.current?.whisperTyping(selectedId, typing),
  };
};
