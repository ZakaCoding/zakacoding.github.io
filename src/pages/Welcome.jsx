import { motion } from 'framer-motion';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

import { Footer } from '../components/Footer';

import zakaMemoji from '../assets/image/zaka-memoji.jpeg';
import ngefont from '../assets/image/ngefont/ngfont-illustration.png';
import amogasakti from '../assets/image/amogasakti/amogasakti.png';
import takeit from '../assets/image/takeit/1.png';

const easeOut = [0.22, 1, 0.36, 1];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.75, ease: easeOut },
};

export function Welcome() {
  const heroItem = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <section className="home-hero" aria-labelledby="home-hero-title">
        <motion.div
          className="hero-bento"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
        >
          <motion.article className="hero-card hero-intro-card" variants={heroItem} transition={{ duration: 0.7, ease: easeOut }}>
            <div className="hero-kicker">
              <span className="hero-status-dot" aria-hidden="true"></span>
              Hey, I’m Zaka · Full-stack engineer
            </div>

            <h1 id="home-hero-title">
              I build the quiet systems behind <span>busy operations.</span>
            </h1>

            <p className="hero-summary">
              Logistics platforms, developer tools, and local-first AI—engineered from backend architecture to the interface people depend on every day.
            </p>

            <div className="hero-actions">
              <a className="hero-primary-action" href="#experience">
                Meet the work <span aria-hidden="true">↓</span>
              </a>
              <a className="hero-secondary-action" href="https://github.com/ZakaCoding" target="_blank" rel="noreferrer">
                GitHub <BoxArrowUpRight aria-hidden="true" />
              </a>
            </div>

            <div className="hero-chapters" aria-label="Featured areas">
              <span><b>01</b> Local AI</span>
              <span><b>02</b> Logistics</span>
              <span><b>03</b> Visual thinking</span>
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
          <span>Scroll to continue ↓</span>
        </div>
      </section>

      <section id="experience" className="work-story" aria-labelledby="work-story-title">
        <div className="story-shell">
          <motion.header className="work-story-heading" {...reveal}>
            <div>
              <span className="section-number">02 / Selected work</span>
              <h2 id="work-story-title">Built for the real world,<br /><em>not the demo reel.</em></h2>
            </div>
            <p>Three kinds of problems. One way of working: understand the system, make it clear, and build it to last.</p>
          </motion.header>

          <div className="featured-project-list">
            <motion.article className="featured-project project-owa" {...reveal}>
              <div className="featured-project-copy">
                <div className="project-meta"><span>01</span><span>Independent · Open source</span></div>
                <p className="project-type">Local AI / Developer tooling</p>
                <h3>OwA</h3>
                <p className="project-name">Ollama Workspace Agent</p>
                <p className="project-lede">A local-first coding agent built specifically for Ollama and smaller models. It grounds answers in the repository, uses tools safely, and keeps code on the developer’s own machine.</p>
                <ul className="project-tags" aria-label="OwA technologies">
                  <li>Python</li><li>Ollama</li><li>Hybrid search</li><li>CLI</li>
                </ul>
                <div className="project-actions">
                  <a href="https://zakacoding.github.io/ollama-workspace-agent" target="_blank" rel="noreferrer">Visit OwA <BoxArrowUpRight /></a>
                  <a href="https://github.com/ZakaCoding/ollama-workspace-agent" target="_blank" rel="noreferrer">Source <BoxArrowUpRight /></a>
                </div>
              </div>

              <div className="owa-terminal" aria-label="OwA terminal preview">
                <div className="terminal-bar"><span>owa — workspace</span><span>● ● ●</span></div>
                <div className="terminal-content">
                  <pre className="terminal-wordmark">{`   _       __
  | | /| / /
  | |/ |/ /
  |__/|__/`}</pre>
                  <p><b>$</b> owa</p>
                  <p className="terminal-dim">✓ repository indexed · context ready</p>
                  <p><b>›</b> explain this deployment flow</p>
                  <p className="terminal-response">Reading the relevant code before answering…</p>
                  <div className="terminal-state"><span></span> local · private · grounded</div>
                </div>
              </div>
            </motion.article>

            <motion.article className="featured-project project-logistics" {...reveal}>
              <div className="featured-project-copy">
                <div className="project-meta"><span>02</span><span>Production · CKL Cargo</span></div>
                <p className="project-type">Operations / System modernization</p>
                <h3>Logistics<br />ecosystem</h3>
                <p className="project-lede">Connected software for order, warehouse, transport, fleet, and vendor operations—modernized as one ecosystem with clearer workflows and safer delivery.</p>
                <ul className="project-tags" aria-label="Logistics platform technologies">
                  <li>Laravel</li><li>React</li><li>Docker</li><li>PostgreSQL</li><li>Redis</li>
                </ul>
              </div>

              <div className="logistics-map" aria-label="DiGILOG connected product ecosystem">
                <svg viewBox="0 0 600 600" aria-hidden="true">
                  <circle cx="300" cy="300" r="204" />
                  <circle cx="300" cy="300" r="126" />
                  <path d="M300 300 L170 138 M300 300 L435 135 M300 300 L500 322 M300 300 L393 493 M300 300 L142 454" />
                </svg>
                <div className="map-core">DiGILOG<small>Operations core</small></div>
                <span className="map-node map-oms">OMS</span>
                <span className="map-node map-wms">WMS</span>
                <span className="map-node map-tms">TMS</span>
                <span className="map-node map-fms">FMS</span>
                <span className="map-node map-vms">VMS</span>
                <p>Five products. Shared operational context.</p>
              </div>
            </motion.article>

            <motion.article className="featured-project project-cmap" {...reveal}>
              <div className="featured-project-copy">
                <div className="project-meta"><span>03</span><span>Independent · Open source</span></div>
                <p className="project-type">Knowledge tools / Visual thinking</p>
                <h3>Open CMAP</h3>
                <p className="project-lede">A free visual workspace for organizing concepts and relationships—making complex thinking easier to understand, edit, and share.</p>
                <ul className="project-tags" aria-label="Open CMAP qualities">
                  <li>Concept mapping</li><li>Visual tools</li><li>Open source</li>
                </ul>
                <div className="project-actions">
                  <a href="https://open-cmap.fly.dev/" target="_blank" rel="noreferrer">Open the canvas <BoxArrowUpRight /></a>
                  <a href="https://open-cmap.fly.dev/presentation" target="_blank" rel="noreferrer">Read the story <BoxArrowUpRight /></a>
                </div>
              </div>

              <div className="cmap-preview">
                <video src="https://open-cmap.fly.dev/assets/video/concept.mp4" autoPlay loop muted playsInline aria-label="Open CMAP concept mapping demonstration"></video>
                <span className="preview-note">Ideas become visible</span>
              </div>
            </motion.article>
          </div>

          <motion.section className="project-archive" aria-labelledby="archive-title" {...reveal}>
            <div className="archive-heading">
              <span className="section-number">Archive</span>
              <h3 id="archive-title">A few more things I’ve made.</h3>
            </div>
            <div className="archive-grid">
              <a href="https://ngefont.com" target="_blank" rel="noreferrer" className="archive-card">
                <img src={ngefont} alt="Ngefont website interface" loading="lazy" />
                <div><span>Typography platform</span><strong>Ngefont</strong><BoxArrowUpRight /></div>
              </a>
              <a href="https://takeitoffice.com" target="_blank" rel="noreferrer" className="archive-card">
                <img src={takeit} alt="TakeIt agency website" loading="lazy" />
                <div><span>Creative agency</span><strong>TakeIt</strong><BoxArrowUpRight /></div>
              </a>
              <a href="https://amogasakti.vercel.app/" target="_blank" rel="noreferrer" className="archive-card">
                <img src={amogasakti} alt="Amogasakti card game website" loading="lazy" />
                <div><span>Card game experience</span><strong>Amogasakti</strong><BoxArrowUpRight /></div>
              </a>
            </div>
          </motion.section>
        </div>
      </section>

      <section className="outcome-statement" aria-labelledby="outcome-title">
        <motion.div className="outcome-inner" {...reveal}>
          <span className="section-number">03 / How I work</span>
          <h2 id="outcome-title">Full-stack means owning the whole outcome.</h2>
          <div className="outcome-layers">
            <div><span>01</span><strong>Understand</strong><p>Find the real operational problem.</p></div>
            <div><span>02</span><strong>Build</strong><p>Connect architecture and interface.</p></div>
            <div><span>03</span><strong>Ship</strong><p>Verify, observe, and improve.</p></div>
          </div>
        </motion.div>
      </section>

      <section id="contact" className="contact-story" aria-labelledby="contact-story-title">
        <motion.div className="contact-story-inner" {...reveal}>
          <span className="section-number">04 / Contact</span>
          <h2 id="contact-story-title">Have a hard problem? <em>Let’s make it clear.</em></h2>
          <div className="contact-story-footer">
            <p>For product engineering, system modernization, open-source collaboration, or a good conversation about local AI.</p>
            <a href="mailto:zakanoor@outlook.co.id">zakanoor@outlook.co.id <BoxArrowUpRight /></a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
