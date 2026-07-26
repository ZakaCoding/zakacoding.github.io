import { NavLink, useLocation } from 'react-router-dom';
import { Alt } from 'react-bootstrap-icons';
import { useEffect, useRef, useState } from 'react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About', icon: true },
  { to: 'https://path.cv/zakanoor', label: 'Resume', external: true },
];

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [pillStyle, setPillStyle] = useState({});
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const itemRefs = useRef([]);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  useEffect(() => {
    const activeIndex = links.findIndex(l =>
      l.external ? false : (l.to === '/' ? location.pathname === '/' : location.pathname.startsWith(l.to))
    );
    const el = itemRefs.current[activeIndex];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      width: elRect.width,
      transform: `translateX(${elRect.left - navRect.left}px)`,
    });
  }, [location.pathname, mounted]);

  return (
    <header
      className='fixed z-10 top-4 left-0 w-full flex justify-center navbar-header'
      style={
        mounted
          ? { transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', transform: visible ? 'translateY(0)' : 'translateY(-140%)' }
          : { animation: 'navSlideDown 0.8s cubic-bezier(0.4,0,0.2,1) forwards' }
      }
    >
      <nav ref={navRef} className='nav-glass relative flex items-center gap-1 px-2 py-2 rounded-full'>
        {/* sliding pill */}
        <span
          className='nav-pill absolute top-2 left-0 h-[calc(100%-16px)] rounded-full pointer-events-none'
          style={{ transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), width 0.4s cubic-bezier(0.4,0,0.2,1)', ...pillStyle }}
        />
        {links.map((link, i) => (
          <NavLink
            key={link.to}
            to={link.to}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer' : undefined}
            ref={el => itemRefs.current[i] = el}
            className={({ isActive }) =>
              `relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            {link.label}
            {link.icon && <Alt size={13} />}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
