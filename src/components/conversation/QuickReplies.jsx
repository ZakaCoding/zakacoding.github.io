/* eslint-disable react/prop-types */

const QUICK_REPLIES = ['Work together', 'Ask about my work', 'Just saying hi'];

export const QuickReplies = ({ onSelect, disabled }) => (
  <div className="conversation-quick-replies" aria-label="Quick replies">
    {QUICK_REPLIES.map((reply) => (
      <button key={reply} type="button" onClick={() => onSelect(reply)} disabled={disabled}>
        {reply}
      </button>
    ))}
  </div>
);
