/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

import { createPortfolioEcho } from '../lib/realtime';
import { getWorkDeskViewer, joinWorkDesk, sendWorkCursor } from '../lib/workDesk';

const IDLE_MS = 3000;
const SEND_MS = 85;
const MAX_CURSORS = 12;
const COLORS = ['#bd513b', '#276477', '#75613e', '#6a5a8c', '#3c7158'];
const PREVIEW_X = 85;
const PREVIEW_Y = 35;

function CursorArrow() {
  return <svg viewBox="0 0 18 23" fill="none" aria-hidden="true"><path d="M1 1v18l4.4-4.5 3.1 7 3.2-1.4-3.1-6.8H16L1 1Z" fill="currentColor" stroke="white" strokeWidth="1.5" /></svg>;
}

const validName = (value) => {
  const name = value.trim().replace(/ +/gu, ' ');
  return name.length >= 2 && name.length <= 24 && /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} .'_-]*$/u.test(name) ? name : null;
};

export function WorkDeskPresence({ boardRef, meeting }) {
  const stickerX = useMotionValue(0);
  const stickerY = useMotionValue(0);
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState(null);
  const [viewerIdentity, setViewerIdentity] = useState(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [cursors, setCursors] = useState({});
  const [ownCursor, setOwnCursor] = useState(null);
  const [board, setBoard] = useState(null);
  const [previewHover, setPreviewHover] = useState(false);
  const controlRef = useRef(null);
  const inputRef = useRef(null);
  const members = useRef(new Map());
  const live = useRef(false);
  const pending = useRef(null);
  const lastSent = useRef(0);
  const timer = useRef(null);
  const previewX = useMotionValue(PREVIEW_X);
  const previewY = useMotionValue(PREVIEW_Y);
  const pointerX = useSpring(previewX, { stiffness: 550, damping: 34 });
  const pointerY = useSpring(previewY, { stiffness: 550, damping: 34 });
  const echoX = useSpring(previewX, { stiffness: 120, damping: 22 });
  const echoY = useSpring(previewY, { stiffness: 120, damping: 22 });
  const reducedMotion = useReducedMotion();
  const connectionIdentity = identity || viewerIdentity;

  useEffect(() => { setBoard(boardRef.current); }, [boardRef]);

  useEffect(() => {
    let disposed = false;
    let refreshTimer;
    const connectViewer = async () => {
      try {
        const viewer = await getWorkDeskViewer();
        if (disposed) return;
        if (!viewer?.id || !viewer?.token) throw new Error('Invalid viewer identity');
        const refreshIn = Date.parse(viewer.expires_at) - Date.now() - 30000;
        if (!Number.isFinite(refreshIn)) throw new Error('Invalid viewer expiry');
        setViewerIdentity(viewer);
        refreshTimer = window.setTimeout(connectViewer, Math.max(1000, refreshIn));
      } catch {
        if (!disposed) refreshTimer = window.setTimeout(connectViewer, 30000);
      }
    };
    void connectViewer();
    return () => {
      disposed = true;
      window.clearTimeout(refreshTimer);
    };
  }, []);

  const movePreview = (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const rect = event.currentTarget.getBoundingClientRect();
    previewX.set(Math.min(Math.max(event.clientX - rect.left, 12), rect.width - 65));
    previewY.set(Math.min(Math.max(event.clientY - rect.top, 8), rect.height - 45));
  };
  const resetPreview = () => {
    setPreviewHover(false);
    previewX.set(PREVIEW_X);
    previewY.set(PREVIEW_Y);
  };

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onPointerDown = (event) => {
      if (!controlRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        controlRef.current?.querySelector('.work-presence-tag')?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

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
    if (!connectionIdentity) return undefined;
    const echo = createPortfolioEcho('/api/work/desk/broadcasting/auth', connectionIdentity.token);
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
      setError('');
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
      if (disposed || !live.current || payload?.id === connectionIdentity.id || !members.current.has(payload?.id)) return;
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
    const onError = () => {
      if (disposed) return;
      live.current = false;
      members.current.clear();
      setCursors({});
      setStatus('unavailable');
    };
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
  }, [connectionIdentity]);

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
      setOwnCursor(pending.current);
      if (timer.current === null) timer.current = window.setTimeout(send, Math.max(0, SEND_MS - (Date.now() - lastSent.current)));
    };
    const stop = () => {
      pending.current = null;
      setOwnCursor(null);
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
      setOpen(false);
      setStatus('connecting');
    } catch {
      setStatus('idle');
      setError('Could not join the live desk. Please try again.');
    }
  };

  const leave = () => {
    setIdentity(null);
    setOwnCursor(null);
    setStatus('idle');
    setCursors({});
    setError('');
    setOpen(false);
  };

  const identityColor = identity ? COLORS[Array.from(identity.id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length] : COLORS[0];

  const visible = Object.entries(cursors).filter(([id]) => members.current.has(id)).sort((a, b) => b[1].at - a[1].at).slice(0, MAX_CURSORS);

  return (
    <>
      <div className={`work-presence-control${identity ? ' is-joined' : ''}`} ref={controlRef}>
        {identity ? (
          <div className="work-presence-tag work-presence-tag-joined">
            <span className="work-presence-status" role="status"><span className={`work-presence-live-dot${status === 'live' ? ' is-live' : ''}`} aria-hidden="true" />{status === 'live' ? `Here as ${identity.name}` : status === 'unavailable' ? 'Desk unavailable' : 'Connecting…'}</span>
            <button type="button" onClick={leave}>Hide me</button>
          </div>
        ) : (
          <>
            <button className="work-presence-tag" type="button" aria-expanded={open} aria-controls="work-presence-card" onClick={() => setOpen((value) => !value)}><span aria-hidden="true">✎</span> Leave your name here <span aria-hidden="true">↗</span></button>
            {open && <form id="work-presence-card" className="work-presence-card" onSubmit={submit}>
              <label htmlFor="work-presence-name">What should we call you?</label>
              <p>Want others to see you wandering around?</p>
              <div className="work-presence-entry"><input ref={inputRef} id="work-presence-name" value={name} onChange={(event) => { setName(event.target.value); if (error) setError(''); }} placeholder="Your name…" aria-describedby="work-presence-note" maxLength={100} autoComplete="off" required /><button type="submit" disabled={status === 'joining'}>{status === 'joining' ? 'One sec…' : 'Appear'}</button></div>
              <small id="work-presence-note">Anyone viewing this page can see your named cursor while you’re here.</small>
              {error && <span className="work-presence-error" role="alert">{error}</span>}
            </form>}
          </>
        )}
      </div>
      {identity && board && createPortal(
        <motion.div className="desk-visitor-sticker" style={{ x: stickerX, y: stickerY, '--sticker-color': identityColor }} drag={!meeting} dragConstraints={boardRef} dragMomentum={false} dragElastic={0.05} whileDrag={{ scale: reducedMotion ? 1 : 1.03, zIndex: 30 }} role="group" aria-label={`Visitor sticker for ${identity.name}`}>
          <button className="desk-sticker-grip" type="button" disabled={meeting} aria-label="Move your name sticker. Drag or use arrow keys." onKeyDown={(event) => {
            const move = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[event.key];
            if (!move) return;
            event.preventDefault();
            const bounds = board.getBoundingClientRect();
            const sticker = event.currentTarget.parentElement.getBoundingClientRect();
            stickerX.set(stickerX.get() + Math.max(bounds.left - sticker.left, Math.min(move[0], bounds.right - sticker.right)));
            stickerY.set(stickerY.get() + Math.max(bounds.top - sticker.top, Math.min(move[1], bounds.bottom - sticker.bottom)));
          }}><strong>HELLO</strong><span>I&apos;m</span></button>
          <b>{identity.name}</b><small>glad you pulled up a chair.</small>
        </motion.div>, board)}
      {!identity && !open && board && createPortal(
        <button
          className={`work-presence-invite${previewHover ? ' is-hovered' : ''}`}
          type="button"
          aria-label="Leave your name to show your cursor on the desk"
          onPointerEnter={(event) => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') { setPreviewHover(true); movePreview(event); } }}
          onPointerMove={movePreview}
          onPointerLeave={resetPreview}
          onClick={() => { resetPreview(); setOpen(true); }}
        >
          <span className="work-presence-invite-art" aria-hidden="true">
            <motion.span className="work-invite-pointer is-echo" style={{ x: echoX, y: echoY }}><CursorArrow /></motion.span>
            <motion.span className="work-invite-pointer is-main" style={{ x: reducedMotion ? previewX : pointerX, y: reducedMotion ? previewY : pointerY }}><CursorArrow /><span>you?</span></motion.span>
          </span>
          <span className="work-presence-invite-copy"><strong>Your cursor could be here.</strong><small>Move around · leave your name ↗</small></span>
        </button>, board)}
      {connectionIdentity && boardRef.current && createPortal(<div className="work-cursors" aria-hidden="true">
        {visible.map(([id, cursor]) => (
          <div className="work-cursor" key={id} style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%`, '--cursor-color': COLORS[Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length] }}>
            <svg viewBox="0 0 18 23" fill="none"><path d="M1 1v18l4.4-4.5 3.1 7 3.2-1.4-3.1-6.8H16L1 1Z" fill="currentColor" stroke="white" strokeWidth="1.5" /></svg>
            <span>{members.current.get(id)}</span>
          </div>
        ))}
        {identity && ownCursor && <div className="work-cursor is-own" style={{ left: `${ownCursor.x * 100}%`, top: `${ownCursor.y * 100}%`, '--cursor-color': identityColor }}><span>yours</span></div>}
      </div>, boardRef.current)}
    </>
  );
}
