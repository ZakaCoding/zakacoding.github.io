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
