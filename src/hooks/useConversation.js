import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ConversationApiError,
  createConversation,
  loadConversation,
  sendConversationMessage,
} from '../lib/conversation/api';
import { subscribeToConversation } from '../lib/conversation/realtime';
import {
  INITIAL_MESSAGES,
  MAX_MESSAGE_LENGTH,
  mergeMessages,
  removePendingMatch,
} from '../lib/conversation/types';
import {
  clearConversationSession,
  readConversationSession,
  saveConversationSession,
} from '../lib/conversation/storage';

const makeTemporaryId = () => `temp-${crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`}`;

const isInvalidSessionError = (error) => error instanceof ConversationApiError
  && (error.status === 401 || error.status === 403 || error.status === 404);

const friendlyLoadError = (error) => (
  isInvalidSessionError(error)
    ? 'This conversation is no longer available. You can start a fresh one.'
    : 'Messages are saved, but this conversation could not be loaded. Try again.'
);

export const useConversation = () => {
  const [session, setSession] = useState(null);
  const [phase, setPhase] = useState('restoring');
  const [remoteMessages, setRemoteMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [notice, setNotice] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('saved');
  const loadStoredConversation = useCallback(async (conversationSession, showError = true) => {
    setIsLoading(true);
    try {
      const conversation = await loadConversation(conversationSession);
      setRemoteMessages((currentMessages) => mergeMessages(currentMessages, conversation.messages));
      setPhase('ready');
      if (showError) setNotice('');
    } catch (error) {
      if (isInvalidSessionError(error)) {
        clearConversationSession();
        setSession(null);
        setRemoteMessages([]);
        setPendingMessages([]);
        setPhase('idle');
      } else {
        setPhase('ready');
      }
      setNotice(friendlyLoadError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedSession = readConversationSession();

    if (!storedSession) {
      setPhase('idle');
      return undefined;
    }

    setSession(storedSession);
    loadStoredConversation(storedSession);
    return undefined;
  }, [loadStoredConversation]);

  useEffect(() => {
    if (!session || phase === 'idle') return undefined;

    const unsubscribe = subscribeToConversation({
      conversationId: session.id,
      token: session.token,
      onMessage: (message) => {
        setRemoteMessages((currentMessages) => mergeMessages(currentMessages, [message]));
        setPendingMessages((currentMessages) => removePendingMatch(currentMessages, message));
      },
      onStatus: setRealtimeStatus,
      onReconnect: () => loadStoredConversation(session, false),
    });

    return unsubscribe;
  }, [loadStoredConversation, phase, session]);

  const startConversation = useCallback(async () => {
    setNotice('');
    setPhase('starting');
    try {
      const newSession = await createConversation();
      saveConversationSession(newSession);
      setSession(newSession);
      setRemoteMessages([]);
      setPendingMessages([]);
      setPhase('ready');
      await loadStoredConversation(newSession);
    } catch {
      clearConversationSession();
      setSession(null);
      setPhase('idle');
      setNotice('I couldn’t open the conversation just now. Please try again.');
    }
  }, [loadStoredConversation]);

  const sendMessage = useCallback(async (body, temporaryId = null) => {
    const cleanBody = body.trim();
    if (!session || !cleanBody || cleanBody.length > MAX_MESSAGE_LENGTH || isSending) return;

    const id = temporaryId || makeTemporaryId();
    const temporaryMessage = {
      id,
      conversation_id: session.id,
      sender: { type: 'guest', name: null },
      body: cleanBody,
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    setNotice('');
    setIsSending(true);
    setPendingMessages((currentMessages) => temporaryId
      ? currentMessages.map((message) => message.id === temporaryId ? temporaryMessage : message)
      : [...currentMessages, temporaryMessage]);

    try {
      const persistedMessage = await sendConversationMessage({
        id: session.id,
        token: session.token,
        body: cleanBody,
      });
      setRemoteMessages((currentMessages) => mergeMessages(currentMessages, [persistedMessage]));
      setPendingMessages((currentMessages) => removePendingMatch(currentMessages, persistedMessage));
    } catch (error) {
      if (isInvalidSessionError(error)) {
        clearConversationSession();
        setSession(null);
        setRemoteMessages([]);
        setPendingMessages([]);
        setPhase('idle');
        setNotice('This conversation is no longer available. You can start a fresh one.');
        setIsSending(false);
        return;
      }

      setPendingMessages((currentMessages) => currentMessages.map((message) => (
        message.id === id ? { ...message, status: 'failed' } : message
      )));
    } finally {
      setIsSending(false);
    }
  }, [isSending, session]);

  const messages = useMemo(() => {
    const combinedMessages = mergeMessages(remoteMessages, pendingMessages);
    const hasOperatorMessage = combinedMessages.some((message) => message.sender.type === 'operator');
    return hasOperatorMessage ? combinedMessages : mergeMessages(INITIAL_MESSAGES, combinedMessages);
  }, [pendingMessages, remoteMessages]);

  return {
    isRestoring: phase === 'restoring',
    isStarting: phase === 'starting',
    isLoading,
    isSending,
    isStarted: phase !== 'idle' && phase !== 'restoring',
    messages,
    notice,
    realtimeStatus,
    startConversation,
    sendMessage,
    retryMessage: (message) => sendMessage(message.body, message.id),
    retryLoad: session ? () => loadStoredConversation(session) : null,
  };
};
