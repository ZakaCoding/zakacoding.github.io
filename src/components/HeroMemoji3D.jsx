import { useEffect, useRef, useState } from 'react';

import portrait from '../assets/image/zaka-memoji-screenlit.webp';

export function HeroMemoji3D() {
  const mount = useRef(null);
  const scene = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return undefined;
    let cancelled = false;

    import('./heroMemojiScene').then(({ createHeroMemojiScene }) => {
      if (!mount.current || cancelled) return null;
      return createHeroMemojiScene(mount.current, portrait);
    }).then((instance) => {
      if (!instance) return;
      if (cancelled) instance.dispose();
      else {
        scene.current = instance;
        if (mount.current?.parentElement?.matches(':hover')) instance.enter();
        setReady(true);
      }
    }).catch(() => {
      // Keep the exact portrait visible if WebGL or texture loading is unavailable.
      if (!cancelled) setReady(false);
    });

    return () => {
      cancelled = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  const move = (event) => {
    if (event.pointerType !== 'mouse') return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    scene.current?.move(
      ((event.clientX - left) / width - 0.5) * 2,
      ((event.clientY - top) / height - 0.5) * 2,
    );
  };

  return (
    <div
      className="hero-memoji-figure"
      role="img"
      aria-label="Zaka's animated Memoji peeking behind a sticker-covered laptop"
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') scene.current?.enter(); }}
      onPointerMove={move}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') scene.current?.leave(); }}
      onPointerDown={(event) => { if (event.pointerType !== 'mouse') scene.current?.tap(); }}
    >
      <img src={portrait} className={`hero-memoji-fallback ${ready ? 'is-hidden' : ''}`} alt="" width="1120" height="1404" />
      <div className="hero-memoji-canvas" ref={mount} aria-hidden="true" />
    </div>
  );
}
