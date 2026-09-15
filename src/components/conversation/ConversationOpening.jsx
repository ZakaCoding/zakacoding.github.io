import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { INITIAL_MESSAGES } from '../../lib/conversation/types';
import { ConversationMessage } from './ConversationMessage';

/* eslint-disable react/prop-types */
export const ConversationOpening = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete(false);
      return undefined;
    }

    const characters = Array.from(INITIAL_MESSAGES[messageIndex].body);
    const delay = characterCount === 0 ? 650 : characterCount < characters.length ? 55 : 500;
    const timer = window.setTimeout(() => {
      if (characterCount < characters.length) {
        setCharacterCount((count) => count + 1);
      } else if (messageIndex < INITIAL_MESSAGES.length - 1) {
        setMessageIndex((index) => index + 1);
        setCharacterCount(0);
      } else {
        onComplete(false);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [characterCount, messageIndex, onComplete, reducedMotion]);

  return (
    <>
      {INITIAL_MESSAGES.slice(0, messageIndex).map((message) => (
        <ConversationMessage key={message.id} message={message} />
      ))}
      {characterCount === 0 ? (
        <li className="conversation-message-row is-operator" aria-label="Zaka is typing">
          <article className="conversation-message">
            <span className="conversation-typing-indicator" aria-hidden="true"><i /><i /><i /></span>
          </article>
        </li>
      ) : (
        <ConversationMessage
          key={INITIAL_MESSAGES[messageIndex].id}
          message={{ ...INITIAL_MESSAGES[messageIndex], body: Array.from(INITIAL_MESSAGES[messageIndex].body).slice(0, characterCount).join('') }}
        />
      )}
    </>
  );
};
