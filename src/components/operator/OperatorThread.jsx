/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp, Check2, ChatDots } from 'react-bootstrap-icons';

import { MAX_MESSAGE_LENGTH } from '../../lib/conversation/types';

const conversationName = (conversation) => (
  conversation?.displayName || `Visitor · ${conversation?.id?.slice(-5).toUpperCase() || ''}`
);

const messageTime = (value) => {
  const timestamp = Date.parse(value);
  if (!timestamp) return '';
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(timestamp);
};

export function OperatorThread({
  conversation,
  isLoading,
  isSending,
  notice,
  onBack,
  onSend,
  onTyping,
  selectedId,
}) {
  const [body, setBody] = useState('');
  const messageListRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    setBody('');
    if (textareaRef.current) textareaRef.current.style.height = '';
  }, [selectedId]);

  useEffect(() => {
    const node = messageListRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [conversation?.messages]);

  useEffect(() => () => window.clearTimeout(typingTimerRef.current), []);

  const updateBody = (event) => {
    const { value } = event.target;
    setBody(value);
    event.target.style.height = 'auto';
    event.target.style.height = `${Math.min(event.target.scrollHeight, 112)}px`;
    onTyping(Boolean(value.trim()));
    window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => onTyping(false), 1800);
  };

  const submit = async (event) => {
    event.preventDefault();
    const cleanBody = body.trim();
    if (!cleanBody || cleanBody.length > MAX_MESSAGE_LENGTH || isSending) return;
    setBody('');
    if (textareaRef.current) textareaRef.current.style.height = '';
    onTyping(false);
    const sent = await onSend(cleanBody);
    if (!sent) setBody(cleanBody);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  if (!selectedId) {
    return (
      <section className="operator-thread operator-thread-empty">
        <span><ChatDots aria-hidden="true" /></span>
        <h2>Your conversations live here.</h2>
        <p>Choose one from the inbox to read and reply.</p>
      </section>
    );
  }

  return (
    <section className={`operator-thread ${selectedId ? 'is-mobile-visible' : ''}`} aria-label="Selected conversation">
      <header className="operator-thread-header">
        <button className="operator-mobile-back" aria-label="Back to inbox" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" />
        </button>
        <span className="operator-visitor-avatar is-small" aria-hidden="true">
          {conversation?.displayName?.charAt(0)?.toUpperCase() || 'V'}
        </span>
        <div>
          <h2>{conversationName(conversation)}</h2>
          <p><i /> {conversation?.status === 'closed' ? 'Conversation closed' : 'Portfolio visitor'}</p>
          {conversation?.contactEmail && <a href={`mailto:${conversation.contactEmail}`}>Email {conversation.contactEmail}</a>}
        </div>
      </header>

      <div className="operator-thread-messages" ref={messageListRef}>
        {isLoading && <div className="operator-thread-loader">Loading conversation…</div>}
        {!isLoading && conversation?.messages?.map((message) => {
          const isOperator = message.sender.type === 'operator';
          return (
            <article className={`operator-message-row ${isOperator ? 'is-operator' : 'is-guest'}`} key={message.id}>
              <div className="operator-message-bubble">
                <p>{message.body}</p>
                <span>
                  {message.status === 'failed' ? 'Not sent' : messageTime(message.created_at)}
                  {isOperator && message.status !== 'failed' && <Check2 aria-hidden="true" />}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="operator-thread-footer">
        {notice && <p className="operator-thread-notice" role="alert">{notice}</p>}
        <form className="operator-composer" onSubmit={submit}>
          <textarea
            aria-label="Reply"
            disabled={conversation?.status === 'closed'}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={updateBody}
            onKeyDown={handleKeyDown}
            placeholder={conversation?.status === 'closed' ? 'This conversation is closed' : 'Reply…'}
            rows="1"
            ref={textareaRef}
            value={body}
          />
          <button disabled={!body.trim() || isSending || conversation?.status === 'closed'} type="submit" aria-label="Send reply">
            <ArrowUp aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
