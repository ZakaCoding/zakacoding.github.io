import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ArrowDown, ArrowRight, VolumeMuteFill, VolumeUpFill } from 'react-bootstrap-icons';

import {
  INITIAL_MESSAGES,
} from '../../lib/conversation/types';

import { useConversation } from '../../hooks/useConversation';
import { ConversationComposer } from './ConversationComposer';
import { ConversationMessage } from './ConversationMessage';
import { ConversationOpening } from './ConversationOpening';
import { QuickReplies } from './QuickReplies';
import { ConversationFollowUp } from './ConversationFollowUp';
import { readDraft, saveDraft } from '../../lib/conversation/storage';
import { disablePushSubscription } from '../../lib/conversation/push';
import {
  playChatSound,
  primeChatSounds,
  readChatSoundEnabled,
  saveChatSoundEnabled,
} from '../../lib/conversation/sounds';

const statusLabel = {
  live: 'connected',
  connecting: 'connecting…',
  saved: 'reconnecting',
};

export const ConversationExperience = () => {
  const [draft, setDraft] = useState(readDraft);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showOpening, setShowOpening] = useState(false);
  const [resetNotice, setResetNotice] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(readChatSoundEnabled);
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const prevMessageCountRef = useRef(0);
  const seenOperatorMessageIdsRef = useRef(null);
  const messagesRef = useRef(null);
  const conversationRef = useRef(null);
  const conversation = useConversation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // The closing copy reflows when the conversation opens or minimizes.
    // Ask the scroll-driven logo layer to follow its moved landing anchor.
    window.dispatchEvent(new CustomEvent('zakacoding:conversation-layout-change'));
  }, [conversation.isStarted, isMinimized, isExpanded]);

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (!messagesElement || (!isAtBottom && conversation.messages.at(-1)?.sender.type !== 'guest')) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof messagesElement.scrollTo === 'function') {
      messagesElement.scrollTo({
        top: messagesElement.scrollHeight,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    } else {
      messagesElement.scrollTop = messagesElement.scrollHeight;
    }
  // Only new content or reopening the chat should trigger scrolling.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.messages.length, conversation.isOperatorTyping, showOpening, isMinimized]);

  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!conversation.isStarted || isMinimized) return undefined;
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === 'F11') {
        e.preventDefault();
        setIsExpanded((v) => !v);
      }
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [conversation.isStarted, isMinimized, isExpanded]);

  useEffect(() => {
    const element = conversationRef.current;
    if (!element || !conversation.isStarted || isMinimized) return undefined;

    const handleViewportResize = () => {
      if (window.innerWidth <= 900 && element.contains(document.activeElement)) {
        window.requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        });
      }
    };

    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, [conversation.isStarted, isMinimized]);

  useEffect(() => {
    if (!conversation.isStarted || isMinimized) return undefined;
    if (window.innerWidth > 900) return undefined;

    const timer = window.setTimeout(() => {
      conversationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [conversation.isStarted, isMinimized]);

  const handleDraftChange = (value) => {
    setDraft(value);
    saveDraft(value);
  };

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (!messagesElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesElement;
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 40);
    };

    messagesElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => messagesElement.removeEventListener('scroll', handleScroll);
  }, [conversation.isStarted, isMinimized]);

  useEffect(() => {
    const newCount = conversation.messages.length;
    const prevCount = prevMessageCountRef.current;
    if (newCount > prevCount && (!isAtBottom || isMinimized || !isPageVisible) && !conversation.isLoading) {
      const newOperatorMessages = conversation.messages
        .slice(prevCount)
        .filter((m) => m.sender.type === 'operator' && !INITIAL_MESSAGES.some((initial) => initial.id === m.id)).length;
      if (newOperatorMessages > 0) setUnreadCount((c) => c + newOperatorMessages);
    }
    if (isAtBottom && !isMinimized && isPageVisible) setUnreadCount(0);
    prevMessageCountRef.current = newCount;
  }, [conversation.messages, conversation.isLoading, isAtBottom, isMinimized, isPageVisible]);

  useEffect(() => {
    const operatorMessages = conversation.messages.filter((message) => (
      message.sender.type === 'operator'
      && !INITIAL_MESSAGES.some((initial) => initial.id === message.id)
      && message.status !== 'failed'
    ));
    const currentIds = new Set(operatorMessages.map((message) => message.id));

    // Establish the baseline from restored history without playing sounds.
    if (!seenOperatorMessageIdsRef.current) {
      seenOperatorMessageIdsRef.current = currentIds;
      return;
    }

    const hasNewOperatorMessage = operatorMessages.some((message) => (
      !seenOperatorMessageIdsRef.current.has(message.id)
    ));
    seenOperatorMessageIdsRef.current = currentIds;

    if (hasNewOperatorMessage && isPageVisible) playChatSound('receive');
  }, [conversation.messages, isPageVisible]);

  const scrollToBottom = () => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setUnreadCount(0);
  };

  const handleSend = async () => {
    const message = draft.trim();
    if (!message || conversation.isSending || conversation.isStarting || conversation.isLoading) return;
    primeChatSounds();
    setShowOpening(false);
    handleDraftChange('');
    const sent = await conversation.sendMessage(message);
    if (sent) playChatSound('send');
  };

  const hasNewMessages = conversation.messages.some((message) => !INITIAL_MESSAGES.some((initial) => initial.id === message.id));
  const hasRealOperatorMessage = conversation.messages.some((message) => (
    message.sender.type === 'operator' && !INITIAL_MESSAGES.some((initial) => initial.id === message.id)
  ));
  const isShowingOpening = showOpening && !hasNewMessages && !hasRealOperatorMessage && !conversation.isStarting && !conversation.isLoading;

  const handleStartConversation = () => {
    primeChatSounds();
    setShowOpening(true);
    conversation.startConversation();
  };

  const handleSoundToggle = () => {
    const enabled = !soundEnabled;
    setSoundEnabled(enabled);
    saveChatSoundEnabled(enabled);
    if (enabled) primeChatSounds();
  };

  return (
    <AnimatePresence initial={false}>
      {conversation.isRestoring && (
        <motion.p
          key="restoring"
          className="conversation-loading-placeholder"
          aria-live="polite"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          Restoring your conversation…
        </motion.p>
      )}

      {!conversation.isRestoring && !conversation.isStarted && (
        <motion.div
          key="cta"
          className="conversation-cta-wrap"
          initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            className="about-closing-cta"
            onClick={handleStartConversation}
            disabled={conversation.isStarting}
          >
            Start a conversation <ArrowRight aria-hidden="true" />
          </button>
          {conversation.notice && (
            <p className="conversation-notice" role="alert">{conversation.notice}</p>
          )}
        </motion.div>
      )}

      {conversation.isStarted && (isMinimized ? (
        <motion.div
          key="minimized"
          className="about-conversation-minimized"
          initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-conversation-minimized-label"><i /> {unreadCount ? `${unreadCount} new ${unreadCount === 1 ? 'reply' : 'replies'}` : 'Your conversation'}</span>
          <div className="about-conversation-minimized-actions">
            <button type="button" onClick={() => setIsMinimized(false)}>Continue session</button>
            <button
              type="button"
              className="is-secondary"
              onClick={async () => {
                if (conversation.messages.some((message) => message.status === 'failed' || message.status === 'sending')) {
                  setResetNotice('You have unsent messages. Continue the session to retry them before starting again.');
                  return;
                }
                // Push cleanup is best effort. A stale or unavailable push route
                // must never prevent the visitor from starting a fresh conversation.
                try { if (conversation.session) await disablePushSubscription(conversation.session); } catch { /* Continue with local reset. */ }
                conversation.resetConversation();
                setShowOpening(false);
                setIsMinimized(false);
                handleDraftChange('');
                setResetNotice('');
              }}
            >
              Start new conversation
            </button>
          </div>
          {resetNotice && <p role="status">{resetNotice}</p>}
        </motion.div>
      ) : (
        <motion.section
          key="conversation"
          className={`about-conversation${isExpanded ? ' is-expanded' : ''}`}
          aria-label="Conversation with Zaka"
          ref={conversationRef}
          initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -18, scale: 0.98 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="about-conversation-header">
            <span className="about-conversation-title">A small space to talk</span>
            <div className="about-conversation-header-actions">
              <span className="about-conversation-status"><i /> {conversation.isStarting ? 'connecting…' : statusLabel[conversation.realtimeStatus]}</span>
              <button
                type="button"
                className="about-conversation-sound"
                onClick={handleSoundToggle}
                aria-label={soundEnabled ? 'Mute chat sounds' : 'Enable chat sounds'}
                title={soundEnabled ? 'Mute chat sounds' : 'Enable chat sounds'}
              >
                {soundEnabled ? <VolumeUpFill aria-hidden="true" /> : <VolumeMuteFill aria-hidden="true" />}
              </button>
              <button type="button" className="about-conversation-close" onClick={() => setIsMinimized(true)} aria-label="Minimize conversation">−</button>
            </div>
          </header>
          <p className="conversation-availability">Leave a message—I’ll reply when I’m back at my desk.</p>

          {(showOpening && (conversation.isStarting || conversation.isLoading)) || (conversation.isLoading && conversation.messages.length === 0) ? (
            <p className="about-conversation-loading" aria-live="polite">Loading messages…</p>
          ) : (
            <div className="about-conversation-messages-wrap">
              <ul ref={messagesRef} className="about-conversation-messages" aria-live={isShowingOpening ? 'off' : 'polite'} aria-relevant="additions text">
              {isShowingOpening ? <ConversationOpening onComplete={setShowOpening} /> : conversation.messages.map((message) => (
                <ConversationMessage key={message.id} message={message} onRetry={conversation.retryMessage} />
              ))}
              {conversation.isOperatorTyping && !isShowingOpening && (
                <li className="conversation-message-row is-operator" aria-live="polite" aria-label="Zaka is typing">
                  <article className="conversation-message">
                    <span className="conversation-typing-indicator" aria-hidden="true"><i /><i /><i /></span>
                  </article>
                </li>
              )}
            </ul>
            {!isAtBottom && (
              <button
                type="button"
                className="conversation-scroll-bottom"
                onClick={scrollToBottom}
                aria-label="Scroll to latest message"
              >
                <ArrowDown aria-hidden="true" />
                {unreadCount > 0 && <span className="conversation-unread-badge">{unreadCount}</span>}
              </button>
            )}
            </div>
          )}

          {conversation.notice && (
            <div className="about-conversation-notice" role="status">
              <span>{conversation.notice}</span>
              {conversation.retryLoad && <button type="button" onClick={conversation.retryLoad}>Try again</button>}
            </div>
          )}

          {!hasNewMessages && (
            <QuickReplies onSelect={async (reply) => {
              primeChatSounds();
              setShowOpening(false);
              const sent = await conversation.sendMessage(reply);
              if (sent) playChatSound('send');
            }} disabled={conversation.isSending || conversation.isStarting || conversation.isLoading} />
          )}

          <ConversationComposer
            value={draft}
            onChange={handleDraftChange}
            onSend={handleSend}
            disabled={conversation.isLoading || conversation.isStarting}
            isSending={conversation.isSending}
          />
          {hasNewMessages && conversation.session && <ConversationFollowUp key={conversation.contactEmail} session={conversation.session} contactEmail={conversation.contactEmail} onContactSaved={conversation.setContactEmail} />}
          <a className="conversation-email-link" href="mailto:zakanoor@outlook.co.id">Email me directly</a>
        </motion.section>
      ))}
    </AnimatePresence>
  );
};
