/* eslint-disable react/prop-types */

import { useEffect, useRef } from 'react';

import { MAX_MESSAGE_LENGTH } from '../../lib/conversation/types';

const CHAR_WARN_THRESHOLD = 100;

export const ConversationComposer = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef(null);
  const canSend = value.trim().length > 0 && !disabled;
  const remaining = MAX_MESSAGE_LENGTH - value.length;
  const showCounter = remaining <= CHAR_WARN_THRESHOLD;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (canSend) onSend();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <form className="conversation-composer" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="conversation-message-input">Write a message</label>
      <textarea
        ref={textareaRef}
        id="conversation-message-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a message…"
        maxLength={MAX_MESSAGE_LENGTH}
        rows={1}
        disabled={disabled}
        aria-describedby="conversation-composer-hint"
      />
      <button type="submit" aria-label="Send message" disabled={!canSend}>↑</button>
      <span id="conversation-composer-hint" className="conversation-composer-hint">
        Enter to send · Shift + Enter for a new line
      </span>
      {showCounter && (
        <span className={`conversation-composer-counter${remaining <= 20 ? ' is-critical' : ''}`} aria-live="polite">
          {remaining}
        </span>
      )}
    </form>
  );
};
