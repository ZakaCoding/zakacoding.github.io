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

  if (conversation.isRestoring) {
    return <p className="conversation-loading-placeholder" aria-live="polite">Restoring your conversation…</p>;
  }

  if (!conversation.isStarted) {
    return (
      <div className="conversation-cta-wrap">
        <button
          type="button"
          className="about-closing-cta"
          onClick={conversation.startConversation}
          disabled={conversation.isStarting}
        >
          {conversation.isStarting ? 'Opening…' : 'Start a conversation'}
          <ArrowRight aria-hidden="true" />
        </button>
        {conversation.notice && (
          <p className="conversation-notice" role="alert">{conversation.notice}</p>
        )}
      </div>
    );
  }

  const hasVisitorMessage = conversation.messages.some((message) => message.sender.type === 'guest');
  const handleSend = () => {
    const message = draft.trim();
    if (!message) return;
    setDraft('');
    conversation.sendMessage(message);
  };

  return (
    <section className="about-conversation" aria-label="Conversation with Zaka">
      <header className="about-conversation-header">
        <span className="about-conversation-title">A small space to talk</span>
        <span className="about-conversation-status"><i /> {statusLabel[conversation.realtimeStatus]}</span>
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
        <QuickReplies onSelect={(reply) => conversation.sendMessage(reply)} disabled={conversation.isSending} />
      )}

      <ConversationComposer
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={conversation.isSending || conversation.isLoading}
      />
    </section>
  );
};
