import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

import zakaMemoji from '../assets/image/zaka-memoji.jpeg';

const easeOut = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: 'owa',
    number: '01',
    eyebrow: 'Building now',
    name: 'OwA',
    description: 'Local-first coding agent',
    statement: 'Small models. Real repositories. No cloud required.',
    accent: '#dcff68',
    href: 'https://zakacoding.github.io/ollama-workspace-agent',
  },
  {
    id: 'logistics',
    number: '02',
    eyebrow: 'At work',
    name: 'Logistics',
    description: 'Systems behind real operations',
    statement: 'Five connected products. One dependable operation.',
    accent: '#ffd0bf',
  },
  {
    id: 'cmap',
    number: '03',
    eyebrow: 'For thought',
    name: 'Open CMAP',
    description: 'Visual thinking tool',
    statement: 'Making complicated ideas visible enough to discuss.',
    accent: '#b8ceff',
    href: 'https://open-cmap.fly.dev/',
  },
];

function OwaPreview() {
  return (
    <div className="workbench-terminal" aria-label="OwA local coding agent preview">
      <div className="terminal-bar">
        <span className="terminal-lights" aria-hidden="true"><i /><i /><i /></span>
        <span>owa — local</span>
        <span>● ready</span>
      </div>
      <div className="terminal-body">
        <p><span className="terminal-prompt">~</span> owa ./zakacoding</p>
        <p className="terminal-muted">Indexing repository…</p>
        <div className="terminal-result">
          <span>✓</span>
          <p><b>1,284 files understood</b><small>Context stays on this machine.</small></p>
        </div>
        <p className="terminal-question"><span className="terminal-prompt">›</span> Where does the About story begin?</p>
        <p className="terminal-answer">src/pages/About.jsx <span>↗</span></p>
        <span className="terminal-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}

function LogisticsPreview() {
  const systems = [
    { label: 'OMS', className: 'system-oms' },
    { label: 'WMS', className: 'system-wms' },
    { label: 'TMS', className: 'system-tms' },
    { label: 'FMS', className: 'system-fms' },
    { label: 'VMS', className: 'system-vms' },
  ];

  return (
    <div className="logistics-preview" aria-label="Five connected logistics systems preview">
      <div className="logistics-topline">
        <span>DiGILOG / live map</span>
        <span><i /> 05 connected</span>
      </div>
      <svg className="logistics-lines" viewBox="0 0 600 360" aria-hidden="true">
        <path d="M300 180 L112 72 M300 180 L488 72 M300 180 L98 282 M300 180 L502 282 M300 180 L300 318" />
        <circle cx="300" cy="180" r="74" />
      </svg>
      <div className="logistics-core"><small>operation</small><strong>DiGILOG</strong><span>all systems nominal</span></div>
      {systems.map((system) => <span className={`logistics-system ${system.className}`} key={system.label}>{system.label}</span>)}
    </div>
  );
}

function CmapPreview() {
  return (
    <div className="cmap-preview" aria-label="Open CMAP visual thinking preview">
      <div className="cmap-toolbar">
        <b>Open CMAP</b>
        <span>concept-01.cmap</span>
        <span className="cmap-tools">＋ &nbsp; ↗</span>
      </div>
      <svg className="cmap-lines" viewBox="0 0 600 360" aria-hidden="true">
        <path d="M300 178 C250 178 245 83 182 83 M300 178 C355 178 365 78 438 78 M300 178 C250 178 235 294 160 294 M300 178 C360 178 375 284 456 284" />
      </svg>
      <div className="cmap-node cmap-center"><small>start here</small><strong>Quiet systems</strong></div>
      <div className="cmap-node cmap-one">People</div>
      <div className="cmap-node cmap-two">Context</div>
      <div className="cmap-node cmap-three">Clarity</div>
      <div className="cmap-node cmap-four">Outcomes</div>
      <span className="cmap-note">drag an idea.<br />see the relationship.</span>
    </div>
  );
}

const previews = { owa: OwaPreview, logistics: LogisticsPreview, cmap: CmapPreview };

export function Welcome() {
  const [activeId, setActiveId] = useState('owa');
  const activeIndex = projects.findIndex((project) => project.id === activeId);
  const activeProject = projects[activeIndex];
  const ActivePreview = previews[activeId];

  return (
    <main className="workbench-home">
      <section className="workbench-shell" style={{ '--project-accent': activeProject.accent }} aria-labelledby="home-hero-title">
        <motion.div className="workbench-intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeOut }}>
          <div className="workbench-signature">
            <span className="workbench-mark" aria-hidden="true">Za &lt;/</span>
            <span>ZakaCoding / Indonesia</span>
          </div>

          <div className="workbench-copy">
            <p className="workbench-live-line">
              Zaka is building <AnimatePresence mode="wait"><motion.strong key={activeProject.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18 }}>{activeProject.name}.</motion.strong></AnimatePresence>
            </p>
            <h1 id="home-hero-title">
              i build systems.<br />
              i modernize the ones<br />
              people already rely on.
            </h1>
            <p className="workbench-belief">i think good software should make busy operations <em>feel quiet.</em></p>
          </div>

          <div className="workbench-intro-footer">
            <Link to="/about">About Zaka <span aria-hidden="true">↗</span></Link>
            <span>Full-stack / product systems</span>
          </div>
        </motion.div>

        <motion.div className="workbench-stage" style={{ '--project-accent': activeProject.accent }} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.12, ease: easeOut }}>
          <div className="workbench-project-nav" aria-label="Explore featured projects">
            {projects.map((project) => (
              <button
                className={`project-tab ${project.id === activeId ? 'is-active' : ''}`}
                key={project.id}
                type="button"
                aria-pressed={project.id === activeId}
                onClick={() => setActiveId(project.id)}
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
              >
                <span className="project-tab-number">{project.number}</span>
                <span className="project-tab-copy"><small>{project.eyebrow}</small><strong>{project.name}</strong></span>
                <span className="project-tab-dot" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="workbench-preview-wrap">
            <div className="workbench-preview-heading">
              <div><span>{activeProject.eyebrow}</span><h2>{activeProject.name}</h2></div>
              {activeProject.href && (
                <a href={activeProject.href} target="_blank" rel="noreferrer" aria-label={`Open ${activeProject.name}`}>
                  Open <BoxArrowUpRight aria-hidden="true" />
                </a>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div className="workbench-preview" key={activeId} initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: 0.32, ease: easeOut }}>
                <ActivePreview />
              </motion.div>
            </AnimatePresence>

            <div className="workbench-project-caption">
              <span>{activeProject.description}</span>
              <AnimatePresence mode="wait"><motion.p key={activeProject.statement} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{activeProject.statement}</motion.p></AnimatePresence>
            </div>
          </div>

          <motion.figure className="workbench-memoji" animate={{ y: [0, -5, 0], rotate: activeIndex === 0 ? -2 : activeIndex === 1 ? 0 : 2 }} transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.5, ease: easeOut } }}>
            <img src={zakaMemoji} alt="Zaka's memoji smiling behind a sticker-covered laptop" width="1420" height="1781" />
            <figcaption>code, coffee, curiosity.</figcaption>
          </motion.figure>
        </motion.div>

        <div className="workbench-footer" aria-hidden="true">
          <span>Portfolio / 2026</span>
          <span>Systems / clarity / curiosity</span>
        </div>
      </section>
    </main>
  );
}
