import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const bootstrap = await readFile(new URL('../public/operator-entry.js', import.meta.url), 'utf8');
const worker = await readFile(new URL('../public/chat-sw.js', import.meta.url), 'utf8');
function openPage(path) {
  const url = new URL(path, 'https://zakacoding.dev');
  const result = { events: {} };
  const window = {
    location: { pathname: url.pathname, search: url.search, hash: url.hash, replace: (value) => { result.redirect = value; } },
    history: { state: { key: 'retained' }, replaceState: (state, _, value) => { result.normalized = value; result.state = state; } },
    addEventListener: (event, handler) => { result.events[event] = handler; },
  };
  vm.runInNewContext(bootstrap, { window });
  return { window, result };
}

test('bare shortcut launch selects operator before React, including query links', () => {
  for (const path of ['/operator/', '/operator', '/operator/index.html']) {
    const { result } = openPage(path);
    assert.equal(result.normalized, '/operator/#/operator');
    assert.equal(result.redirect, undefined);
    assert.equal(result.state.key, 'retained');
  }
  assert.equal(openPage('/operator/?conversation=a%2Fb').result.normalized, '/operator/#/operator?conversation=a%2Fb');
});
test('legacy hash links move to a real document without losing the conversation', () => {
  assert.equal(openPage('/#/operator?conversation=abc').result.redirect, '/operator/#/operator?conversation=abc');
  const { window, result } = openPage('/#/about');
  window.location.hash = '#/operator';
  result.events.hashchange();
  assert.equal(result.redirect, '/operator/#/operator');
});
test('canonical push link stays on Desk and portfolio navigation leaves it', () => {
  assert.equal(openPage('/operator/#/operator?conversation=abc').result.normalized, '/operator/#/operator?conversation=abc');
  assert.equal(openPage('/operator/#/about').result.redirect, '/#/about');
  for (const path of ['/', '/#/about?chat=1', '/#/archive', '/#/operator-other']) {
    const { result } = openPage(path);
    assert.equal(result.redirect, undefined);
    assert.equal(result.normalized, undefined);
  }
});
test('built Desk has one static manifest and a separate app identity', async () => {
  const html = await readFile('dist/operator/index.html', 'utf8');
  const root = await readFile('dist/index.html', 'utf8');
  assert.equal((html.match(/rel="manifest"/g) || []).length, 1);
  assert.match(html, /rel="manifest" href="\/operator.webmanifest"/);
  assert.match(html, /apple-mobile-web-app-title" content="Zaka Desk"/);
  assert.doesNotMatch(html, /portfolio.webmanifest/);
  assert.match(root, /rel="manifest" href="\/portfolio.webmanifest"/);
  const desk = JSON.parse(await readFile('dist/operator.webmanifest', 'utf8'));
  const portfolio = JSON.parse(await readFile('dist/portfolio.webmanifest', 'utf8'));
  assert.equal(desk.id, '/operator/');
  assert.equal(desk.start_url, '/operator/');
  assert.equal(desk.scope, '/operator/');
  assert.notEqual(desk.id, portfolio.id);
});
test('operator notifications open Desk without hijacking a visitor chat window', async () => {
  const handlers = {};
  const actions = [];
  const self = {
    addEventListener: (event, handler) => { handlers[event] = handler; },
    location: { origin: 'https://zakacoding.dev' },
    registration: { showNotification: async (_, data) => { actions.push(data.data.url); } },
    clients: {
      matchAll: async () => [
        { url: 'https://zakacoding.dev/#/about', navigate: async () => assert.fail('Visitor window was selected'), focus: async () => {} },
        { url: 'https://zakacoding.dev/operator/#/operator', navigate: async (url) => { actions.push(url); }, focus: async () => { actions.push('focused'); } },
      ],
    },
  };
  vm.runInNewContext(worker, { self, URL, encodeURIComponent });
  let pending;
  handlers.push({ data: { json: () => ({ operator: true, conversation_id: 'a/b' }) }, waitUntil: (promise) => { pending = promise; } });
  await pending;
  assert.equal(actions[0], '/operator/#/operator?conversation=a%2Fb');
  handlers.notificationclick({ notification: { close() {}, data: { url: actions[0] } }, waitUntil: (promise) => { pending = promise; } });
  await pending;
  assert.equal(actions[1], 'https://zakacoding.dev/operator/#/operator?conversation=a%2Fb');
  assert.equal(actions[2], 'focused');
});
