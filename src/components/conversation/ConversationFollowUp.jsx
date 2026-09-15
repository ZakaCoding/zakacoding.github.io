/* eslint-disable react/prop-types */
import { useState } from 'react';
import { saveConversationContact } from '../../lib/conversation/api';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export const ConversationFollowUp = ({ session, contactEmail, onContactSaved }) => {
  const push = usePushNotifications(session);
  const [email, setEmail] = useState(contactEmail);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setNotice('');
    try {
      await saveConversationContact({ ...session, email });
      onContactSaved(email); setNotice(email ? 'Saved. I can follow up at this address.' : 'Email removed.');
    } catch { setNotice('Couldn’t save your email. Try again, or email me directly below.'); }
    finally { setSaving(false); }
  };
  return (
    <details className="conversation-follow-up">
      <summary>Get a reply when you’re away</summary>
      <p>I may be away from my desk. Turn on reply notifications or leave an email for a personal follow-up.</p>
      {push.state === 'unsupported' ? <p>On iPhone or iPad, add this site to your Home Screen and open it there to enable notifications.</p> : (
        <div className="conversation-follow-up-actions">
          <button type="button" disabled={push.state === 'saving' || push.state === 'denied'} onClick={push.state === 'enabled' ? push.disable : push.enable}>
            {push.state === 'enabled' ? 'Turn off reply notifications' : push.state === 'saving' ? 'Saving…' : 'Notify me of replies'}
          </button>
          {push.state === 'enabled' && <button type="button" onClick={push.test}>Send a test</button>}
          {push.state === 'denied' && <p>Notifications are blocked. You can allow them in your browser’s site settings.</p>}
        </div>
      )}
      {push.notice && <p role="status">{push.notice}</p>}
      <form onSubmit={save}>
        <label htmlFor="conversation-contact-email">Email for follow-up (optional)</label>
        <div><input id="conversation-contact-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><button disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></div>
        <small>Shared with Zaka for this conversation. Clear the field and save to remove it.</small>
      </form>
      {notice && <p role="status">{notice}</p>}
    </details>
  );
};
