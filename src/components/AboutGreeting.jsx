import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const greetings = [
  { code: 'en', label: 'English', control: 'EN', word: 'hello', family: 'latin' },
  { code: 'id', label: 'Indonesian', control: 'ID', word: 'halo', family: 'latin' },
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
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    if (root.current) observer.observe(root.current);
    const onVisibility = () => setDocumentVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setTimeout(() => setSelected((current) => (current + 1) % greetings.length), 4800);
    return () => window.clearTimeout(timer);
  }, [active, selected]);

  return (
    <div className="about-greeting" ref={root}>
      <h2 id="about-hello-title" className="about-hello-title" aria-label="Hello, hello.">
        <motion.span className="about-greeting-first" aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>Hello,</motion.span>
        <span className="about-greeting-stage" aria-hidden="true">
          <AnimatePresence initial={false} mode="sync">
            <motion.span
              key={greeting.code}
              lang={greeting.code}
              className={`about-greeting-word about-greeting-${greeting.family}`}
              initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: -4, scale: 0.94, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, rotate: -4, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -12, filter: reducedMotion ? 'blur(0px)' : 'blur(5px)' }}
              transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >{greeting.word}<span className="about-greeting-period">.</span></motion.span>
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
            <motion.button
              key={item.code}
              whileHover={reducedMotion ? undefined : { scale: 1.06 }}
              whileTap={reducedMotion ? undefined : { scale: 0.94 }}
              type="button"
              lang={item.code}
              aria-label={`${item.label}: ${item.word}`}
              aria-pressed={selected === index}
              onClick={() => { setSelected(index); setPaused(true); }}
            >
              {selected === index && <motion.span className="about-greeting-selection" layoutId="greeting-selection" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }} />}
              <motion.span className="about-greeting-control-label"
                animate={{ y: selected === index && !reducedMotion ? -1 : 0, scale: selected === index && !reducedMotion ? 1.08 : 1 }}
                transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 26 }}
              >{item.control}</motion.span>
            </motion.button>
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
        <span className="about-greeting-aside" aria-live={paused ? 'polite' : 'off'}>
          <AnimatePresence initial={false} mode="wait">
            <motion.span key={greeting.code}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.18 }}
            >{greeting.label}</motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
}
