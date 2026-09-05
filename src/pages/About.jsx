import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BoxArrowUpRight,
  Github,
  Instagram,
  Linkedin,
} from 'react-bootstrap-icons';

import zakaMemoji from '../assets/image/zaka-memoji.jpeg';

const slideCount = 6;
const easeOut = [0.22, 1, 0.36, 1];

const reveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.7, ease: easeOut },
};

const toolGroups = [
  {
    number: '01',
    title: 'Shape the product',
    tools: 'Domain mapping · User flows · Prototyping',
  },
  {
    number: '02',
    title: 'Build the system',
    tools: 'Laravel · React · PHP · JavaScript · Python',
  },
  {
    number: '03',
    title: 'Protect the data',
    tools: 'PostgreSQL · MySQL · Redis · S3',
  },
  {
    number: '04',
    title: 'Keep it running',
    tools: 'Docker · Linux · Nginx · CI/CD · Observability',
  },
];

const chapterLabels = ['Hello', 'Operations', 'Thinking', 'Toolbox', 'Curiosity', 'Contact'];

export default function About() {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = (index) => {
    slideRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const horizontalStory = window.matchMedia('(min-width: 601px)');

    const handleWheel = (event) => {
      if (!horizontalStory.matches || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };

    const handleKeyDown = (event) => {
      if (event.target.closest('a, button, input, textarea, select')) return;

      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) {
        event.preventDefault();
        goToSlide(Math.min(activeSlide + 1, slideCount - 1));
      }

      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        goToSlide(Math.max(activeSlide - 1, 0));
      }

      if (event.key === 'Home') {
        event.preventDefault();
        goToSlide(0);
      }

      if (event.key === 'End') {
        event.preventDefault();
        goToSlide(slideCount - 1);
      }
    };

    track.addEventListener('wheel', handleWheel, { passive: false });
    track.addEventListener('keydown', handleKeyDown);

    return () => {
      track.removeEventListener('wheel', handleWheel);
      track.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSlide]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSlide(Number(visible.target.dataset.slide));
      },
      { root: track, threshold: [0.45, 0.6, 0.8] },
    );

    slideRefs.current.forEach((slide) => slide && observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const setSlideRef = (index) => (element) => {
    slideRefs.current[index] = element;
  };

  return (
    <main className="about-story">
      <a className="about-brand" href="/" aria-label="ZakaCoding home">
        <img src="/logo/final-logo.png" alt="" width="1082" height="512" />
        <span>ZakaCoding</span>
      </a>

      <div
        ref={trackRef}
        className="about-track"
        tabIndex="0"
        aria-label="About Zaka, a six-part horizontal story. Use the arrow keys or scroll to navigate."
      >
        <section ref={setSlideRef(0)} data-slide="0" className="about-slide about-intro" aria-labelledby="about-intro-title">
          <span className="about-intro-wordmark" aria-hidden="true">ZakaCoding</span>
          <div className="about-slide-inner about-intro-grid">
            <motion.div className="about-copy" {...reveal}>
              <span className="about-eyebrow">01 / Hello</span>
              <h1 id="about-intro-title">Hello, I’m <em>Zaka.</em></h1>
              <p className="about-lede">
                A full-stack engineer in Indonesia. I turn operational complexity into calm, dependable software—and keep exploring strange ideas after work.
              </p>
              <div className="about-quick-facts">
                <span><b>Based</b> GMT+7</span>
                <span><b>Focus</b> Product systems</span>
                <span><b>Mode</b> Builder + supervisor</span>
              </div>
            </motion.div>

            <motion.div className="about-memoji-card" initial={{ opacity: 0, scale: 0.94, rotate: 2 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: easeOut }}>
              <span>ZakaCoding</span>
              <img src={zakaMemoji} alt="Zaka's memoji smiling behind a sticker-covered laptop" width="1420" height="1781" />
              <small>Code, coffee, curiosity.</small>
            </motion.div>
          </div>
        </section>

        <section ref={setSlideRef(1)} data-slide="1" className="about-slide about-operations" aria-labelledby="about-operations-title">
          <div className="about-slide-inner">
            <motion.div className="about-copy about-copy-wide" {...reveal}>
              <span className="about-eyebrow">02 / What I actually do</span>
              <h2 id="about-operations-title">I make busy operations feel <em>quiet.</em></h2>
              <p className="about-lede">At CKL Cargo, that means connecting the software behind orders, warehouses, transport, fleets, and vendors—not treating them as isolated screens.</p>
            </motion.div>

            <motion.div className="about-operation-flow" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
              <div><span>OMS</span><strong>An order changes</strong></div>
              <i aria-hidden="true">→</i>
              <div><span>WMS</span><strong>The warehouse knows</strong></div>
              <i aria-hidden="true">→</i>
              <div><span>TMS · FMS · VMS</span><strong>The operation adapts</strong></div>
            </motion.div>

            <p className="about-slide-note">The job is the connection between them.</p>
          </div>
        </section>

        <section ref={setSlideRef(2)} data-slide="2" className="about-slide about-thinking" aria-labelledby="about-thinking-title">
          <div className="about-slide-inner">
            <motion.div className="about-copy about-copy-wide" {...reveal}>
              <span className="about-eyebrow">03 / How I think</span>
              <h2 id="about-thinking-title">Clarity is an engineering <em>feature.</em></h2>
            </motion.div>

            <div className="about-principles">
              <motion.article {...reveal} transition={{ ...reveal.transition, delay: 0.08 }}>
                <span>01</span><strong>Understand first</strong><p>Find the operational truth behind the ticket.</p>
              </motion.article>
              <motion.article {...reveal} transition={{ ...reveal.transition, delay: 0.16 }}>
                <span>02</span><strong>Make it useful</strong><p>Architecture and interface should explain each other.</p>
              </motion.article>
              <motion.article {...reveal} transition={{ ...reveal.transition, delay: 0.24 }}>
                <span>03</span><strong>Own the outcome</strong><p>Ship, observe, repair, and leave the system better.</p>
              </motion.article>
            </div>
          </div>
        </section>

        <section ref={setSlideRef(3)} data-slide="3" className="about-slide about-toolbox" aria-labelledby="about-toolbox-title">
          <div className="about-slide-inner about-toolbox-grid">
            <motion.div className="about-copy" {...reveal}>
              <span className="about-eyebrow">04 / Working toolbox</span>
              <h2 id="about-toolbox-title">Tools change. The responsibility <em>doesn’t.</em></h2>
              <p className="about-lede">I move across product thinking, application code, data, and delivery—choosing what makes the whole system easier to trust.</p>
            </motion.div>

            <div className="about-tool-cards">
              {toolGroups.map((group, index) => (
                <motion.article key={group.number} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }}>
                  <span>{group.number}</span>
                  <strong>{group.title}</strong>
                  <p>{group.tools}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section ref={setSlideRef(4)} data-slide="4" className="about-slide about-curiosity" aria-labelledby="about-curiosity-title">
          <div className="about-slide-inner">
            <motion.div className="about-copy about-copy-wide" {...reveal}>
              <span className="about-eyebrow">05 / Beyond the backlog</span>
              <h2 id="about-curiosity-title">Curiosity is part of the <em>job.</em></h2>
              <p className="about-lede">The side projects are not a separate identity. They are where I test ideas that make the day job sharper.</p>
            </motion.div>

            <div className="about-curiosity-grid">
              <motion.a href="https://zakacoding.github.io/ollama-workspace-agent" target="_blank" rel="noreferrer" {...reveal}>
                <span>Local AI</span><strong>OwA</strong><p>Can smaller models become useful coding partners without sending the repository to the cloud?</p><BoxArrowUpRight />
              </motion.a>
              <motion.a href="https://open-cmap.fly.dev/" target="_blank" rel="noreferrer" {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
                <span>Visual thinking</span><strong>Open CMAP</strong><p>Can a complex thought become easier to examine when its relationships are visible?</p><BoxArrowUpRight />
              </motion.a>
              <motion.div className="about-curiosity-small" {...reveal} transition={{ ...reveal.transition, delay: 0.2 }}>
                <span>Always nearby</span><strong>☕</strong><p>Coffee, documentation, and one more experiment.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section ref={setSlideRef(5)} data-slide="5" className="about-slide about-contact" aria-labelledby="about-contact-title">
          <div className="about-slide-inner about-contact-inner">
            <motion.div className="about-copy about-copy-wide" {...reveal}>
              <span className="about-eyebrow">06 / Contact</span>
              <h2 id="about-contact-title">Have a hard problem? <em>Let’s make it clear.</em></h2>
              <p className="about-lede">For product engineering, system modernization, open-source collaboration, or a good conversation about local AI.</p>
            </motion.div>

            <motion.div className="about-contact-row" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
              <a className="about-email" href="mailto:zakanoor@outlook.co.id">zakanoor@outlook.co.id <BoxArrowUpRight /></a>
              <div className="about-socials" aria-label="Social links">
                <a href="https://github.com/ZakaCoding" target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
                <a href="https://www.linkedin.com/in/zaka-n-693018111" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
                <a href="https://instagram.com/youn8e_" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <div className="about-progress" aria-label="About story navigation">
        <button type="button" onClick={() => goToSlide(Math.max(activeSlide - 1, 0))} disabled={activeSlide === 0} aria-label="Previous chapter"><ArrowLeft /></button>
        <div className="about-progress-track">
          {chapterLabels.map((label, index) => (
            <button
              type="button"
              key={label}
              className={index === activeSlide ? 'active' : ''}
              onClick={() => goToSlide(index)}
              aria-label={`Go to ${label}`}
              aria-current={index === activeSlide ? 'step' : undefined}
            ><span>{label}</span></button>
          ))}
        </div>
        <span className="about-progress-count">{String(activeSlide + 1).padStart(2, '0')} / 06</span>
        <button type="button" onClick={() => goToSlide(Math.min(activeSlide + 1, slideCount - 1))} disabled={activeSlide === slideCount - 1} aria-label="Next chapter"><ArrowRight /></button>
      </div>
    </main>
  );
}
