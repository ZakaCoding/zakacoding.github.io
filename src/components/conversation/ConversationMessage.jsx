/* eslint-disable react/prop-types */

import { motion, useReducedMotion } from 'framer-motion';

export const ConversationMessage = ({ message, onRetry }) => {
  const reducedMotion = useReducedMotion();
  const isOperator = message.sender.type === 'operator';
  const isFailed = message.status === 'failed';
  const isSending = message.status === 'sending';
  const isInitial = message.id.startsWith('initial-');

  return (
    <motion.li
      className={`conversation-message-row ${isOperator ? 'is-operator' : 'is-visitor'} ${isFailed ? 'is-failed' : ''}`}
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <article className="conversation-message">
        <p>{message.body}</p>
        {!isInitial && !isFailed && !isSending && <span className="conversation-message-meta"><time dateTime={message.created_at} title={new Date(message.created_at).toLocaleString()}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>{!isOperator && ' · Sent'}</span>}
        {isSending && <span className="conversation-message-meta">Sending…</span>}
        {isFailed && (
          <button type="button" className="conversation-message-retry" onClick={() => onRetry(message)}>
            Failed to send · Retry
          </button>
        )}
      </article>
    </motion.li>
  );
};
