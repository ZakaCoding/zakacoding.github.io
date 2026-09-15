import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import poster from '../assets/image/memoji-poster.webp';
import animationUrl from '../assets/lottie/memoji-optimized.json?url';

const Player = lazy(() => import('@lottiefiles/react-lottie-player').then((module) => ({ default: module.Player })));

export const MemojiWink = () => {
  const container = useRef(null);
  const animation = useRef(null);
  const hovered = useRef(false);
  const [nearby, setNearby] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const play = () => {
    hovered.current = true;
    if (!animation.current || reducedMotion) return;
    animation.current.setSegment(0, 25);
    animation.current.setDirection(1);
    animation.current.setSpeed(2.1);
    animation.current.play();
  };
  const release = () => {
    hovered.current = false;
    if (!animation.current) return;
    animation.current.setDirection(-1);
    animation.current.setSpeed(1.25);
    animation.current.play();
  };
  const fallback = <img src={poster} width="586" height="586" alt="Zaka’s Memoji" />;
  return <div className="about-classic-memoji-player" ref={container} onMouseEnter={play} onMouseLeave={release}>
    {nearby && !reducedMotion ? <Suspense fallback={fallback}><Player src={animationUrl} keepLastFrame speed={2.1} style={{ width: '100%', height: 'auto' }} lottieRef={(instance) => { animation.current = instance; if (hovered.current) play(); }} /></Suspense> : fallback}
  </div>;
};
