import { motion } from 'framer-motion';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

import { Footer } from '../components/Footer';

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

const Archive = () => (
  <>
    <main className="archive-page">
      <section className="work-story archive-work-story" aria-labelledby="archive-page-title">
        <div className="story-shell">
          <motion.header className="work-story-heading" {...reveal}>
            <div>
              <span className="section-number">01 / Archive</span>
              <h1 id="archive-page-title">Built for the real world,<br /><em>not the demo reel.</em></h1>
            </div>
            <p>Three kinds of problems. One way of working: understand the system, make it clear, and build it to last.</p>
          </motion.header>

          <div className="featured-project-list">
            <motion.article className="featured-project project-owa" {...reveal}>
              <div className="featured-project-copy">
                <div className="project-meta"><span>01</span><span>Independent · Open source</span></div>
                <p className="project-type">Local AI / Developer tooling</p>
                <h2>OwA</h2>
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
                  <div className="terminal-state"><span /> local · private · grounded</div>
                </div>
              </div>
            </motion.article>

            <motion.article className="featured-project project-logistics" {...reveal}>
              <div className="featured-project-copy">
                <div className="project-meta"><span>02</span><span>Production · CKL Cargo</span></div>
                <p className="project-type">Operations / System modernization</p>
                <h2>Logistics<br />ecosystem</h2>
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
                <h2>Open CMAP</h2>
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
                <div className="cmap-ui" role="img" aria-label="Simplified Open CMAP interface showing a concept map being built from a central idea">
                  <div className="cmap-ui-nav">
                    <span className="cmap-mark" aria-hidden="true">O</span>
                    <span>Dashboard</span>
                    <span>Release Notes</span>
                    <span className="cmap-user">Zaka Noor⌄</span>
                  </div>

                  <div className="cmap-ui-header">
                    <div>
                      <strong>Map Board</strong>
                      <small>CMAP Key: T9D-MNH-CMAP</small>
                    </div>
                    <div className="cmap-ui-actions" aria-hidden="true">
                      <span>Save</span><span>Export Map</span><b>✓ Create Assignment</b>
                    </div>
                  </div>

                  <div className="cmap-ui-workspace">
                    <div className="cmap-ui-sidebar" aria-hidden="true">
                      <strong>Build From</strong>
                      <div className="cmap-source-buttons"><span>Scratch</span><span>File PDF</span></div>
                      <hr />
                      <strong>Super Concept</strong>
                      <div className="cmap-faux-input">Concept mapping</div>
                      <small>The most important concept in the map.</small>
                      <strong>Concept</strong>
                      <div className="cmap-faux-input muted">Add a concept</div>
                      <hr />
                      <strong>ⓘ Tips</strong>
                    </div>

                    <div className="cmap-ui-board" aria-hidden="true">
                      <span className="cmap-collapse">‹</span>
                      <svg className="cmap-connectors" viewBox="0 0 600 380" preserveAspectRatio="none">
                        <motion.path d="M304 154 C365 132 404 118 463 118" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.35, ease: easeOut }} />
                        <motion.path d="M294 170 C264 205 222 239 176 264" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.6, ease: easeOut }} />
                        <motion.path d="M313 171 C337 212 356 240 378 273" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.82, ease: easeOut }} />
                      </svg>
                      <span className="cmap-link-label cmap-link-one">Link</span>
                      <span className="cmap-link-label cmap-link-two">Link</span>
                      <span className="cmap-link-label cmap-link-three">Link</span>
                      <motion.span className="cmap-node cmap-super-node" initial={{ opacity: 0, scale: 0.72 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: easeOut }}>Concept mapping</motion.span>
                      <motion.span className="cmap-node cmap-proposition-node" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.8 }}>Proposition</motion.span>
                      <motion.span className="cmap-node cmap-concept-node" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 1.02 }}>concept</motion.span>
                      <motion.span className="cmap-node cmap-new-node" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 1.18 }}>new node</motion.span>
                    </div>
                  </div>
                </div>
                <span className="preview-note">Ideas become visible</span>
              </div>
            </motion.article>
          </div>

          <motion.section className="project-archive" aria-labelledby="more-work-title" {...reveal}>
            <div className="archive-heading">
              <span className="section-number">More work</span>
              <h2 id="more-work-title">A few more things I’ve made.</h2>
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
    </main>

    <Footer />
  </>
);

export default Archive;
