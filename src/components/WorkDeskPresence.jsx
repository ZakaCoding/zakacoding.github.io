/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { createPortfolioEcho } from '../lib/realtime';
import { joinWorkDesk, sendWorkCursor } from '../lib/workDesk';

const IDLE_MS = 3000;
const SEND_MS = 85;
const MAX_CURSORS = 12;
const COLORS = ['#bd513b', '#276477', '#75613e', '#6a5a8c', '#3c7158'];

const validName = (value) => {
  const name = value.trim().replace(/ +/gu, ' ');
  return name.length >= 2 && name.length <= 24 && /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} .'_-]*$/u.test(name) ? name : null;
};

export function WorkDeskPresence({ boardRef }) {
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [cursors, setCursors] = useState({});
  const members = useRef(new Map());
  const live = useRef(false);
  const pending = useRef(null);
  const lastSent = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!identity) return undefined;
    const remaining = Date.parse(identity.expires_at) - Date.now();
    if (!Number.isFinite(remaining) || remaining <= 0) {
      setIdentity(null);
      return undefined;
    }
    const timeout = window.setTimeout(() => setIdentity(null), remaining);
    return () => window.clearTimeout(timeout);
  }, [identity]);

  useEffect(() => {
    if (!identity) return undefined;
    const echo = createPortfolioEcho('/api/work/desk/broadcasting/auth', identity.token);
    if (!echo) {
      setStatus('unavailable');
      return undefined;
    }
    let disposed = false;
    setStatus('connecting');
    const channel = echo.join('work.desk');
    const putMembers = (list) => {
      members.current = new Map(list.filter((member) => typeof member.id === 'string' && typeof member.name === 'string').map((member) => [member.id, member.name]));
      setCursors((current) => Object.fromEntries(Object.entries(current).filter(([id]) => members.current.has(id))));
      live.current = true;
      setStatus('live');
    };
    channel.here((list) => { if (!disposed) putMembers(list); });
    channel.joining((member) => {
      if (disposed || !member?.id || typeof member.name !== 'string') return;
      members.current.set(member.id, member.name);
    });
    channel.leaving((member) => {
      if (disposed || !member?.id) return;
      members.current.delete(member.id);
      setCursors((current) => {
        const next = { ...current };
        delete next[member.id];
        return next;
      });
    });
    channel.listen('.work.cursor', (payload) => {
      if (disposed || !live.current || payload?.id === identity.id || !members.current.has(payload?.id)) return;
      if (payload.x === null && payload.y === null) {
        setCursors((current) => {
          const next = { ...current };
          delete next[payload.id];
          return next;
        });
        return;
      }
      if (typeof payload.x !== 'number' || typeof payload.y !== 'number'
        || !Number.isFinite(payload.x) || !Number.isFinite(payload.y)
        || payload.x < 0 || payload.x > 1 || payload.y < 0 || payload.y > 1) return;
      setCursors((current) => ({ ...current, [payload.id]: { x: payload.x, y: payload.y, at: Date.now() } }));
    });
    const connection = echo.connector?.pusher?.connection;
    const onState = ({ current }) => {
      if (disposed || current === 'connected') return;
      live.current = false;
      members.current.clear();
      setCursors({});
      setStatus('connecting');
    };
    connection?.bind('state_change', onState);
    const onError = () => { if (!disposed) { setStatus('unavailable'); setError('Could not join the live desk. Please try again.'); } };
    channel.error(onError);
    return () => {
      disposed = true;
      live.current = false;
      members.current.clear();
      setCursors({});
      connection?.unbind('state_change', onState);
      echo.leave('work.desk');
      echo.disconnect();
    };
  }, [identity]);

  useEffect(() => {
    if (!identity) return undefined;
    const board = boardRef.current;
    if (!board) return undefined;
    const send = () => {
      timer.current = null;
      if (!pending.current || !live.current || document.hidden) return;
      const position = pending.current;
      pending.current = null;
      lastSent.current = Date.now();
      void sendWorkCursor(identity.token, { active: true, ...position }).catch(() => {});
    };
    const onMove = (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      if (!live.current || document.hidden) return;
      const rect = board.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      pending.current = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
      if (timer.current === null) timer.current = window.setTimeout(send, Math.max(0, SEND_MS - (Date.now() - lastSent.current)));
    };
    const stop = () => {
      pending.current = null;
      window.clearTimeout(timer.current);
      timer.current = null;
      if (live.current) void sendWorkCursor(identity.token, null).catch(() => {});
    };
    const onVisibility = () => { if (document.hidden) stop(); };
    board.addEventListener('pointermove', onMove);
    board.addEventListener('pointerleave', stop);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      board.removeEventListener('pointermove', onMove);
      board.removeEventListener('pointerleave', stop);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [identity, boardRef]);

  useEffect(() => {
    if (!identity) return undefined;
    const interval = window.setInterval(() => {
      const cutoff = Date.now() - IDLE_MS;
      setCursors((current) => Object.fromEntries(Object.entries(current).filter(([, cursor]) => cursor.at >= cutoff)));
    }, 500);
    return () => window.clearInterval(interval);
  }, [identity]);

  const submit = async (event) => {
    event.preventDefault();
    const normalized = validName(name);
    if (!normalized) { setError('Use 2–24 letters, numbers, spaces, or simple punctuation.'); return; }
    setStatus('joining');
    setError('');
    try {
      const joined = await joinWorkDesk(normalized);
      if (!joined?.id || !joined?.token) throw new Error('Missing guest identity');
      setIdentity(joined);
      setStatus('connecting');
    } catch {
      setStatus('idle');
      setError('Could not join the live desk. Please try again.');
    }
  };

  const leave = () => {
    setIdentity(null);
    setStatus('idle');
    setCursors({});
    setError('');
  };

  const visible = Object.entries(cursors).filter(([id]) => members.current.has(id)).sort((a, b) => b[1].at - a[1].at).slice(0, MAX_CURSORS);

  return (
    <>
      <div className={`work-presence-control${identity ? ' is-joined' : ''}`}>
        {identity ? (
          <><span className="work-presence-status" role="status"><span className="work-presence-live-dot" aria-hidden="true" />{status === 'live' ? `At the desk as ${identity.name}` : status === 'unavailable' ? 'Desk unavailable' : 'Connecting to desk…'}</span><button type="button" onClick={leave}>Leave desk</button></>
        ) : (
          <form id="work-presence-form" onSubmit={submit}>
            <div className="work-presence-heading"><svg viewBox="0 0 18 23" fill="none" aria-hidden="true"><path d="M1 1v18l4.4-4.5 3.1 7 3.2-1.4-3.1-6.8H16L1 1Z" fill="currentColor" stroke="white" strokeWidth="1.5" /></svg><label htmlFor="work-presence-name">Join the desk</label></div>
            <div className="work-presence-entry"><span aria-hidden="true">Hello,</span><input id="work-presence-name" value={name} onChange={(event) => { setName(event.target.value); if (error) setError(''); }} placeholder="your name…" aria-label="Your display name" aria-describedby="work-presence-note" maxLength={100} autoComplete="off" required /><button type="submit" disabled={status === 'joining'}>{status === 'joining' ? 'Joining…' : 'Join'}</button></div>
            <p id="work-presence-note">People here will see your name while you’re joined.</p>
            {error && <span className="work-presence-error" role="alert">{error}</span>}
          </form>
        )}
        {identity && error && <span className="work-presence-error" role="alert">{error}</span>}
      </div>
      {identity && boardRef.current && createPortal(<div className="work-cursors" aria-hidden="true">
        {visible.map(([id, cursor]) => (
          <div className="work-cursor" key={id} style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%`, '--cursor-color': COLORS[Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length] }}>
            <svg viewBox="0 0 18 23" fill="none"><path d="M1 1v18l4.4-4.5 3.1 7 3.2-1.4-3.1-6.8H16L1 1Z" fill="currentColor" stroke="white" strokeWidth="1.5" /></svg>
            <span>{members.current.get(id)}</span>
          </div>
        ))}
      </div>, boardRef.current)}
    </>
  );
}
