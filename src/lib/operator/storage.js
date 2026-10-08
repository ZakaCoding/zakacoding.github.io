import { clearLegacyCredentials } from '../sessionMemory.js';

const MAX_SESSION_AGE = 8 * 60 * 60 * 1000;
let activeSession = null;

export const readOperatorSession = () => {
  if (activeSession && Date.parse(activeSession.expiresAt) > Date.now()) return { ...activeSession };
  activeSession = null;
  return null;
};

export const saveOperatorSession = ({ token, expiresAt = null, operator = null }) => {
  if (typeof token !== 'string' || !token) throw new Error('The server did not return an operator token.');
  const serverExpiry = expiresAt ? Date.parse(expiresAt) : Infinity;
  const deadline = Math.min(serverExpiry, Date.now() + MAX_SESSION_AGE);
  if (!Number.isFinite(deadline) || deadline <= Date.now()) throw new Error('The operator session has expired. Sign in again.');
  activeSession = { token, expiresAt: new Date(deadline).toISOString(), operator };
  return { ...activeSession };
};

export const clearOperatorSession = () => {
  activeSession = null;
  clearLegacyCredentials();
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
