import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ArrowDown, ArrowRight } from 'react-bootstrap-icons';

import {
  INITIAL_MESSAGES,
} from '../../lib/conversation/types';

import { useConversation } from '../../hooks/useConversation';
import { ConversationComposer } from './ConversationComposer';
import { ConversationMessage } from './ConversationMessage';
import { QuickReplies } from './QuickReplies';

const DRAFT_KEY = 'conversation-draft';

const statusLabel = {
  live: 'live',
  connecting: 'connecting…',
  saved: 'offline · messages saved',
};

export const ConversationExperience = () => {
  const [draft, setDraft] = useState(() => sessionStorage.getItem(DRAFT_KEY) || '');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessageCountRef = useRef(0);
  const messagesRef = useRef(null);
  const conversationRef = useRef(null);
  const conversation = useConversation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (!messagesElement) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof messagesElement.scrollTo === 'function') {
      messagesElement.scrollTo({
        top: messagesElement.scrollHeight,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    } else {
      messagesElement.scrollTop = messagesElement.scrollHeight;
    }
  }, [conversation.messages.length, conversation.isOperatorTyping]);

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
    const unlockDocumentScroll = () => {
      document.documentElement.classList.remove('conversation-scroll-lock');
    };

    const element = conversationRef.current;
    if (!element || !conversation.isStarted || isMinimized) {
      unlockDocumentScroll();
      return undefined;
    }

    // Measure scrollbar width once and store as CSS var so the lock
    // padding-right compensation doesn't cause a layout shift.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    const lockDocumentScroll = () => {
      document.documentElement.classList.add('conversation-scroll-lock');
    };

    const pointerInsideRef = { current: false };
    const focusInsideRef = { current: false };

    const syncDocumentScroll = () => {
      if (pointerInsideRef.current || focusInsideRef.current) {
        lockDocumentScroll();
      } else {
        unlockDocumentScroll();
      }
    };

    const handlePointerEnter = () => { pointerInsideRef.current = true; lockDocumentScroll(); };
    const handlePointerLeave = () => { pointerInsideRef.current = false; syncDocumentScroll(); };
    const handleFocusIn = () => { focusInsideRef.current = true; lockDocumentScroll(); };
    const handleFocusOut = () => {
      window.requestAnimationFrame(() => {
        focusInsideRef.current = element.contains(document.activeElement);
        syncDocumentScroll();
      });
    };
    const handleDocumentPointerDown = (event) => {
      if (!element.contains(event.target)) {
        pointerInsideRef.current = false;
        focusInsideRef.current = false;
        unlockDocumentScroll();
      }
    };
    const handleViewportResize = () => {
      if (window.innerWidth <= 900 && element.contains(document.activeElement)) {
        window.requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        });
      }
    };

    element.addEventListener('pointerenter', handlePointerEnter);
    element.addEventListener('pointerleave', handlePointerLeave);
    element.addEventListener('focusin', handleFocusIn);
    element.addEventListener('focusout', handleFocusOut);
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      element.removeEventListener('pointerenter', handlePointerEnter);
      element.removeEventListener('pointerleave', handlePointerLeave);
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('focusout', handleFocusOut);
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      unlockDocumentScroll();
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
    sessionStorage.setItem(DRAFT_KEY, value);
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
    if (newCount > prevCount && !isAtBottom && isMinimized === false) {
      const newOperatorMessages = conversation.messages
        .slice(prevCount)
        .filter((m) => m.sender.type === 'operator').length;
      if (newOperatorMessages > 0) setUnreadCount((c) => c + newOperatorMessages);
    }
    if (isAtBottom) setUnreadCount(0);
    prevMessageCountRef.current = newCount;
  }, [conversation.messages, isAtBottom, isMinimized]);

  const scrollToBottom = () => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setUnreadCount(0);
  };

  const handleSend = () => {
    const message = draft.trim();
    if (!message) return;
    handleDraftChange('');
    conversation.sendMessage(message);
  };

  const hasNewMessages = conversation.messages.length > INITIAL_MESSAGES.length;

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
            onClick={conversation.startConversation}
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
          <span className="about-conversation-minimized-label"><i /> Conversation saved</span>
          <div className="about-conversation-minimized-actions">
            <button type="button" onClick={() => setIsMinimized(false)}>Continue session</button>
            <button
              type="button"
              className="is-secondary"
              onClick={() => {
                conversation.resetConversation();
                setIsMinimized(false);
                setDraft('');
              }}
            >
              Start new conversation
            </button>
          </div>
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
              <button type="button" className="about-conversation-close" onClick={() => setIsMinimized(true)} aria-label="Minimize conversation">−</button>
            </div>
          </header>

          {conversation.isLoading && conversation.messages.length === 0 ? (
            <p className="about-conversation-loading" aria-live="polite">Loading messages…</p>
          ) : (
            <div className="about-conversation-messages-wrap">
              <ul ref={messagesRef} className="about-conversation-messages" aria-live="polite" aria-relevant="additions text">
              {conversation.messages.map((message) => (
                <ConversationMessage key={message.id} message={message} onRetry={conversation.retryMessage} />
              ))}
              {conversation.isOperatorTyping && (
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
            <QuickReplies onSelect={(reply) => conversation.sendMessage(reply)} disabled={conversation.isSending || conversation.isStarting} />
          )}

          <ConversationComposer
            value={draft}
            onChange={handleDraftChange}
            onSend={handleSend}
            disabled={conversation.isSending || conversation.isLoading || conversation.isStarting}
          />
        </motion.section>
      ))}
    </AnimatePresence>
  );
};
