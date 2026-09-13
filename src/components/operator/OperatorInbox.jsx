/* eslint-disable react/prop-types */

import { ArrowClockwise, BoxArrowRight, ChatDots, ChevronRight } from 'react-bootstrap-icons';

const relativeTime = (value) => {
  const timestamp = Date.parse(value);
  if (!timestamp) return '';
  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (Math.abs(seconds) < 60) return formatter.format(seconds, 'second');
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour');
  return formatter.format(Math.round(hours / 24), 'day');
};

const conversationName = (conversation) => (
  conversation.displayName || `Visitor · ${conversation.id.slice(-5).toUpperCase()}`
);

export function OperatorInbox({
  conversations,
  isLoading,
  onLogout,
  onOpen,
  onRefresh,
  operator,
  realtimeStatus,
  selectedId,
}) {
  return (
    <aside className={`operator-inbox ${selectedId ? 'has-mobile-selection' : ''}`} aria-label="Conversation inbox">
      <header className="operator-inbox-header">
        <div>
          <span className="operator-eyebrow">Zaka Desk</span>
          <h1>Conversations</h1>
        </div>
        <div className="operator-inbox-actions">
          <button aria-label="Refresh conversations" disabled={isLoading} onClick={() => onRefresh()} type="button">
            <ArrowClockwise className={isLoading ? 'is-spinning' : ''} aria-hidden="true" />
          </button>
          <button aria-label="Sign out" onClick={onLogout} type="button"><BoxArrowRight aria-hidden="true" /></button>
        </div>
      </header>

      <div className="operator-presence-row">
        <span className={`operator-live-dot is-${realtimeStatus}`} />
        <span>{realtimeStatus === 'live' ? 'Live' : realtimeStatus === 'connecting' ? 'Connecting' : 'Messages saved'}</span>
        <span className="operator-presence-name">{operator?.name || 'Zaka'}</span>
      </div>

      <div className="operator-conversation-list">
        {isLoading && !conversations.length && (
          <div className="operator-list-placeholder" aria-live="polite">
            <i /><i /><i />
          </div>
        )}

        {!isLoading && !conversations.length && (
          <div className="operator-empty-state">
            <span><ChatDots aria-hidden="true" /></span>
            <h2>Quiet for now.</h2>
            <p>New portfolio conversations will appear here.</p>
          </div>
        )}

        {conversations.map((conversation) => (
          <button
            className={`operator-conversation-row ${selectedId === conversation.id ? 'is-active' : ''}`}
            key={conversation.id}
            onClick={() => onOpen(conversation.id)}
            type="button"
          >
            <span className="operator-visitor-avatar" aria-hidden="true">
              {conversation.displayName?.charAt(0)?.toUpperCase() || 'V'}
            </span>
            <span className="operator-conversation-preview">
              <span className="operator-conversation-name">
                <strong>{conversationName(conversation)}</strong>
                <time>{relativeTime(conversation.lastMessageAt || conversation.createdAt)}</time>
              </span>
              <span className="operator-conversation-snippet">
                {conversation.lastMessage?.sender?.type === 'operator' && <b>You: </b>}
                {conversation.lastMessage?.body || 'Started a conversation'}
              </span>
            </span>
            {conversation.unreadCount > 0
              ? <span className="operator-unread-count">{Math.min(conversation.unreadCount, 99)}</span>
              : <ChevronRight className="operator-row-chevron" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </aside>
  );
}
