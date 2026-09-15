import { useCallback, useEffect, useState } from 'react';
import { disablePushSubscription, pushSupport, syncPushSubscription, testPushSubscription } from '../lib/conversation/push';

export const usePushNotifications = (session, operator = false) => {
  const [state, setState] = useState(pushSupport);
  const [notice, setNotice] = useState('');
  const [subscriptionId, setSubscriptionId] = useState(null);
  const preferenceKey = `zakacoding.push.${operator ? 'operator' : session?.id}`;

  const synchronize = useCallback(async (prompt = false) => {
    if (!session) return;
    setState('saving'); setNotice('');
    try {
      const result = await syncPushSubscription(session, operator, prompt);
      setState(result?.state || result);
      setSubscriptionId(result?.id || null);
      if (result?.state === 'enabled') {
        try { localStorage.setItem(preferenceKey, 'enabled'); } catch { /* Server registration is still valid. */ }
      }
    } catch (error) { setState('error'); setNotice(error.message); }
  }, [session, operator, preferenceKey]);

  useEffect(() => {
    let optedIn = false;
    try { optedIn = localStorage.getItem(preferenceKey) === 'enabled'; } catch { /* Permission can be enabled manually. */ }
    if (session && optedIn) synchronize();
  }, [session, preferenceKey, synchronize]);

  const disable = async () => {
    setState('saving');
    try {
      await disablePushSubscription(session, operator);
      try { localStorage.removeItem(preferenceKey); } catch { /* Keep local state accurate for this visit. */ }
      setState('default'); setNotice('Notifications turned off for this conversation.');
    } catch (error) { setState('error'); setNotice(error.message); }
  };

  const test = async () => {
    try { await testPushSubscription(session, subscriptionId, operator); setNotice('Test queued. A notification should arrive on this device shortly.'); }
    catch (error) { setNotice(error.message); }
  };

  return { state, notice, enable: () => synchronize(true), disable, test };
};
