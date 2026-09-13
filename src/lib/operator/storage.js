const STORAGE_KEY = 'zakacoding.operator.session.v1';

export const readOperatorSession = () => {
  try {
    const session = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!session?.token) return null;

    if (session.expiresAt && Date.parse(session.expiresAt) <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const saveOperatorSession = ({ token, expiresAt = null, operator = null }) => {
  const session = { token, expiresAt, operator };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
};

export const clearOperatorSession = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};

export const getOperatorDeviceName = () => {
  const userAgent = navigator.userAgent || '';
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  if (/iPhone/i.test(userAgent)) return standalone ? 'Zaka Desk · iPhone' : 'Safari · iPhone';
  if (/iPad/i.test(userAgent) || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1)) {
    return standalone ? 'Zaka Desk · iPad' : 'Safari · iPad';
  }
  if (/Macintosh/i.test(userAgent)) return 'Safari · Mac';
  return 'Zaka Desk · Web';
};
