import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

import zakaMemoji from '../assets/image/zaka-memoji.jpeg';
import localAiRobot from '../assets/image/local-ai-robot.webp';

const easeOut = [0.22, 1, 0.36, 1];
const LocalAiRobot = lazy(() => import('../components/LocalAiRobot'));

export function Welcome() {
  const [coffeeOpen, setCoffeeOpen] = useState(false);
  const [robotOpen, setRobotOpen] = useState(false);
  const [robotGaze, setRobotGaze] = useState({ x: 0, y: 0 });

  const heroItem = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  const moveRobotGaze = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 5;
    setRobotGaze({ x, y });
  };

  return (
    <main className="home-only">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <motion.div
          className="hero-bento"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
        >
          <motion.article className="hero-card hero-intro-card" variants={heroItem} transition={{ duration: 0.7, ease: easeOut }}>
            <div className="hero-kicker">
              <span className="hero-wave" role="img" aria-label="Hello">👋</span>
              <span>Hey, I’m Zaka · Full-stack engineer</span>
            </div>

            <h1 id="home-hero-title">
              I Read, Code, and <span className="hero-heading-muted">drink too much{' '}
                <button
                  className="coffee-word"
                  type="button"
                  aria-expanded={coffeeOpen}
                  aria-label="Coffee conversation"
                  onClick={() => setCoffeeOpen(true)}
                  onMouseEnter={() => setCoffeeOpen(true)}
                  onMouseLeave={() => setCoffeeOpen(false)}
                  onFocus={() => setCoffeeOpen(true)}
                  onBlur={() => setCoffeeOpen(false)}
                  onKeyDown={(event) => event.key === 'Escape' && setCoffeeOpen(false)}
                >
                  coffee
                  <span className={`coffee-imessage ${coffeeOpen ? 'is-visible' : ''}`} aria-hidden={!coffeeOpen}>
                    <span className="coffee-message-header">
                      <span className="coffee-avatar" aria-hidden="true">☕️</span>
                      <span><b>Coffee</b><small>now</small></span>
                    </span>
                    <span className="coffee-bubble coffee-bubble-in">One more cup?</span>
                    <span className="coffee-bubble coffee-bubble-out">Already brewing.</span>
                    <span className="coffee-typing" aria-hidden="true"><i /><i /><i /></span>
                  </span>
                </button>
                .
              </span>
            </h1>

            <p className="hero-summary">
              Between refills, I build logistics platforms that don&apos;t lose track of trucks, a{' '}
              <button
                className="local-ai-word"
                type="button"
                aria-expanded={robotOpen}
                aria-label="Meet the local AI robot"
                onClick={() => setRobotOpen(true)}
                onMouseEnter={() => setRobotOpen(true)}
                onMouseLeave={() => { setRobotOpen(false); setRobotGaze({ x: 0, y: 0 }); }}
                onMouseMove={moveRobotGaze}
                onFocus={() => setRobotOpen(true)}
                onBlur={() => setRobotOpen(false)}
                onKeyDown={(event) => event.key === 'Escape' && setRobotOpen(false)}
              >
                local AI
                <span
                  className={`local-ai-popover ${robotOpen ? 'is-visible' : ''}`}
                  style={{
                    '--gaze-x': `${robotGaze.x}px`,
                    '--gaze-y': `${robotGaze.y}px`,
                    '--head-rotate': `${robotGaze.x * 0.8}deg`,
                  }}
                  aria-hidden={!robotOpen}
                >
                  <span className="robot-halo" aria-hidden="true" />
                  <span className="robot-character">
                    {robotOpen && (
                      <Suspense fallback={<img className="robot-static-fallback" src={localAiRobot} alt="" width="640" height="640" />}>
                        <LocalAiRobot />
                      </Suspense>
                    )}
                  </span>
                  <span className="robot-message">Runs here. Stays here.</span>
                </span>
              </button>{' '}
              that doesn&apos;t need the cloud&apos;s permission, and the occasional tool to untangle other people&apos;s ideas.
            </p>
            <div className="hero-primary-actions" aria-label="Portfolio actions">
              <motion.a
                className="hero-action hero-action-work"
                aria-label="Explore my work"
                href="/work/"
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 520, damping: 32 }}
              >
                <span className="hero-action-badge" aria-hidden="true">
                  <svg className="hero-project-stack" viewBox="0 0 40 40" fill="none">
                    <g className="hero-project-card hero-project-card-back">
                      <rect x="10" y="8" width="23" height="26" rx="5" fill="#bcd0ff" />
                    </g>
                    <g className="hero-project-card hero-project-card-middle">
                      <rect x="7" y="8" width="23" height="26" rx="5" fill="#ffd6c7" />
                    </g>
                    <g className="hero-project-card hero-project-card-front">
                      <rect x="5" y="7" width="24" height="27" rx="5" fill="#dfff76" />
                      <path d="M9 13h5m3 0h2" stroke="#65783a" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="m13 19-4 4 4 4m8-8 4 4-4 4m-3-9-2 10" stroke="#24262c" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <path className="hero-project-spark" d="M33 3v6m-3-3h6" stroke="#dfff76" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="hero-action-copy">
                  <span className="hero-action-copy-default">Explore my work</span>
                  <span className="hero-action-copy-hover">See what I’ve built</span>
                </span>
                <span className="hero-action-arrow" aria-hidden="true">↗</span>
              </motion.a>

              <motion.a
                className="hero-action hero-action-chat"
                aria-label="Let’s talk"
                href="/#/about?chat=1"
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 520, damping: 32 }}
              >
                <span className="hero-action-chat-mark" aria-hidden="true">
                  <svg className="hero-conversation-icon" viewBox="0 0 32 32" fill="none">
                    <path className="hero-conversation-echo" d="M13 8h10a5 5 0 0 1 5 5v6l-4-2h-9" fill="#bcd0ff" stroke="#24262c" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M4 13a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5h-7l-6 4v-5a5 5 0 0 1-2-4z" fill="#fff" stroke="#24262c" strokeWidth="1.4" strokeLinejoin="round" />
                    <g fill="#24262c">
                      <circle className="hero-conversation-dot" cx="9" cy="16" r="1.3" />
                      <circle className="hero-conversation-dot" cx="14" cy="16" r="1.3" />
                      <circle className="hero-conversation-dot" cx="19" cy="16" r="1.3" />
                    </g>
                  </svg>
                </span>
                <span className="hero-action-copy">
                  <span className="hero-action-copy-default">Let’s talk</span>
                  <span className="hero-action-copy-hover">Say hi</span>
                </span>
                <span className="hero-action-arrow" aria-hidden="true">→</span>
              </motion.a>
            </div>
          </motion.article>

          <motion.article className="hero-card hero-memoji-card" variants={heroItem} transition={{ duration: 0.7, ease: easeOut }}>
            <div className="memoji-caption">
              <span>ZakaCoding</span>
              <span>GMT+7</span>
            </div>
            <img
              src={zakaMemoji}
              className="hero-memoji"
              alt="Zaka's memoji smiling behind a sticker-covered laptop"
              width="1420"
              height="1781"
              decoding="async"
            />
            <p>Code, coffee, curiosity.</p>
          </motion.article>

          <motion.a
            className="hero-card hero-story-card hero-owa-card"
            href="https://zakacoding.github.io/ollama-workspace-agent"
            target="_blank"
            rel="noreferrer"
            variants={heroItem}
            transition={{ duration: 0.65, ease: easeOut }}
          >
            <span className="story-label">Building now</span>
            <strong>OwA</strong>
            <small>Local-first coding agent</small>
            <BoxArrowUpRight className="story-arrow" aria-hidden="true" />
          </motion.a>

          <motion.article className="hero-card hero-story-card hero-logistics-card" variants={heroItem} transition={{ duration: 0.65, ease: easeOut }}>
            <span className="story-label">At work</span>
            <strong>Logistics</strong>
            <small>Systems behind real operations</small>
            <span className="story-count">05 connected products</span>
            <a className="story-case-link" href="/work/logistics/">Read the engineering story ↗</a>
          </motion.article>

          <motion.a
            className="hero-card hero-story-card hero-cmap-card"
            href="https://open-cmap.fly.dev/"
            target="_blank"
            rel="noreferrer"
            variants={heroItem}
            transition={{ duration: 0.65, ease: easeOut }}
          >
            <span className="story-label">For thought</span>
            <strong>Open CMAP</strong>
            <small>Make complex ideas visible</small>
            <BoxArrowUpRight className="story-arrow" aria-hidden="true" />
          </motion.a>
        </motion.div>

        <div className="home-hero-footer" aria-hidden="true">
          <span>Portfolio / 2026</span>
          <span>ZakaCoding · Indonesia</span>
        </div>
      </section>
    </main>
  );
}
