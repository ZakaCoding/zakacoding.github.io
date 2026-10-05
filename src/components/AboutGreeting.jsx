import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const greetings = [
  { code: 'en', label: 'English', control: 'EN', word: 'hello', family: 'latin' },
  { code: 'ja', label: 'Japanese', control: 'JP', word: 'こんにちは', family: 'japanese' },
  { code: 'zh-Hans', label: 'Chinese', control: 'ZH', word: '你好', family: 'chinese' },
  { code: 'es', label: 'Spanish', control: 'ES', word: 'hola', family: 'latin' },
];

export function AboutGreeting() {
  const root = useRef(null);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const initialReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(Boolean(initialReducedMotion));
  const active = visible && documentVisible && !paused && !interacting && !reducedMotion;
  const greeting = greetings[selected];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = root.current?.closest('.about-editorial-opening');
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    if (root.current) observer.observe(root.current);
    const onVisibility = () => setDocumentVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      section?.removeAttribute('data-welcome-active');
    };
  }, []);

  useEffect(() => {
    root.current?.closest('.about-editorial-opening')?.toggleAttribute('data-welcome-active', active);
    if (!active) return undefined;
    const timer = window.setTimeout(() => setSelected((current) => (current + 1) % greetings.length), 4800);
    return () => window.clearTimeout(timer);
  }, [active, selected]);

  return (
    <div className="about-greeting" ref={root}>
      <h2 id="about-hello-title" className="about-hello-title" aria-label="Hello, hello">
        <span className="about-greeting-first" aria-hidden="true">Hello,</span>
        <span className="about-greeting-stage" aria-hidden="true">
          <AnimatePresence initial={false} mode="sync">
            <motion.span
              key={greeting.code}
              lang={greeting.code}
              className={`about-greeting-word about-greeting-${greeting.family}`}
              initial={reducedMotion ? false : { opacity: 0, y: 18, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -12, filter: reducedMotion ? 'blur(0px)' : 'blur(5px)' }}
              transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >{greeting.word}</motion.span>
          </AnimatePresence>
        </span>
      </h2>
      <div
        className="about-greeting-controls"
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocus={() => setInteracting(true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
      >
        <div className="about-greeting-languages" role="group" aria-label="Choose a greeting language">
          {greetings.map((item, index) => (
            <button
              key={item.code}
              type="button"
              lang={item.code}
              aria-label={`${item.label}: ${item.word}`}
              aria-pressed={selected === index}
              onClick={() => { setSelected(index); setPaused(true); }}
            >{item.control}</button>
          ))}
        </div>
        {!reducedMotion && (
          <button
            className="about-greeting-pause"
            type="button"
            aria-label={paused ? 'Play greeting cycle' : 'Pause greeting cycle'}
            aria-pressed={paused}
            onClick={() => setPaused((current) => !current)}
          ><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>
        )}
        <span className="about-greeting-aside">A hello goes a long way</span>
      </div>
    </div>
  );
}
