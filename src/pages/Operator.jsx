import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { OperatorInbox } from '../components/operator/OperatorInbox';
import { OperatorLogin } from '../components/operator/OperatorLogin';
import { OperatorThread } from '../components/operator/OperatorThread';
import { useOperatorChat } from '../hooks/useOperatorChat';
import './Operator.css';

const ensureMeta = (name, content) => {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  const previous = element.content;
  element.content = content;
  return () => { element.content = previous; };
};

export default function Operator() {
  const chat = useOperatorChat();
  const location = useLocation();
  const openedFromPush = useRef(null);
  const notificationConversation = new URLSearchParams(location.search).get('conversation');
  useEffect(() => {
    if (chat.isReady && notificationConversation && openedFromPush.current !== notificationConversation) {
      openedFromPush.current = notificationConversation;
      chat.openConversation(notificationConversation);
    }
  }, [chat, notificationConversation]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Zaka Desk';
    document.body.classList.add('operator-page-active');

    // Safari only considers the first manifest link when creating a Home
    // Screen shortcut. Reuse the site's existing link instead of appending a
    // second manifest, otherwise it may install the portfolio shortcut.
    const manifest = document.querySelector('#site-manifest, link[rel="manifest"]');
    const createdManifest = !manifest;
    const previousManifestHref = manifest?.getAttribute('href');
    const operatorManifest = manifest || document.createElement('link');
    operatorManifest.id = operatorManifest.id || 'site-manifest';
    operatorManifest.rel = 'manifest';
    operatorManifest.href = '/operator.webmanifest';
    if (createdManifest) document.head.appendChild(operatorManifest);
    const restoreCapable = ensureMeta('apple-mobile-web-app-capable', 'yes');
    const restoreTitle = ensureMeta('apple-mobile-web-app-title', 'Zaka Desk');
    const restoreStatusBar = ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');

    return () => {
      document.title = previousTitle;
      document.body.classList.remove('operator-page-active');
      if (createdManifest) operatorManifest.remove();
      else if (previousManifestHref) operatorManifest.href = previousManifestHref;
      restoreCapable();
      restoreTitle();
      restoreStatusBar();
    };
  }, []);

  if (chat.isChecking) {
    return <main className="operator-boot" aria-live="polite"><span>Za</span><p>Opening desk…</p></main>;
  }

  if (!chat.isReady) {
    return <OperatorLogin isAuthenticating={chat.isAuthenticating} notice={chat.notice} onLogin={chat.login} />;
  }

  return (
    <main className="operator-shell">
      <div className="operator-app">
        <OperatorInbox
          conversations={chat.conversations}
          isLoading={chat.isLoadingInbox}
          onLogout={chat.logout}
          onOpen={chat.openConversation}
          onRefresh={chat.refreshInbox}
          pushNotifications={chat.pushNotifications}
          operator={chat.operator}
          realtimeStatus={chat.realtimeStatus}
          selectedId={chat.selectedId}
        />
        <OperatorThread
          conversation={chat.selectedConversation}
          isLoading={chat.isLoadingThread}
          isSending={chat.isSending}
          notice={chat.notice}
          onBack={chat.showInbox}
          onSend={chat.sendMessage}
          onTyping={chat.whisperTyping}
          selectedId={chat.selectedId}
        />
      </div>
    </main>
  );
}
