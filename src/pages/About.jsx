import { useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Instagram, Linkedin } from 'react-bootstrap-icons';

import memojiImage from '../assets/image/zaka-memoji.jpeg';
import localAiRobot from '../assets/image/local-ai-robot.webp';
import animoji from '../assets/lottie/memoji.json?url';
import { ZakaCodingLogo } from '../components/ZakaCodingLogo';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const buildSteps = [
  {
    number: '01',
    label: 'Notice',
    title: 'Start with the messy part.',
    body: 'See how the work actually moves before deciding what the software should do.',
  },
  {
    number: '02',
    label: 'Shape',
    title: 'Find the real constraint.',
    body: 'Turn a tangled operation into a model the team can understand and improve together.',
  },
  {
    number: '03',
    label: 'Ship',
    title: 'Make it calm to use.',
    body: 'Build the backend, interface, and delivery path so the result keeps working after launch.',
  },
];

const fieldNotes = [
  {
    number: '01',
    className: 'about-field-note-owa',
    label: 'Local AI / Developer tooling',
    title: 'OwA',
    body: 'A local coding agent that reads the repository before it answers.',
    visual: (
      <div className="about-field-note-terminal" aria-hidden="true">
        <span>$ owa</span>
        <span>✓ context ready</span>
        <strong>private · grounded</strong>
      </div>
    ),
  },
  {
    number: '02',
    className: 'about-field-note-logistics',
    label: 'Operations / System modernization',
    title: 'DiGILOG',
    body: 'One operational context connecting orders, warehouses, transport, and teams.',
    visual: (
      <div className="about-field-note-network" aria-hidden="true">
        <i /><i /><i /><i /><i />
        <strong>operations<br />core</strong>
      </div>
    ),
  },
  {
    number: '03',
    className: 'about-field-note-cmap',
    label: 'Knowledge tools / Visual thinking',
    title: 'Open CMAP',
    body: 'A visual workspace for making complex ideas easier to see, edit, and share.',
    visual: (
      <div className="about-field-note-map" aria-hidden="true">
        <span>idea</span>
        <i />
        <span>link</span>
        <i />
        <span>understand</span>
      </div>
    ),
  },
];

const About = () => {
  const exhibitionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const logoLayerRef = useRef(null);
  const logoSourceRef = useRef(null);
  const logoLandingRef = useRef(null);
  const logoClosingRef = useRef(null);
  const logoFlightRef = useRef(null);
  const logoTrailRef = useRef(null);
  const logoMessageRef = useRef(null);
  const closingPanelRef = useRef(null);
  const directionRef = useRef(null);

  useEffect(() => {
    const exhibition = exhibitionRef.current;
    const track = trackRef.current;
    const sticky = track?.parentElement;
    const progress = progressRef.current;
    const logoLayer = logoLayerRef.current;
    const logoSource = logoSourceRef.current;
    const logoLanding = logoLandingRef.current;
    const logoClosing = logoClosingRef.current;
    const logoFlight = logoFlightRef.current;
    const logoTrail = logoTrailRef.current;
    const logoMessage = logoMessageRef.current;
    const closingPanel = closingPanelRef.current;
    if (!exhibition || !track || !sticky || !progress || !logoLayer || !logoSource || !logoLanding || !logoClosing || !logoFlight || !logoTrail || !logoMessage || !closingPanel) {
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
      const closingRect = logoClosing.getBoundingClientRect();
      const layerRect = logoLayer.getBoundingClientRect();
      const sourcePanel = logoSource.closest('.about-original-hero');
      const panelWidth = sourcePanel?.getBoundingClientRect().width || window.innerWidth;
      const sourceWidth = sourceRect.width;
      const landingWidth = landingRect.width;
      const closingWidth = closingRect.width;
      if (!sourceWidth || !landingWidth || !closingWidth) return;

      let currentX;
      let currentY;
      let scale;
      let rotation = 0;
      let firstProgress = 0;
      let returnProgress = 0;
      let phase = 'parked';

      if (isMobile) {
        const layerDocumentX = layerRect.left + window.scrollX;
        const layerDocumentY = layerRect.top + window.scrollY;
        const sourceDocumentY = sourceRect.top + window.scrollY;
        const landingDocumentY = landingRect.top + window.scrollY;
        const closingDocumentY = closingRect.top + window.scrollY;
        const firstStartScroll = Math.max(0, sourceDocumentY - window.innerHeight * 0.34);
        const firstEndScroll = Math.max(firstStartScroll + 1, landingDocumentY - window.innerHeight * 0.56);
        const returnStartScroll = Math.max(firstEndScroll + 1, closingDocumentY - window.innerHeight * 0.9);
        const returnEndScroll = Math.max(returnStartScroll + 1, closingDocumentY - window.innerHeight * 0.56);
        const sourceX = sourceRect.left + window.scrollX - layerDocumentX;
        const sourceY = sourceRect.top + window.scrollY - layerDocumentY;
        const firstEndX = landingRect.left + window.scrollX - layerDocumentX;
        const firstEndY = landingDocumentY - layerDocumentY;
        const closingEndX = closingRect.left + window.scrollX - layerDocumentX;
        const closingEndY = closingDocumentY - layerDocumentY;

        if (scrollX <= firstEndScroll) {
          phase = 'opening';
          firstProgress = clamp((scrollX - firstStartScroll) / (firstEndScroll - firstStartScroll), 0, 1);
          currentX = sourceX + (firstEndX - sourceX) * firstProgress;
          currentY = sourceY + (firstEndY - sourceY) * firstProgress;
        } else if (scrollX < returnStartScroll) {
          currentX = firstEndX;
          currentY = firstEndY;
        } else {
          phase = 'returning';
          returnProgress = clamp((scrollX - returnStartScroll) / (returnEndScroll - returnStartScroll), 0, 1);
          const easedReturn = 1 - ((1 - returnProgress) ** 3);
          const returnStartX = -landingWidth * 1.15;
          const returnStartY = closingEndY - window.innerHeight * 0.16;
          currentX = returnStartX + (closingEndX - returnStartX) * easedReturn;
          currentY = returnStartY + (closingEndY - returnStartY) * returnProgress
            - Math.sin(returnProgress * Math.PI) * 24;
        }
      } else {
        const sourceBaseX = sourceRect.left - layerRect.left + scrollX;
        const landingBaseX = landingRect.left - layerRect.left + scrollX;
        const closingBaseX = closingRect.left - layerRect.left + scrollX;
        const firstEndX = landingBaseX - panelWidth;
        const firstEndY = landingRect.top - layerRect.top;
        const closingEndX = closingBaseX - travel;
        const closingEndY = closingRect.top - layerRect.top;
        const returnStartScroll = Math.max(panelWidth + 1, travel - panelWidth * 0.82);

        if (scrollX <= panelWidth) {
          phase = 'opening';
          firstProgress = clamp(scrollX / panelWidth, 0, 1);
          currentX = sourceBaseX + (firstEndX - sourceBaseX) * firstProgress;
          currentY = (sourceRect.top - layerRect.top)
            + (firstEndY - (sourceRect.top - layerRect.top)) * firstProgress;
        } else if (scrollX < returnStartScroll) {
          currentX = landingRect.left - layerRect.left;
          currentY = firstEndY;
        } else {
          phase = 'returning';
          returnProgress = clamp((scrollX - returnStartScroll) / Math.max(travel - returnStartScroll, 1), 0, 1);
          const easedReturn = 1 - ((1 - returnProgress) ** 3);
          const returnStartX = -landingWidth * 1.15;
          const returnStartY = closingEndY - window.innerHeight * 0.16;
          currentX = returnStartX + (closingEndX - returnStartX) * easedReturn;
          currentY = returnStartY + (closingEndY - returnStartY) * returnProgress
            - Math.sin(returnProgress * Math.PI) * 24;
        }
      }

      if (phase === 'opening') {
        const travelProgress = 1 - ((1 - firstProgress) ** 3);
        scale = 1 + ((landingWidth / sourceWidth) - 1) * travelProgress;
        if (firstProgress < 0.22) {
          rotation = -3 * (firstProgress / 0.22);
        } else if (firstProgress < 0.72) {
          rotation = -3 + 7 * ((firstProgress - 0.22) / 0.5);
        } else {
          rotation = 4 * (1 - ((firstProgress - 0.72) / 0.28));
        }
      } else if (phase === 'returning') {
        const startScale = landingWidth / sourceWidth;
        const endScale = closingWidth / sourceWidth;
        scale = startScale + (endScale - startScale) * returnProgress;
        rotation = -6 * (1 - returnProgress);
      } else {
        scale = landingWidth / sourceWidth;
      }

      logoFlight.style.width = `${sourceWidth}px`;
      logoFlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
      logoFlight.style.opacity = '1';

      const messageX = currentX + sourceWidth * scale * 0.54;
      const messageY = Math.max(8, currentY - sourceWidth * scale * 0.16);
      const firstMessageVisible = phase === 'opening' && firstProgress > 0.08 && firstProgress < 0.98;
      const returnMessageVisible = phase === 'returning' && returnProgress > 0.16;
      const messageVisible = !reducedMotion.matches && (firstMessageVisible || returnMessageVisible);
      logoMessage.dataset.state = phase === 'returning' || firstProgress > 0.84
        ? 'delivered'
        : firstProgress > 0.3 ? 'welcome' : 'typing';
      logoMessage.style.transform = `translate3d(${messageX}px, ${messageY}px, 0)`;
      logoMessage.style.opacity = messageVisible ? '1' : '0';

      const trailProgress = clamp((firstProgress - 0.12) / 0.56, 0, 1);
      logoTrail.style.opacity = phase === 'opening' && firstProgress > 0.08 && firstProgress < 0.9 ? '0.22' : '0';
      logoTrail.style.strokeDashoffset = `${1.1 - trailProgress * 0.88}`;

      closingPanel.classList.toggle('is-arriving', phase === 'returning' && returnProgress > 0.12);
      closingPanel.classList.toggle('is-complete', phase === 'returning' && returnProgress > 0.94);
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
        targetX = clamp(sticky.scrollLeft, 0, travel);
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
    sticky.addEventListener('scroll', update, { passive: true });
    reducedMotion.addEventListener('change', update);
    mobileLayout.addEventListener('change', update);
    touchLayout.addEventListener('change', update);
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      sticky.removeEventListener('scroll', update);
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

            <section className="about-method" aria-labelledby="method-title">
              <div className="about-method-copy">
                <span className="about-index">03 / THE THREAD</span>
                <h2 id="method-title">I make complicated systems feel calm.</h2>
                <p>
                  The work changes—from logistics to local AI—but the way I approach it stays
                  familiar: get close to the problem, give it shape, then make it useful.
                </p>
              </div>

              <div className="about-method-flow" aria-label="Zaka's working process">
                <span className="about-method-flow-line" aria-hidden="true" />
                {buildSteps.map((step) => (
                  <motion.article
                    key={step.number}
                    className="about-method-step"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.65 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                  >
                    <span className="about-method-step-number">{step.number}</span>
                    <span className="about-method-step-label">{step.label}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="about-field-notes" aria-labelledby="field-notes-title">
              <header className="about-field-notes-heading">
                <span className="about-index">04 / FIELD NOTES</span>
                <h2 id="field-notes-title">The work changes. The question stays the same.</h2>
                <p>Where is the friction, and what would make the next step obvious?</p>
              </header>

              <div className="about-field-notes-list">
                {fieldNotes.map((note) => (
                  <motion.article
                    key={note.number}
                    className={`about-field-note ${note.className}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    {note.visual}
                    <div className="about-field-note-copy">
                      <span className="about-field-note-number">{note.number}</span>
                      <span className="about-field-note-label">{note.label}</span>
                      <h3>{note.title}</h3>
                      <p>{note.body}</p>
                    </div>
                  </motion.article>
                ))}
              </div>

              <a className="about-field-notes-link" href="/archive">
                See the full archive <ArrowRight aria-hidden="true" />
              </a>
            </section>

            <section className="about-lab" aria-labelledby="lab-title">
              <div className="about-lab-copy">
                <span className="about-index">05 / AFTER HOURS</span>
                <h2 id="lab-title">When the day ends, I keep exploring.</h2>
                <p>
                  OwA, Open CMAP, and the strange little experiments in between start with
                  curiosity—and become useful when they solve a real problem.
                </p>
              </div>

              <div className="about-lab-scene">
                <div className="about-lab-terminal" aria-label="Local AI experiment preview">
                  <div className="about-lab-terminal-bar">
                    <span>local-lab</span>
                    <span>22:41</span>
                  </div>
                  <p><b>›</b> explain this repository</p>
                  <p className="about-lab-terminal-dim">indexing locally · context ready</p>
                  <strong>Find the shape.<br />Name the constraint.<br />Make it useful.</strong>
                </div>
                <img src={localAiRobot} alt="" className="about-lab-robot" />
                <span className="about-lab-note">small models, real questions</span>
              </div>
            </section>

            <section className="about-contact-panel about-closing-panel" ref={closingPanelRef}>
              <span className="about-index">06 / STILL HERE</span>

              <div className="about-closing-fragment about-closing-terminal" aria-hidden="true">
                <span>zaka@desk ~</span>
                <strong><i /> currently: building</strong>
              </div>
              <div className="about-closing-fragment about-closing-note" aria-hidden="true">
                Build.<br />Learn.<br />Repeat.
              </div>
              <div className="about-closing-fragment about-closing-coffee" aria-hidden="true">
                <span>coffee status</span>
                <strong>still warm <i>☕</i></strong>
              </div>

              <div className="about-closing-center">
                <div className="about-closing-arrival" aria-hidden="true">
                  <div ref={logoClosingRef} className="about-logo-closing" />
                  <span className="about-closing-return">Back at the desk.</span>
                </div>

                <div className="about-closing-copy">
                  <h2>
                    Still{' '}
                    <span className="about-closing-word" tabIndex="0">
                      building
                      <span className="about-closing-whisper">probably with coffee.</span>
                    </span>
                    <span className="about-closing-period">.</span>
                  </h2>
                  <p>
                    Systems, tools, and strange little ideas<br />
                    that make complicated things feel clear.
                  </p>
                  <a className="about-closing-cta" href="mailto:zakanoor@outlook.co.id">
                    Start a conversation <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </div>

              <footer className="about-closing-footer">
                <span className="about-closing-status"><i /> currently: curious</span>
                <span>Indonesia · GMT+7</span>
                <div>
                  <a href="https://github.com/ZakaCoding" aria-label="GitHub"><Github /></a>
                  <a href="https://www.linkedin.com/in/zaka-n-693018111" aria-label="LinkedIn"><Linkedin /></a>
                  <a href="https://instagram.com/youn8e_" aria-label="Instagram"><Instagram /></a>
                </div>
              </footer>
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
            <div ref={logoFlightRef} className="about-logo-flight group">
              <ZakaCodingLogo />
            </div>
            <div ref={logoMessageRef} className="about-logo-message" aria-hidden="true">
              <span className="about-logo-message-typing">
                <i />
                <i />
                <i />
              </span>
              <span className="about-logo-message-copy about-logo-message-welcome">
                Hey 👋 welcome to my story
              </span>
              <span className="about-logo-message-copy about-logo-message-delivered">
                Message delivered <strong>✓</strong>
              </span>
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
