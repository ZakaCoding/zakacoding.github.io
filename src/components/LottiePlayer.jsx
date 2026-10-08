/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
// The light SVG player excludes expressions and their eval-based interpreter.
import lottie from 'lottie-web/build/player/lottie_light.min.js';

export default function LottiePlayer({ src, autoplay = false, loop = false, speed = 1, className, style, lottieRef }) {
  const container = useRef(null);
  const callback = useRef(lottieRef);
  useEffect(() => { callback.current = lottieRef; }, [lottieRef]);

  useEffect(() => {
    const animation = lottie.loadAnimation({ container: container.current, renderer: 'svg', path: src, autoplay, loop });
    animation.setSpeed(speed);
    const ready = () => callback.current?.(animation);
    animation.addEventListener('DOMLoaded', ready);
    return () => {
      animation.removeEventListener('DOMLoaded', ready);
      callback.current?.(null);
      animation.destroy();
    };
  }, [src, autoplay, loop, speed]);

  return <span ref={container} className={className} style={{ display: 'block', ...style }} />;
}
