import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConversationApiError, createConversation, loadConversation, sendConversationMessage } from '../lib/conversation/api';
import { subscribeToConversation } from '../lib/conversation/realtime';
import { INITIAL_MESSAGES, MAX_MESSAGE_LENGTH, mergeMessages, removePendingMatch } from '../lib/conversation/types';
import { clearConversationSession, readConversationSession, saveConversationSession, readOutbox, saveOutbox } from '../lib/conversation/storage';

const isInvalidSessionError = (error) => error instanceof ConversationApiError && [401, 403, 404].includes(error.status);

export const useConversation = () => {
  const [session, setSession] = useState(null);
  const [phase, setPhase] = useState('restoring');
  const [remoteMessages, setRemoteMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [notice, setNotice] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('saved');
  const [isOperatorTyping, setIsOperatorTyping] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const typingTimerRef = useRef(null);
  const sessionRef = useRef(null);
  const pendingRef = useRef([]);
  const sendingRef = useRef(false);
  const generationRef = useRef(0);

  const updatePending = useCallback((messages) => {
    pendingRef.current = messages;
    setPendingMessages(messages);
    if (sessionRef.current && !saveOutbox(sessionRef.current.id, messages)) {
      setNotice('Browser storage is unavailable. Keep this tab open until your message is sent.');
    }
  }, []);

  const resetConversation = useCallback(() => {
    generationRef.current += 1;
    clearTimeout(typingTimerRef.current);
    clearConversationSession();
    // Keep a failed outbox scoped to its old conversation; never send it into a new one.
    sessionRef.current = null;
    pendingRef.current = [];
    sendingRef.current = false;
    setSession(null);
    setRemoteMessages([]);
    setPendingMessages([]);
    setContactEmail('');
    setIsOperatorTyping(false);
    setIsSending(false);
    setIsLoading(false);
    setNotice('');
    setRealtimeStatus('saved');
    setPhase('idle');
  }, []);

  const acceptMessages = useCallback((messages) => {
    setRemoteMessages((current) => mergeMessages(current, messages));
    updatePending(messages.reduce(removePendingMatch, pendingRef.current));
    if (messages.some((message) => message.sender.type === 'operator')) {
      clearTimeout(typingTimerRef.current);
      setIsOperatorTyping(false);
    }
  }, [updatePending]);

  const loadStoredConversation = useCallback(async (conversationSession, quiet = false) => {
    const generation = generationRef.current;
    if (!quiet) setIsLoading(true);
    try {
      const conversation = await loadConversation(conversationSession);
      if (generation !== generationRef.current) return;
      acceptMessages(conversation.messages);
      setContactEmail(conversation.contactEmail);
      setPhase('ready');
      if (!quiet) setNotice('');
    } catch (error) {
      if (generation !== generationRef.current) return;
      if (isInvalidSessionError(error)) {
        resetConversation();
        setNotice('This conversation is no longer available. You can start a fresh one.');
      } else {
        setPhase('ready');
        if (!quiet) setNotice('I couldn’t load the conversation. Your unsent messages are kept on this device; please try again.');
      }
    } finally {
      if (generation === generationRef.current && !quiet) setIsLoading(false);
    }
  }, [acceptMessages, resetConversation]);

  useEffect(() => {
    const stored = readConversationSession();
    if (!stored) { setPhase('idle'); return undefined; }
    sessionRef.current = stored;
    setSession(stored);
    pendingRef.current = readOutbox(stored.id);
    setPendingMessages(pendingRef.current);
    loadStoredConversation(stored);
    return () => { generationRef.current += 1; };
  }, [loadStoredConversation]);

  useEffect(() => {
    if (!session) return undefined;
    const unsubscribe = subscribeToConversation({
      conversationId: session.id,
      token: session.token,
      onMessage: (message) => { if (sessionRef.current?.id === session.id) acceptMessages([message]); },
      onStatus: setRealtimeStatus,
      onReconnect: () => loadStoredConversation(session, true),
      onTyping: (typing) => {
        clearTimeout(typingTimerRef.current);
        setIsOperatorTyping(typing);
        if (typing) typingTimerRef.current = setTimeout(() => setIsOperatorTyping(false), 3000);
      },
    });
    const refresh = () => { if (!document.hidden) loadStoredConversation(session, true); };
    const interval = setInterval(refresh, 15000);
    window.addEventListener('online', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      unsubscribe(); clearTimeout(typingTimerRef.current); clearInterval(interval);
      window.removeEventListener('online', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [session, acceptMessages, loadStoredConversation]);

  const startConversation = useCallback(async () => {
    if (sessionRef.current || sendingRef.current) return;
    sendingRef.current = true;
    const generation = ++generationRef.current;
    setNotice(''); setRealtimeStatus('connecting'); setPhase('starting');
    try {
      const next = await createConversation();
      if (generation !== generationRef.current) return;
      saveConversationSession(next);
      sessionRef.current = next;
      setSession(next);
      setPhase('ready');
      await loadStoredConversation(next);
    } catch {
      if (generation !== generationRef.current) return;
      setPhase('idle');
      setNotice('I couldn’t open the conversation. Try again or email me directly.');
    } finally {
      if (generation === generationRef.current) sendingRef.current = false;
    }
  }, [loadStoredConversation]);

  const sendMessage = useCallback(async (body, retry = null) => {
    const cleanBody = body.trim();
    const activeSession = sessionRef.current;
    if (!activeSession || !cleanBody || cleanBody.length > MAX_MESSAGE_LENGTH || sendingRef.current) return false;
    sendingRef.current = true;
    const generation = generationRef.current;
    const clientMessageId = retry?.client_message_id || crypto.randomUUID();
    const message = {
      id: retry?.id || `temp-${clientMessageId}`, client_message_id: clientMessageId,
      conversation_id: activeSession.id, sender: { type: 'guest', name: null },
      body: cleanBody, created_at: retry?.created_at || new Date().toISOString(), status: 'sending',
    };
    setNotice(''); setIsSending(true);
    updatePending(retry ? pendingRef.current.map((item) => item.id === retry.id ? message : item) : [...pendingRef.current, message]);
    try {
      const persisted = await sendConversationMessage({ ...activeSession, body: cleanBody, clientMessageId });
      if (generation !== generationRef.current) return false;
      updatePending(pendingRef.current.filter((item) => item.id !== message.id));
      acceptMessages([persisted]);
      return true;
    } catch (error) {
      if (generation !== generationRef.current) return false;
      updatePending(pendingRef.current.map((item) => item.id === message.id ? { ...item, status: 'failed' } : item));
      if (isInvalidSessionError(error)) setNotice('Your session has expired. Copy your unsent message before starting a new conversation.');
      return false;
    } finally {
      if (generation === generationRef.current) { sendingRef.current = false; setIsSending(false); }
    }
  }, [acceptMessages, updatePending]);

  const messages = useMemo(() => {
    const combined = mergeMessages(remoteMessages, pendingMessages);
    return combined.some((message) => message.sender.type === 'operator') ? combined : mergeMessages(INITIAL_MESSAGES, combined);
  }, [pendingMessages, remoteMessages]);

  return {
    session, contactEmail, setContactEmail, isOperatorTyping,
    isRestoring: phase === 'restoring', isStarting: phase === 'starting', isLoading, isSending,
    isStarted: phase !== 'idle' && phase !== 'restoring', messages, notice, realtimeStatus,
    startConversation, resetConversation, sendMessage,
    retryMessage: (message) => sendMessage(message.body, message),
    retryLoad: session ? () => loadStoredConversation(session) : null,
  };
};
