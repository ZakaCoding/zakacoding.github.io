import { useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Instagram, Linkedin } from 'react-bootstrap-icons';

import memojiImage from '../assets/image/zaka-memoji.jpeg';
import zakaPortrait from '../assets/image/sillhouete_zaka.png';
import animoji from '../assets/lottie/memoji.json';
import ZakaCodingLogo from '../../public/logo/final-logo.png';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const whoModes = [
  {
    id: 'systems',
    icon: '⌘',
    label: 'Systems builder',
    eyebrow: 'Full-stack engineer',
    title: 'I build the quiet systems behind busy operations.',
    body: 'Logistics platforms, backend services, and interfaces people depend on every day.',
    accent: '#ff6b18',
    soft: '#fff0e7',
    pose: '-1deg',
  },
  {
    id: 'modernize',
    icon: '↻',
    label: 'Modernizer',
    eyebrow: 'Legacy → dependable',
    title: 'Old software deserves a thoughtful next chapter.',
    body: 'I untangle legacy systems, improve architecture, and ship change without losing what already works.',
    accent: '#087cff',
    soft: '#e8f2ff',
    pose: '1.2deg',
  },
  {
    id: 'lead',
    icon: '↑',
    label: 'Engineering lead',
    eyebrow: 'Builder + supervisor',
    title: 'Good engineering is also clear direction.',
    body: 'I help teams turn a hard problem into a shared plan, safer delivery, and software we can own.',
    accent: '#7c4dff',
    soft: '#f0ebff',
    pose: '-0.5deg',
  },
  {
    id: 'maker',
    icon: '✦',
    label: 'Indie maker',
    eyebrow: 'Open source + local AI',
    title: 'Curiosity keeps the work alive.',
    body: 'After work, I explore tools like OwA and Open CMAP—small experiments that become useful products.',
    accent: '#13a46b',
    soft: '#e5f8ef',
    pose: '0.8deg',
  },
];

const About = () => {
  const exhibitionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const directionRef = useRef(null);
  const editorialRef = useRef(null);
  const editorialMemojiRef = useRef(null);
  const editorialPlayerRef = useRef(null);
  const portraitRef = useRef(null);
  const [activeWhoMode, setActiveWhoMode] = useState(whoModes[0]);

  const movePortrait = (event) => {
    const portrait = portraitRef.current;
    if (!portrait || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.setProperty('--portrait-x', `${x * 22}px`);
    portrait.style.setProperty('--portrait-y', `${y * 12}px`);
    portrait.style.setProperty('--portrait-tilt', `${x * 2.4}deg`);
  };

  const resetPortrait = () => {
    const portrait = portraitRef.current;
    if (!portrait) return;
    portrait.style.setProperty('--portrait-x', '0px');
    portrait.style.setProperty('--portrait-y', '0px');
    portrait.style.setProperty('--portrait-tilt', '0deg');
  };

  const moveEditorialMemoji = (event) => {
    const memoji = editorialMemojiRef.current;
    if (!memoji || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - bounds.left) / bounds.width - 0.5, -0.5, 0.5);
    const y = clamp((event.clientY - bounds.top) / bounds.height - 0.5, -0.5, 0.5);
    memoji.style.setProperty('--memoji-look-x', `${x * 9}deg`);
    memoji.style.setProperty('--memoji-look-y', `${y * -6}deg`);
  };

  const resetEditorialMemoji = () => {
    const memoji = editorialMemojiRef.current;
    if (!memoji) return;
    memoji.style.setProperty('--memoji-look-x', '0deg');
    memoji.style.setProperty('--memoji-look-y', '0deg');
  };

  useEffect(() => {
    const exhibition = exhibitionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    const editorial = editorialRef.current;
    const editorialMemoji = editorialMemojiRef.current;
    if (!exhibition || !track || !progress) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileLayout = window.matchMedia('(max-width: 700px)');
    let currentX = 0;
    let targetX = 0;
    let travel = 0;
    let frame = 0;

    const updateEditorialMotion = (horizontalPosition) => {
      const editorialStart = editorial?.offsetLeft || window.innerWidth;
      const editorialProgress = clamp(
        (horizontalPosition - editorialStart + window.innerWidth * 0.34) / (window.innerWidth * 0.82),
        0,
        1,
      );
      if (editorialMemoji) {
        editorialMemoji.style.setProperty('--memoji-enter-x', `${(1 - editorialProgress) * 80}px`);
        editorialMemoji.style.setProperty('--memoji-enter-y', `${(1 - editorialProgress) * 48}px`);
        editorialMemoji.style.setProperty('--memoji-opacity', `${0.28 + editorialProgress * 0.72}`);
        editorialMemoji.style.setProperty('--memoji-turn', `${-18 + editorialProgress * 18}deg`);
        editorialMemoji.style.setProperty('--memoji-scale', `${0.9 + editorialProgress * 0.1}`);
        editorialMemoji.style.setProperty('--memoji-aura-scale', `${0.84 + editorialProgress * 0.16}`);
      }
      editorialPlayerRef.current?.setSeeker?.(Math.round(editorialProgress * 106), false);
    };

    const paint = () => {
      const difference = targetX - currentX;
      currentX = reducedMotion.matches ? targetX : currentX + difference * 0.11;
      track.style.transform = `translate3d(${-currentX}px, 0, 0)`;
      progress.style.transform = `scaleX(${travel ? currentX / travel : 0})`;

      updateEditorialMotion(currentX);

      if (Math.abs(difference) > 0.15) {
        frame = window.requestAnimationFrame(paint);
      } else {
        currentX = targetX;
        frame = 0;
      }
    };

    const update = () => {
      if (mobileLayout.matches) {
        exhibition.style.height = 'auto';
        track.style.transform = 'none';
        progress.style.transform = 'scaleX(0)';
        directionRef.current?.classList.remove('is-complete');
        return;
      }

      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      exhibition.style.height = `${travel + window.innerHeight}px`;
      targetX = clamp(window.scrollY - exhibition.offsetTop, 0, travel);
      directionRef.current?.classList.toggle('is-complete', targetX >= travel - 2);

      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(track);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    reducedMotion.addEventListener('change', update);
    mobileLayout.addEventListener('change', update);
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      reducedMotion.removeEventListener('change', update);
      mobileLayout.removeEventListener('change', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <main className="about-page">
      <section
        id="about-exhibition"
        className="about-exhibition"
        ref={exhibitionRef}
        aria-label="About Zaka"
      >
        <div className="about-exhibition-sticky">
          <div className="about-exhibition-track" ref={trackRef}>
            <section className="about-original-hero" aria-labelledby="about-title">
              <div className="about-original-intro">
                <motion.h1
                  id="about-title"
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  ZakaCoding
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  Hello World! I&apos;m <strong>Zaka</strong>, a full-stack engineer who works
                  across backend architecture, product interfaces, and the systems that keep
                  real operations moving.
                </motion.p>
              </div>

              <div className="about-original-identity">
                <motion.img
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  src={ZakaCodingLogo}
                  className="about-original-logo"
                  alt="ZakaCoding logo"
                />
                <motion.img
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  src={memojiImage}
                  className="about-original-memoji memoji-float"
                  alt="Zaka smiling behind a sticker-covered MacBook"
                />
              </div>

              <div className="about-scroll-cue" aria-hidden="true">
                <span>Scroll to know me</span>
                <ArrowRight />
              </div>
            </section>

            <section
              className="about-editorial-opening"
              ref={editorialRef}
              onPointerMove={moveEditorialMemoji}
              onPointerLeave={resetEditorialMemoji}
            >
              <div className="about-editorial-copy">
                <span className="about-index">02 / ABOUT</span>
                <h2>
                  I Read, Code, and drink too much <em>coffee</em>
                  <span className="about-loading-dots" aria-label="loading" />
                </h2>
                <p>
                  Curiosity takes me from operational systems to thoughtful interfaces,
                  local AI, and open-source experiments—always with one more idea to try.
                </p>
              </div>

              <div
                className="about-editorial-memoji"
                ref={editorialMemojiRef}
                aria-label="Zaka's animated Memoji turns to greet you"
              >
                <span className="about-memoji-aura" aria-hidden="true" />
                <div className="about-memoji-orbit" aria-hidden="true">
                  <span>Read</span><span>Code</span><span>Coffee</span>
                </div>
                <Player
                  src={animoji}
                  ref={editorialPlayerRef}
                  keepLastFrame
                  className="about-classic-memoji-player"
                />
                <span className="about-memoji-caption">Hello, again.</span>
              </div>
            </section>

            <section
              className="about-who"
              aria-labelledby="who-title"
              style={{
                '--who-accent': activeWhoMode.accent,
                '--who-soft': activeWhoMode.soft,
                '--portrait-pose': activeWhoMode.pose,
              }}
              onPointerMove={movePortrait}
              onPointerLeave={resetPortrait}
            >
              <header className="about-who-header">
                <span className="about-index">03 / WHO I AM</span>
                <div className="about-who-switcher" aria-label="Explore Zaka's roles">
                  {whoModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={mode.id === activeWhoMode.id ? 'is-active' : ''}
                      aria-pressed={mode.id === activeWhoMode.id}
                      aria-label={mode.label}
                      onClick={() => setActiveWhoMode(mode)}
                    >
                      <span aria-hidden="true">{mode.icon}</span>
                      <strong>{mode.label}</strong>
                    </button>
                  ))}
                </div>
              </header>

              <div className="about-who-copy">
                <span className="about-who-eyebrow">{activeWhoMode.eyebrow}</span>
                <h3 id="who-title">Who I am</h3>
                <motion.div
                  key={activeWhoMode.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                  className="about-who-story"
                >
                  <p className="about-who-lede">{activeWhoMode.title}</p>
                  <p>{activeWhoMode.body}</p>
                </motion.div>
              </div>

              <div className="about-who-stage">
                <span className="about-who-halo" aria-hidden="true" />
                <span className="about-who-word" aria-hidden="true">ZAKA</span>
                <div className="about-who-portrait" ref={portraitRef}>
                  <img src={zakaPortrait} alt="Zaka Noor standing in profile" />
                </div>
                <span className="about-who-location">Indonesia · GMT+7</span>
              </div>

              <footer className="about-who-footer">
                <span>Choose a lens</span>
                <strong>{activeWhoMode.label}</strong>
              </footer>
            </section>

            <section className="about-chapter" aria-labelledby="outcome-title">
              <span className="about-index">04</span>
              <div>
                <h3 id="outcome-title">Full-stack means owning the whole outcome.</h3>
              </div>
              <p>
                From backend architecture to the interface, deployment, and the team
                keeping it healthy after launch.
              </p>
            </section>

            <section className="about-chapter" aria-labelledby="work-title">
              <span className="about-index">05</span>
              <div>
                <h3 id="work-title">Understand. Simplify. Build. Improve.</h3>
              </div>
              <p>
                I start with the operation, find the real constraint, and turn it into
                software that feels calm and dependable.
              </p>
            </section>

            <section className="about-chapter about-chapter-blue" aria-labelledby="curious-title">
              <span className="about-index">06</span>
              <div>
                <h3 id="curious-title">Curious after hours.</h3>
                <p className="about-chapter-lede">Local AI, open source, and strange ideas.</p>
              </div>
              <p>
                OwA started there: an experiment in making small local models genuinely
                useful for developers.
              </p>
            </section>

            <section className="about-contact-panel">
              <span className="about-index">07 / SAY HELLO</span>
              <h2>Have a hard problem? <em>Let&apos;s make it clear.</em></h2>
              <p>
                For product engineering, system modernization, open-source collaboration,
                or a good conversation about local AI.
              </p>
              <div className="about-contact-links">
                <a href="mailto:zakanoor@outlook.co.id">
                  zakanoor@outlook.co.id <ArrowRight aria-hidden="true" />
                </a>
                <div>
                  <a href="https://github.com/ZakaCoding" aria-label="GitHub"><Github /></a>
                  <a href="https://www.linkedin.com/in/zaka-n-693018111" aria-label="LinkedIn"><Linkedin /></a>
                  <a href="https://instagram.com/youn8e_" aria-label="Instagram"><Instagram /></a>
                </div>
              </div>
            </section>
          </div>

          <div className="about-progress-rail" aria-hidden="true">
            <span className="about-progress-fill" ref={progressRef} />
          </div>
          <span className="about-direction" ref={directionRef} aria-live="polite">
            <span className="about-direction-label">
              <span className="about-direction-keep">Keep scrolling <ArrowRight /></span>
              <span className="about-direction-swipe">Swipe to explore <ArrowRight /></span>
              <span className="about-direction-thanks">Thanks for stopping by …</span>
            </span>
          </span>
        </div>
      </section>
    </main>
  );
};

export default About;
