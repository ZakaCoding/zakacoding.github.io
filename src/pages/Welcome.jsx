import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { BoxArrowUpRight, ChatDots } from 'react-bootstrap-icons';

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
                href="/work/"
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 520, damping: 32 }}
              >
                <span className="hero-action-badge" aria-hidden="true">
                  <span className="hero-action-badge-inner">
                    <span className="hero-action-badge-face hero-action-badge-logo">Za</span>
                    <span className="hero-action-badge-face hero-action-badge-coffee">
                      <svg
                        className="hero-action-coffee-icon"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6zM13 12.5a2 2 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5"
                        />
                        <path d="m4.4.8-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 3.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 6.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 9.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8" />
                      </svg>
                    </span>
                  </span>
                </span>
                <span className="hero-action-copy">
                  <span className="hero-action-copy-default">Explore my work</span>
                  <span className="hero-action-copy-hover">See what I’ve built</span>
                </span>
                <span className="hero-action-arrow" aria-hidden="true">↗</span>
              </motion.a>

              <motion.a
                className="hero-action hero-action-chat"
                href="/#/about?chat=1"
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 520, damping: 32 }}
              >
                <span className="hero-action-chat-mark" aria-hidden="true">
                  <ChatDots className="hero-action-chat-icon" />
                  <span className="hero-action-chat-wave">👋</span>
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
