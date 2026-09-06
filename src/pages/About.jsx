import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Github, Instagram, Linkedin } from 'react-bootstrap-icons';

import memojiImage from '../assets/image/zaka-memoji.jpeg';
import classicMemoji from '../assets/image/zaka-memoji-classic.jpg';
import ZakaCodingLogo from '../../public/logo/final-logo.png';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const About = () => {
  const exhibitionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const exhibition = exhibitionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!exhibition || !track || !progress) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileLayout = window.matchMedia('(max-width: 700px)');
    let currentX = 0;
    let targetX = 0;
    let travel = 0;
    let frame = 0;

    const paint = () => {
      const difference = targetX - currentX;
      currentX = reducedMotion.matches ? targetX : currentX + difference * 0.11;
      track.style.transform = `translate3d(${-currentX}px, 0, 0)`;
      progress.style.transform = `scaleX(${travel ? currentX / travel : 0})`;

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
        return;
      }

      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      exhibition.style.height = `${travel + window.innerHeight}px`;
      targetX = clamp(window.scrollY - exhibition.offsetTop, 0, travel);

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

        <a className="about-scroll-cue" href="#about-exhibition">
          <span>Scroll to know me</span>
          <ArrowDown aria-hidden="true" />
        </a>
      </section>

      <section
        id="about-exhibition"
        className="about-exhibition"
        ref={exhibitionRef}
        aria-label="About Zaka"
      >
        <div className="about-exhibition-sticky">
          <div className="about-exhibition-track" ref={trackRef}>
            <section className="about-editorial-opening">
              <div className="about-editorial-copy">
                <span className="about-index">02 / ABOUT</span>
                <h2>
                  I Read, Code, and drink too much coffee<span>...</span>
                </h2>
                <p>
                  I&apos;m a curious builder and full-stack engineer. I move between
                  operational systems, thoughtful interfaces, local AI, and open-source
                  experiments—always trying to make complicated things feel clear.
                </p>
              </div>

              <div className="about-editorial-memoji">
                <span className="about-hand-note about-hand-note-one">Build.<br />Learn.<br />Repeat.</span>
                <img
                  src={classicMemoji}
                  alt="Zaka's original glasses Memoji"
                />
                <span className="about-hand-note about-hand-note-two">Read.<br />Code.<br />Coffee.</span>
              </div>
            </section>

            <section className="about-chapter" aria-labelledby="who-title">
              <span className="about-index">03</span>
              <div>
                <h3 id="who-title">Who I am</h3>
                <p className="about-chapter-lede">
                  I&apos;m Zaka, a full-stack engineer based in Indonesia.
                </p>
              </div>
              <p>
                I care about real problems, useful software, and the people who depend
                on it every day.
              </p>
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
          <span className="about-direction" aria-hidden="true">
            Keep scrolling <ArrowRight />
          </span>
        </div>
      </section>
    </main>
  );
};

export default About;
