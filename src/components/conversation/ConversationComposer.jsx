/* eslint-disable react/prop-types */

import { useEffect, useRef } from 'react';

import { MAX_MESSAGE_LENGTH } from '../../lib/conversation/types';

export const ConversationComposer = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef(null);
  const canSend = value.trim().length > 0 && !disabled;

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
    </form>
  );
};
