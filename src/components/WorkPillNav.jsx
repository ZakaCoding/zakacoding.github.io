import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './WorkPillNav.css';

export function WorkPillNav() {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return <nav ref={root} className={`nav-glass work-pill-nav${open ? ' is-open' : ''}`} aria-label="Primary navigation"
    onPointerEnter={(event) => { if (event.pointerType === 'mouse') setOpen(true); }}
    onPointerLeave={(event) => { if (event.pointerType === 'mouse' && !root.current?.contains(document.activeElement)) setOpen(false); }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } }}>
    <button ref={trigger} className="work-pill-trigger" type="button" aria-expanded={open} aria-controls="work-pill-links"
      onClick={(event) => { if (event.detail === 0 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) setOpen(value => !value); else setOpen(true); }}>
      <span>{open ? 'There you go' : 'Where to?'}</span>
      <span className="work-pill-eyes" aria-hidden="true"><i /><i /></span>
    </button>
    {open && <div className="work-pill-links" id="work-pill-links">
      <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/about" onClick={() => setOpen(false)}>About <span className="work-pill-wave" aria-hidden="true">↗</span></NavLink>
      <a href="https://path.cv/zakanoor" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Resume<span className="sr-only"> opens in a new tab</span></a>
    </div>}
  </nav>;
}
