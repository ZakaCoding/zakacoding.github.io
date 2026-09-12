import { useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Instagram, Linkedin } from 'react-bootstrap-icons';

import memojiImage from '../assets/image/zaka-memoji.jpeg';
import zakaPortrait from '../assets/image/sillhouete_zaka.png';
import animoji from '../assets/lottie/memoji.json?url';
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
  const logoLayerRef = useRef(null);
  const logoSourceRef = useRef(null);
  const logoLandingRef = useRef(null);
  const logoFlightRef = useRef(null);
  const logoTrailRef = useRef(null);
  const directionRef = useRef(null);
  const portraitRef = useRef(null);
  const whoModeRefs = useRef([]);
  const [activeWhoMode, setActiveWhoMode] = useState(whoModes[0]);

  const selectWhoMode = (index) => {
    setActiveWhoMode(whoModes[index]);
    whoModeRefs.current[index]?.focus();
  };

  const handleWhoModeKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % whoModes.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + whoModes.length) % whoModes.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = whoModes.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      selectWhoMode(nextIndex);
    }
  };

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

  useEffect(() => {
    const exhibition = exhibitionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    const logoLayer = logoLayerRef.current;
    const logoSource = logoSourceRef.current;
    const logoLanding = logoLandingRef.current;
    const logoFlight = logoFlightRef.current;
    const logoTrail = logoTrailRef.current;
    if (!exhibition || !track || !progress || !logoLayer || !logoSource || !logoLanding || !logoFlight || !logoTrail) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileLayout = window.matchMedia('(max-width: 700px)');
    const touchLayout = window.matchMedia('(pointer: coarse)');
    const hasTouchInput = () => navigator.maxTouchPoints > 0 || touchLayout.matches;
    let currentX = 0;
    let targetX = 0;
    let travel = 0;
    let frame = 0;

    const paintLogo = (scrollX, isMobile = false) => {
      const sourceRect = logoSource.getBoundingClientRect();
      const landingRect = logoLanding.getBoundingClientRect();
      const layerRect = logoLayer.getBoundingClientRect();
      const sourcePanel = logoSource.closest('.about-original-hero');
      const panelWidth = sourcePanel?.getBoundingClientRect().width || window.innerWidth;
      const sourceWidth = sourceRect.width;
      const landingWidth = landingRect.width;
      if (!sourceWidth || !landingWidth) return;

      let progressValue;
      let startX;
      let startY;
      let endX;
      let endY;
      let currentX;
      let currentY;

      if (isMobile) {
        const layerDocumentX = layerRect.left + window.scrollX;
        const layerDocumentY = layerRect.top + window.scrollY;
        const sourceDocumentY = sourceRect.top + window.scrollY;
        const landingDocumentY = landingRect.top + window.scrollY;
        const startScroll = Math.max(0, sourceDocumentY - window.innerHeight * 0.34);
        const endScroll = Math.max(startScroll + 1, landingDocumentY - window.innerHeight * 0.56);

        progressValue = clamp((scrollX - startScroll) / (endScroll - startScroll), 0, 1);
        startX = sourceRect.left + window.scrollX - layerDocumentX;
        startY = sourceRect.top + window.scrollY - layerDocumentY;
        endX = landingRect.left + window.scrollX - layerDocumentX;
        endY = landingRect.top + window.scrollY - layerDocumentY;
        currentX = startX + (endX - startX) * progressValue;
        currentY = startY + (endY - startY) * progressValue;
      } else {
        const sourceBaseX = sourceRect.left - layerRect.left + scrollX;
        const landingBaseX = landingRect.left - layerRect.left + scrollX;

        progressValue = clamp(scrollX / panelWidth, 0, 1);
        startX = sourceBaseX;
        startY = sourceRect.top - layerRect.top;
        endX = landingBaseX - panelWidth;
        endY = landingRect.top - layerRect.top;
        currentX = progressValue < 1 ? startX + (endX - startX) * progressValue : landingRect.left - layerRect.left;
        currentY = progressValue < 1 ? startY + (endY - startY) * progressValue : landingRect.top - layerRect.top;
      }

      const travelProgress = 1 - ((1 - progressValue) ** 3);
      const scale = 1 + ((landingWidth / sourceWidth) - 1) * travelProgress;
      let rotation = 0;
      if (progressValue < 0.22) {
        rotation = -3 * (progressValue / 0.22);
      } else if (progressValue < 0.72) {
        rotation = -3 + 7 * ((progressValue - 0.22) / 0.5);
      } else {
        rotation = 4 * (1 - ((progressValue - 0.72) / 0.28));
      }

      logoFlight.style.width = `${sourceWidth}px`;
      logoFlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
      logoFlight.style.opacity = '1';

      const trailProgress = clamp((progressValue - 0.12) / 0.56, 0, 1);
      logoTrail.style.opacity = progressValue > 0.08 && progressValue < 0.9 ? '0.22' : '0';
      logoTrail.style.strokeDashoffset = `${1.1 - trailProgress * 0.88}`;
    };

    const paint = () => {
      if (mobileLayout.matches) {
        paintLogo(window.scrollY, true);
        frame = 0;
        return;
      }

      const difference = targetX - currentX;
      currentX = reducedMotion.matches ? targetX : currentX + difference * 0.11;
      track.style.transform = `translate3d(${-currentX}px, 0, 0)`;
      progress.style.transform = `scaleX(${travel ? currentX / travel : 0})`;
      paintLogo(currentX);

      if (Math.abs(difference) > 0.15) {
        frame = window.requestAnimationFrame(paint);
      } else {
        currentX = targetX;
        frame = 0;
      }
    };

    const update = () => {
      const isTouchStory = hasTouchInput() && !mobileLayout.matches;
      exhibition.toggleAttribute('data-touch-layout', isTouchStory);

      if (mobileLayout.matches) {
        exhibition.style.height = 'auto';
        track.style.transform = 'none';
        progress.style.transform = 'scaleX(0)';
        directionRef.current?.classList.remove('is-complete');
        paintLogo(window.scrollY, true);
        return;
      }

      if (isTouchStory) {
        travel = Math.max(0, track.scrollWidth - window.innerWidth);
        exhibition.style.height = `${window.innerHeight}px`;
        track.style.transform = 'none';
        targetX = clamp(exhibition.parentElement.scrollLeft, 0, travel);
        progress.style.transform = `scaleX(${travel ? targetX / travel : 0})`;
        directionRef.current?.classList.toggle('is-complete', targetX >= travel - 2);
        paintLogo(targetX);
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
    exhibition.parentElement.addEventListener('scroll', update, { passive: true });
    reducedMotion.addEventListener('change', update);
    mobileLayout.addEventListener('change', update);
    touchLayout.addEventListener('change', update);
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      exhibition.parentElement.removeEventListener('scroll', update);
      reducedMotion.removeEventListener('change', update);
      mobileLayout.removeEventListener('change', update);
      touchLayout.removeEventListener('change', update);
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
                <div
                  ref={logoSourceRef}
                  className="about-original-logo about-original-logo-anchor"
                  aria-hidden="true"
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

            <section className="about-editorial-opening">
              <div ref={logoLandingRef} className="about-logo-landing" aria-hidden="true" />
              <div className="about-editorial-copy">
                <span className="about-index">02 / ABOUT</span>
                <h2>
                  I Read, Code, and drink too much coffee
                  <span className="about-loading-dots" aria-label="loading" />
                </h2>
                <p>
                  I&apos;m a curious builder and full-stack engineer. I move between
                  operational systems, thoughtful interfaces, local AI, and open-source
                  experiments—always trying to make complicated things feel clear.
                </p>
              </div>

              <div className="about-editorial-memoji">
                <span className="about-hand-note about-hand-note-one">Build.<br />Learn.<br />Repeat.</span>
                <Player
                  src={animoji}
                  hover
                  speed={2.1}
                  className="about-classic-memoji-player"
                />
                <span className="about-hand-note about-hand-note-two">Read.<br />Code.<br />Coffee.</span>
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
                <div className="about-who-switcher" role="tablist" aria-label="Explore Zaka's roles">
                  {whoModes.map((mode, index) => (
                    <button
                      key={mode.id}
                      type="button"
                      ref={(element) => { whoModeRefs.current[index] = element; }}
                      role="tab"
                      id={`who-mode-${mode.id}`}
                      className={mode.id === activeWhoMode.id ? 'is-active' : ''}
                      aria-selected={mode.id === activeWhoMode.id}
                      aria-controls="who-story"
                      tabIndex={mode.id === activeWhoMode.id ? 0 : -1}
                      data-label={mode.label}
                      onClick={() => selectWhoMode(index)}
                      onKeyDown={(event) => handleWhoModeKeyDown(event, index)}
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
                  id="who-story"
                  role="tabpanel"
                  aria-labelledby={`who-mode-${activeWhoMode.id}`}
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
          <div ref={logoLayerRef} className="about-logo-flight-layer" aria-hidden="true">
            <svg className="about-logo-flight-trail" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                ref={logoTrailRef}
                d="M 10 76 C 31 72, 47 43, 87 17"
                pathLength="1"
              />
            </svg>
            <div ref={logoFlightRef} className="about-logo-flight">
              <img src={ZakaCodingLogo} alt="" />
            </div>
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
