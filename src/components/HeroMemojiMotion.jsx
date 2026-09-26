import { useEffect, useRef, useState } from 'react';

import portrait from '../assets/image/zaka-memoji-screenlit.webp';
import glance from '../assets/image/zaka-memoji-glance.webp';

export function HeroMemojiMotion() {
  const [reacting, setReacting] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const move = (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    event.currentTarget.style.setProperty('--head-x', `${x.toFixed(1)}px`);
    event.currentTarget.style.setProperty('--head-y', `${y.toFixed(1)}px`);
  };

  const leave = (event) => {
    if (event.pointerType !== 'mouse') return;
    setReacting(false);
    event.currentTarget.style.setProperty('--head-x', '0px');
    event.currentTarget.style.setProperty('--head-y', '0px');
  };

  const tap = () => {
    setReacting(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setReacting(false), 1900);
  };

  return (
    <button
      className="hero-memoji-motion"
      type="button"
      aria-label="Watch Zaka's Memoji react"
      data-reacting={reacting}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setReacting(true); }}
      onPointerMove={move}
      onPointerLeave={leave}
      onClick={tap}
    >
      <svg className="hero-memoji-art" viewBox="0 0 1120 1404" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="memoji-face-window"><rect width="1120" height="753" /></clipPath>
          <clipPath id="memoji-laptop-window"><rect y="752" width="1120" height="652" /></clipPath>
          <radialGradient id="memoji-screen-light">
            <stop stopColor="#b9d8ff" stopOpacity=".23" />
            <stop offset="1" stopColor="#b9d8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g clipPath="url(#memoji-face-window)">
          <g className="hero-memoji-head-track">
            <g className="hero-memoji-head-breathe">
              <image href={portrait} width="1120" height="1404" />
              <image className="hero-memoji-glance" href={glance} width="1120" height="1404" />
            </g>
          </g>
          <ellipse className="hero-memoji-screen-glow" cx="560" cy="716" rx="300" ry="125" fill="url(#memoji-screen-light)" />
        </g>
        <g clipPath="url(#memoji-laptop-window)">
          <image href={portrait} width="1120" height="1404" />
        </g>
      </svg>
    </button>
  );
}
