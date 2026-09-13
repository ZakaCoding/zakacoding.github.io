import { AnimatePresence, motion } from 'framer-motion';
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
  const messagesRef = useRef(null);
  const conversation = useConversation();

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (!messagesElement) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    messagesElement.scrollTo({
      top: messagesElement.scrollHeight,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [conversation.messages.length]);

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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          Restoring your conversation…
        </motion.p>
      )}

      {!conversation.isRestoring && !conversation.isStarted && (
        <motion.div
          key="cta"
          className="conversation-cta-wrap"
          layout
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
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

      {conversation.isStarted && (
        <motion.section
          key="conversation"
          className="about-conversation"
          aria-label="Conversation with Zaka"
          layout
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="about-conversation-header">
            <span className="about-conversation-title">A small space to talk</span>
            <span className="about-conversation-status"><i /> {conversation.isStarting ? 'connecting…' : statusLabel[conversation.realtimeStatus]}</span>
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
      )}
    </AnimatePresence>
  );
};
