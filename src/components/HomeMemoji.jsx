import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import portrait from '../assets/image/zaka-memoji-screenlit.webp';
import reaction from '../assets/video/memoji-reaction-60fps.mp4';

export default function HomeMemoji() {
  const video = useRef(null);
  const reducedMotion = useReducedMotion();

  const play = () => {
    if (reducedMotion || !video.current || !video.current.paused) return;
    video.current.currentTime = 0;
    video.current.play().catch(() => {});
  };

  if (reducedMotion) {
    return <img className="hero-memoji" src={portrait} width="1120" height="1404" alt="Zaka’s Memoji smiling behind a sticker-covered laptop, lit by its screen" />;
  }

  return (
    <button
      type="button"
      className="hero-memoji-interaction"
      aria-label="Play Zaka’s Memoji reaction"
      onPointerEnter={(event) => event.pointerType !== 'touch' && play()}
      onClick={play}
    >
      <video
        ref={video}
        className="hero-memoji"
        src={reaction}
        poster={portrait}
        width="1120"
        height="1404"
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        aria-hidden="true"
        onEnded={() => { video.current.currentTime = 0; }}
      />
    </button>
  );
}
