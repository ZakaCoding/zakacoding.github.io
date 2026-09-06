import { motion } from 'framer-motion';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

import zakaMemoji from '../assets/image/zaka-memoji.jpeg';

const easeOut = [0.22, 1, 0.36, 1];

export function Welcome() {
  const heroItem = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
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
              <span className="hero-status-dot" aria-hidden="true" />
              Hey, I’m Zaka · Full-stack engineer
            </div>

            <h1 id="home-hero-title">
              I build the quiet systems behind <span>busy operations.</span>
            </h1>

            <p className="hero-summary">
              Logistics platforms, developer tools, and local-first AI—engineered from backend architecture to the interface people depend on every day.
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
