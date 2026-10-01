import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './PaperIndexNav.css';

const destinations = [
  { to: '/', label: 'Home', aside: 'Shoes off, tabs open', mark: 'home' },
  { to: '/about', label: 'About', aside: 'The person behind the tabs', mark: 'about' },
  { to: '/archive', label: 'Work', aside: 'Please mind the ideas', mark: 'work' },
  { to: 'https://path.cv/zakanoor', label: 'Resume', aside: 'Me, in a sensible font', mark: 'resume', external: true },
];

export function PaperIndexNav() {
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

  return <nav ref={root} className={`paper-index${open ? ' is-open' : ''}`} aria-label="Primary navigation"
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } }}>
    <button ref={trigger} className="paper-index-trigger" type="button" aria-expanded={open} aria-controls="paper-index-pages" onClick={() => setOpen(value => !value)}>
      <span className="paper-index-tab-number" aria-hidden="true">Z / 04</span>
      <span>{open ? 'Pick a place' : 'Where to?'}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12M6 12h12M6 16h8" /><path className="paper-index-cross" d="m7 7 10 10M17 7 7 17" /></svg>
    </button>
    <div id="paper-index-pages" className="paper-index-panel" hidden={!open}>
      <div className="paper-index-heading"><span>A SMALL CHANGE OF SCENERY</span><span aria-hidden="true">↘</span></div>
      <div className="paper-index-cards">
        {destinations.map((page, index) => <NavLink key={page.to} to={page.to} end target={page.external ? '_blank' : undefined} rel={page.external ? 'noreferrer' : undefined}
          className={({ isActive }) => `paper-index-card${isActive && !page.external ? ' is-current' : ''}`} style={{ '--card-order': index }} onClick={() => setOpen(false)}>
          <span className="paper-index-card-top"><span>0{index + 1}</span><span aria-hidden="true">{page.external ? '↗' : '↘'}</span></span>
          <span className={`paper-index-doodle doodle-${page.mark}`} aria-hidden="true"><i /><i /><i /></span>
          <strong>{page.label}</strong><span className="paper-index-aside">{page.aside}</span>
          {page.to === '/archive' && <span className="paper-index-stamp">You’re here</span>}
          {page.external && <span className="sr-only"> opens in a new tab</span>}
        </NavLink>)}
      </div>
      <div className="paper-index-foot"><span>Take your time, I live here</span><button type="button" onClick={() => { setOpen(false); trigger.current?.focus(); }}>Fold away <span aria-hidden="true">↑</span></button></div>
    </div>
  </nav>;
}
