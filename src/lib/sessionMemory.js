// Remove old plaintext credentials on every entry, including Home. Credentials
// now live only in module memory and are discarded when the document closes.
export const clearLegacyCredentials = () => {
  for (const key of ['zakacoding.operator.session.v1', 'zakacoding.conversation.v1']) {
    try { window.localStorage.removeItem(key); } catch { /* Storage may be disabled. */ }
  }
};

clearLegacyCredentials();
