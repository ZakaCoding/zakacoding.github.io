import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ZakaCodingLogo } from './ZakaCodingLogo';
import './StudioComingSoonToast.css';

const DISMISSED_KEY = 'zakacoding:studio-coming-soon:v1';

export function StudioComingSoonToast() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY) === 'dismissed') return undefined;
    } catch {
      // The announcement still works when browser storage is unavailable.
    }
    const timer = window.setTimeout(() => setVisible(true), 2400);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, 'dismissed');
    } catch {
      // Dismiss locally even in private/storage-restricted browsing.
    }
  }

  return (
    <>
      {/* Keep the live region mounted before the delayed announcement arrives. */}
      <span className="studio-toast-announcement" role="status" aria-live="polite" aria-atomic="true">
        {visible ? 'Dev, Welcome home. ZakaCoding Studio is coming soon.' : ''}
      </span>
      <AnimatePresence>
        {visible && (
          <motion.aside
            className="studio-coming-soon-toast"
            aria-label="ZakaCoding Studio announcement"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="studio-toast-heading">
              <span className="studio-toast-logo" aria-hidden="true"><ZakaCodingLogo /></span>
              <span className="studio-toast-name">ZakaCoding Studio</span>
              <button className="studio-toast-dismiss" type="button" onClick={dismiss} aria-label="Dismiss studio announcement">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <h2 className="studio-toast-title">Dev, Welcome home</h2>
            <p className="studio-toast-copy">A little studio for curious ideas.</p>
            <div className="studio-toast-footer">
              <span className="studio-toast-status">Coming soon</span>
              <a className="studio-toast-domain" href="https://studio.zakacoding.dev" target="_blank" rel="noopener noreferrer" aria-label="Visit ZakaCoding Studio, opens in a new tab">studio.zakacoding.dev</a>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
