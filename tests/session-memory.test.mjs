import assert from 'node:assert/strict';
import test from 'node:test';
import { clearLegacyCredentials } from '../src/lib/sessionMemory.js';
import { readOperatorSession, saveOperatorSession, clearOperatorSession } from '../src/lib/operator/storage.js';
import { readConversationSession, saveConversationSession, clearConversationSession } from '../src/lib/conversation/storage.js';

test('legacy credentials are removed while unrelated preferences are retained', () => {
  const storage = new Map([
    ['zakacoding.operator.session.v1', 'legacy fixture'],
    ['zakacoding.conversation.v1', 'legacy fixture'],
    ['sound', 'off'],
  ]);
  globalThis.window = { localStorage: { removeItem: (key) => storage.delete(key), setItem: () => assert.fail('Credentials must not be persisted') } };
  clearLegacyCredentials();
  assert.deepEqual([...storage], [['sound', 'off']]);
});

test('operator credentials stay in memory with a bounded lifetime and explicit logout', () => {
  const before = Date.now();
  const session = saveOperatorSession({ token: 'test-operator-token' });
  assert.ok(Date.parse(session.expiresAt) <= Date.now() + 8 * 60 * 60 * 1000);
  assert.ok(Date.parse(session.expiresAt) >= before + 8 * 60 * 60 * 1000);
  session.token = 'mutated';
  assert.equal(readOperatorSession().token, 'test-operator-token');
  const earlierExpiry = new Date(Date.now() + 1000).toISOString();
  assert.equal(saveOperatorSession({ token: 'test-operator-token', expiresAt: earlierExpiry }).expiresAt, earlierExpiry);
  assert.throws(() => saveOperatorSession({ token: 'test-operator-token', expiresAt: 'invalid' }), /expired/);
  assert.throws(() => saveOperatorSession({ token: 'test-operator-token', expiresAt: '2000-01-01' }), /expired/);
  clearOperatorSession();
  assert.equal(readOperatorSession(), null);
});

test('visitor credentials survive route remounts but are never written to browser storage', () => {
  saveConversationSession({ id: 'test-conversation', token: 'test-visitor-token' });
  assert.deepEqual(readConversationSession(), { id: 'test-conversation', token: 'test-visitor-token' });
  const snapshot = readConversationSession();
  snapshot.token = 'mutated';
  assert.equal(readConversationSession().token, 'test-visitor-token');
  clearConversationSession();
  assert.equal(readConversationSession(), null);
});
