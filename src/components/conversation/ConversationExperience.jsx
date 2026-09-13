import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ArrowRight } from 'react-bootstrap-icons';

import { useConversation } from '../../hooks/useConversation';
import { ConversationComposer } from './ConversationComposer';
import { ConversationMessage } from './ConversationMessage';
import { QuickReplies } from './QuickReplies';

const statusLabel = {
  live: 'live',
  connecting: 'connecting…',
  saved: 'messages are saved',
};

export const ConversationExperience = () => {
  const [draft, setDraft] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
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
  }, [conversation.messages.length]);

  useEffect(() => {
    const unlockDocumentScroll = () => {
      document.documentElement.classList.remove('conversation-scroll-lock');
      document.body.classList.remove('conversation-scroll-lock');
    };

    const element = conversationRef.current;
    if (!element || !conversation.isStarted || isMinimized) {
      unlockDocumentScroll();
      return undefined;
    }

    const lockDocumentScroll = () => {
      document.documentElement.classList.add('conversation-scroll-lock');
      document.body.classList.add('conversation-scroll-lock');
    };

    const bringConversationIntoView = () => {
      if (window.innerWidth <= 900 && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const handleChatInteraction = () => {
      lockDocumentScroll();
      window.requestAnimationFrame(bringConversationIntoView);
    };

    const handleFocusOut = () => {
      window.requestAnimationFrame(() => {
        if (!element.contains(document.activeElement)) unlockDocumentScroll();
      });
    };

    const handleDocumentPointerDown = (event) => {
      if (!element.contains(event.target)) unlockDocumentScroll();
    };

    const handleViewportResize = () => {
      if (element.contains(document.activeElement)) {
        window.requestAnimationFrame(() => {
          if (typeof element.scrollIntoView === 'function') {
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
          }
        });
      }
    };

    element.addEventListener('focusin', handleChatInteraction);
    element.addEventListener('focusout', handleFocusOut);
    element.addEventListener('pointerdown', handleChatInteraction);
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      element.removeEventListener('focusin', handleChatInteraction);
      element.removeEventListener('focusout', handleFocusOut);
      element.removeEventListener('pointerdown', handleChatInteraction);
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      unlockDocumentScroll();
    };
  }, [conversation.isStarted, isMinimized]);

  useEffect(() => {
    if (!conversation.isStarted || isMinimized) return undefined;
    if (window.innerWidth > 900) return undefined;

    const bringConversationIntoView = () => {
      if (typeof conversationRef.current?.scrollIntoView === 'function') {
        conversationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    const timer = window.setTimeout(bringConversationIntoView, 180);
    return () => window.clearTimeout(timer);
  }, [conversation.isStarted, conversation.isStarting, isMinimized]);

  const handleSend = () => {
    const message = draft.trim();
    if (!message) return;
    setDraft('');
    conversation.sendMessage(message);
  };

  const hasVisitorMessage = conversation.messages.some((message) => message.sender.type === 'guest');

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
          className="about-conversation"
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
            <ul ref={messagesRef} className="about-conversation-messages" aria-live="polite" aria-relevant="additions text">
              {conversation.messages.map((message) => (
                <ConversationMessage key={message.id} message={message} onRetry={conversation.retryMessage} />
              ))}
            </ul>
          )}

          {conversation.notice && (
            <div className="about-conversation-notice" role="status">
              <span>{conversation.notice}</span>
              {conversation.retryLoad && <button type="button" onClick={conversation.retryLoad}>Try again</button>}
            </div>
          )}

          {!hasVisitorMessage && (
            <QuickReplies onSelect={(reply) => conversation.sendMessage(reply)} disabled={conversation.isSending || conversation.isStarting} />
          )}

          <ConversationComposer
            value={draft}
            onChange={setDraft}
            onSend={handleSend}
            disabled={conversation.isSending || conversation.isLoading || conversation.isStarting}
          />
        </motion.section>
      ))}
    </AnimatePresence>
  );
};
