import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Alt } from 'react-bootstrap-icons';
import './WorkNavbar.css';

const destinations = [
  { to: '/', label: 'Home', aside: 'Back to pretending this is a tidy website.', Icon: ArrowLeft },
  { to: '/about', label: 'About', aside: 'Yes, a real human made this mess.', Icon: Alt },
  { to: 'https://path.cv/zakanoor', label: 'Resume', aside: 'Same human. Business trousers.', Icon: ArrowUpRight, external: true },
];

export function WorkNavbar() {
  const [open, setOpen] = useState(false);
  const [aside, setAside] = useState('A tiny menu. Big escape plans.');
  const root = useRef(null);
  const trigger = useRef(null);
  const closeTimer = useRef(null);

  const cancelClose = () => clearTimeout(closeTimer.current);
  const close = () => { cancelClose(); setOpen(false); };
  const reveal = () => {
    cancelClose();
    setAside('A tiny menu. Big escape plans.');
    setOpen(true);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key !== 'Escape') return;
      clearTimeout(closeTimer.current);
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const look = (event) => {
    if (event.pointerType !== 'mouse') return;
    const box = root.current.getBoundingClientRect();
    const x = Math.max(-3, Math.min(3, (event.clientX - box.left - box.width / 2) / 22));
    const y = Math.max(-2, Math.min(2, (event.clientY - box.top - 24) / 22));
    root.current.style.setProperty('--look-x', `${x}px`);
    root.current.style.setProperty('--look-y', `${y}px`);
  };

  return (
    <nav ref={root} className={`work-wayfinder${open ? ' is-open' : ''}`} aria-label="Primary navigation"
      onPointerMove={look}
      onPointerEnter={cancelClose}
      onPointerLeave={(event) => {
        root.current.style.setProperty('--look-x', '0px');
        root.current.style.setProperty('--look-y', '0px');
        if (event.pointerType === 'mouse' && !root.current.contains(document.activeElement)) {
          closeTimer.current = setTimeout(() => setOpen(false), 240);
        }
      }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
      <button ref={trigger} className="work-wayfinder-trigger nav-glass" type="button"
        aria-expanded={open} aria-controls="work-wayfinder-links"
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') reveal(); }}
        onClick={(event) => {
          if (event.detail > 0 && window.matchMedia('(hover: hover) and (pointer: fine)').matches) reveal();
          else { cancelClose(); setOpen(value => !value); }
        }}>
        <span className="work-wayfinder-eyes" aria-hidden="true"><i /><i /></span>
        <span className="work-wayfinder-copy">{open ? 'Going places?' : 'Where to?'}</span>
        <span className="work-wayfinder-chevron" aria-hidden="true" />
      </button>
      <div className="work-wayfinder-reveal" inert={open ? undefined : ''} aria-hidden={!open}>
        <div className="work-wayfinder-panel" id="work-wayfinder-links">
          <div className="work-wayfinder-links">
            {destinations.map(({ to, label, aside: hint, Icon, external }, index) => (
              <NavLink key={to} to={to} end target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}
                className="work-wayfinder-link" style={{ '--arrival': `${index * 45}ms` }}
                onPointerEnter={() => setAside(hint)} onFocus={() => setAside(hint)} onClick={close}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </NavLink>
            ))}
          </div>
          <p className="work-wayfinder-aside" key={aside}>{aside}</p>
        </div>
      </div>
    </nav>
  );
}
