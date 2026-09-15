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
import { usePushNotifications } from './usePushNotifications';
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
  const pushNotifications = usePushNotifications(session, true);
  const realtimeRef = useRef(null);
  const didBootstrapRef = useRef(false);
  const openRequestRef = useRef(0);
  const selectedIdRef = useRef(null);
  const conversationsRef = useRef(conversations);
  const unreadCountsRef = useRef(new Map());
  const deliveredMessageIdsRef = useRef(new Set());

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const expireSession = useCallback(() => {
    clearOperatorSession();
    realtimeRef.current?.disconnect();
    setSession(null);
    setOperator(null);
    setConversations([]);
    unreadCountsRef.current.clear();
    deliveredMessageIdsRef.current.clear();
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
      setConversations(sortConversations(result.conversations.map((conversation) => ({
        ...conversation,
        unreadCount: unreadCountsRef.current.get(conversation.id) ?? conversation.unreadCount,
      }))));
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
    unreadCountsRef.current.delete(String(conversationId));
    setConversations((current) => current.map((conversation) => (
      conversation.id === String(conversationId)
        ? { ...conversation, unreadCount: 0 }
        : conversation
    )));
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
      onInboxEvent: (message) => {
        const incomingConversationId = String(message?.conversation_id || '');
        const isKnownConversation = conversationsRef.current.some(
          (conversation) => conversation.id === incomingConversationId,
        );
        if (!isKnownConversation) refreshInbox({ quiet: true });
      },
      onMessage: (message) => {
        const messageId = String(message.id);
        const isFirstDelivery = !deliveredMessageIdsRef.current.has(messageId);
        deliveredMessageIdsRef.current.add(messageId);
        if (deliveredMessageIdsRef.current.size > 500) {
          deliveredMessageIdsRef.current.delete(deliveredMessageIdsRef.current.values().next().value);
        }

        const incomingConversationId = String(message.conversation_id);
        const isUnread = message.sender.type === 'guest'
          && selectedIdRef.current !== incomingConversationId;
        if (isUnread) {
          const unreadCount = (unreadCountsRef.current.get(incomingConversationId) || 0)
            + (isFirstDelivery ? 1 : 0);
          unreadCountsRef.current.set(incomingConversationId, unreadCount);


        }

        setSelectedConversation((current) => {
          if (!current || current.id !== incomingConversationId) return current;
          return { ...current, messages: mergeMessages(current.messages, [message]) };
        });
        setConversations((current) => sortConversations(current.map((conversation) => (
          conversation.id === incomingConversationId
            ? {
              ...conversation,
              lastMessage: message,
              lastMessageAt: message.created_at,
              unreadCount: unreadCountsRef.current.get(incomingConversationId) ?? conversation.unreadCount,
            }
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
    pushNotifications,
    realtimeStatus,
    refreshInbox,
    selectedConversation,
    selectedId,
    sendMessage,
    showInbox: () => setSelectedId(null),
    whisperTyping: (typing) => selectedId && realtimeRef.current?.whisperTyping(selectedId, typing),
  };
};
