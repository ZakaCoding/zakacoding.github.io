/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls, useMotionValue } from 'framer-motion';
import { ArrowUpRight, ArrowsMove, ArrowRepeat, Folder2Open, X } from 'react-bootstrap-icons';

import { Footer } from '../components/Footer';
import ngefont from '../assets/image/ngefont/ngfont-illustration.webp';
import amogasakti from '../assets/image/amogasakti/amogasakti.webp';
import takeit from '../assets/image/takeit/1.webp';
import './Archive.css';

const mainWork = [
  { id: 'owa', number: '01', kind: 'Local AI · open source', title: 'OwA', summary: 'A coding partner that knows your repo and runs on your machine.', href: '/work/owa/', action: 'Explore the story' },
  { id: 'logistics', number: '02', kind: 'Operations · production', title: 'Logistics ecosystem', summary: 'Five connected products for the people moving things in the real world.', href: '/work/logistics/', action: 'Explore the story' },
  { id: 'cmap', number: '03', kind: 'Visual thinking · open source', title: 'Open CMAP', summary: 'An open canvas that makes ideas and their relationships visible.', href: '/work/open-cmap/', action: 'Explore the story' },
];

const otherWork = [
  { id: 'ngefont', number: '04', kind: 'Typography platform', title: 'Ngefont', summary: 'A home for finding the right type.', href: 'https://ngefont.com', action: 'Visit website', image: ngefont },
  { id: 'takeit', number: '05', kind: 'Creative agency', title: 'TakeIt', summary: 'A digital home for a creative team.', href: 'https://takeitoffice.com', action: 'Visit website', image: takeit },
  { id: 'amogasakti', number: '06', kind: 'Playful web experience', title: 'Amogasakti', summary: 'A card game with a world of its own.', href: 'https://amogasakti.vercel.app/', action: 'Visit website', image: amogasakti },
];

function NoteVisual({ project }) {
  if (project.id === 'owa') {
    return (
      <div className="canvas-note-visual canvas-note-terminal" aria-hidden="true">
        <span className="terminal-dots"><i /><i /><i /></span>
        <span className="terminal-line"><b>›</b> owa ask <em>&quot;where does this live?&quot;</em></span>
        <span className="terminal-answer">↳ reading the relevant code...</span>
        <span className="terminal-status">● local &amp; grounded</span>
      </div>
    );
  }

  if (project.id === 'logistics') {
    return (
      <div className="canvas-note-visual canvas-note-logistics" aria-hidden="true">
        <span className="logistics-center">DiGILOG</span>
        <span className="logistics-node logistics-node-one">OMS</span>
        <span className="logistics-node logistics-node-two">WMS</span>
        <span className="logistics-node logistics-node-three">TMS</span>
        <span className="logistics-node logistics-node-four">FMS</span>
        <span className="logistics-node logistics-node-five">VMS</span>
      </div>
    );
  }

  if (project.id === 'cmap') {
    return (
      <div className="canvas-note-visual canvas-note-cmap" aria-hidden="true">
        <span className="cmap-thought cmap-thought-one">ideas</span>
        <span className="cmap-thought cmap-thought-two">connect</span>
        <span className="cmap-thought cmap-thought-three">to ideas</span>
        <svg viewBox="0 0 310 116" preserveAspectRatio="none"><path d="M92 56 C124 56 120 22 150 24 M190 30 C215 31 205 76 232 76" /></svg>
      </div>
    );
  }

  return null;
}

function WorkNote({ project, boardRef }) {
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const external = project.href.startsWith('http');

  const moveWithKeyboard = (event) => {
    const moves = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] };
    const move = moves[event.key];
    if (!move || !boardRef.current) return;
    event.preventDefault();

    const board = boardRef.current.getBoundingClientRect();
    const note = event.currentTarget.closest('.canvas-note-position').getBoundingClientRect();
    const horizontal = move[0] > 0 ? Math.min(move[0], board.right - note.right) : Math.max(move[0], board.left - note.left);
    const vertical = move[1] > 0 ? Math.min(move[1], board.bottom - note.bottom) : Math.max(move[1], board.top - note.top);
    x.set(x.get() + horizontal);
    y.set(y.get() + vertical);
  };

  return (
    <motion.div
      className={'canvas-note-position canvas-note-position-' + project.id}
      style={{ x, y }}
      drag
      dragListener={false}
      dragControls={controls}
      dragConstraints={boardRef}
      dragElastic={0.08}
      dragMomentum={false}
      whileDrag={{ scale: 1.035, zIndex: 20, cursor: 'grabbing' }}
    >
      <article className={'canvas-note canvas-note-' + project.id}>
        <div className="canvas-note-top">
          <span>{project.number} / {project.kind}</span>
          <button
            className="canvas-note-grip"
            type="button"
            aria-label={'Move ' + project.title + ' note. Drag or use arrow keys.'}
            aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
            title="Drag or use arrow keys to move"
            onPointerDown={(event) => controls.start(event)}
            onKeyDown={moveWithKeyboard}
          >
            <ArrowsMove aria-hidden="true" />
          </button>
        </div>
        <NoteVisual project={project} />
        <div className="canvas-note-copy">
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
          <a href={project.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
            {project.action} <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </article>
    </motion.div>
  );
}

function Archive() {
  const boardRef = useRef(null);
  const folderContentsRef = useRef(null);
  const [layout, setLayout] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [folderOpen, setFolderOpen] = useState(false);

  useEffect(() => {
    if (!folderOpen) return undefined;
    const frame = requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      folderContentsRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [folderOpen]);

  const resetBoard = () => {
    setLayout(0);
    setResetKey((value) => value + 1);
  };

  const shuffleBoard = () => {
    setLayout((value) => (value + 1) % 3);
    setResetKey((value) => value + 1);
  };

  return (
    <>
      <main className="archive-page canvas-work-page">
        <section className="canvas-work-intro" aria-labelledby="archive-page-title">
          <span className="canvas-work-eyebrow"><span className="canvas-work-eyebrow-dot" /> Selected projects / 2020—now</span>
          <h1 id="archive-page-title">Work<span className="canvas-work-title-star" aria-hidden="true">✳</span></h1>
          <div className="canvas-work-manifesto">
            <p>Make <span className="canvas-typed-word canvas-typed-one">ideas</span> tangible.</p>
            <p>Make <span className="canvas-typed-word canvas-typed-two">systems</span> clearer.</p>
            <p>Make <span className="canvas-typed-word canvas-typed-three">tools</span> useful.</p>
          </div>
          <div className="canvas-work-hint"><ArrowsMove aria-hidden="true" /> Grab a note and make this space yours</div>
        </section>

        <section className="canvas-board-shell" aria-label="Selected work board">
          <div className="canvas-board-toolbar">
            <span className="canvas-board-label"><span className="canvas-board-live-dot" /> Zaka’s desk <span className="canvas-board-count">/ 03 selected + 03 filed</span></span>
            <div className="canvas-board-actions">
              <button type="button" onClick={shuffleBoard}><span aria-hidden="true">✳</span> Shuffle</button>
              <button type="button" onClick={resetBoard}><ArrowRepeat aria-hidden="true" /> Reset</button>
            </div>
          </div>
          <div className="canvas-board" ref={boardRef} data-layout={layout}>
            <div className="canvas-margin-note canvas-margin-note-one"><span>note to self / 01</span><p>Good tools begin with a better question.</p><i aria-hidden="true">↗</i></div>
            <div className="canvas-margin-note canvas-margin-note-two"><span>scribble / 02</span><p>Messy ideas are welcome here.</p></div>
            <span className="canvas-board-scribble canvas-board-scribble-one" aria-hidden="true">curiosity in progress ↗</span>
            <span className="canvas-board-scribble canvas-board-scribble-two" aria-hidden="true">keep making things</span>
            <span className="canvas-board-cross canvas-board-cross-one" aria-hidden="true">+</span>
            <span className="canvas-board-cross canvas-board-cross-two" aria-hidden="true">+</span>
            {mainWork.map((project) => <WorkNote key={project.id + '-' + resetKey} project={project} boardRef={boardRef} />)}
            <button
              type="button"
              className="canvas-folder"
              aria-expanded={folderOpen}
              aria-controls="canvas-folder-contents"
              onClick={() => setFolderOpen((open) => !open)}
            >
              <span className="canvas-folder-tab">filed away / 03</span>
              <span className="canvas-folder-art" aria-hidden="true"><i /><i /><Folder2Open /></span>
              <strong>Other little worlds</strong>
              <span>{folderOpen ? 'Folder open · see below' : 'Ngefont, TakeIt & Amogasakti'} <ArrowUpRight aria-hidden="true" /></span>
            </button>
          </div>
          <AnimatePresence initial={false}>
            {folderOpen && (
              <motion.section
                id="canvas-folder-contents"
                ref={folderContentsRef}
                className="canvas-folder-contents"
                aria-label="Other projects"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="canvas-folder-inner">
                  <div className="canvas-folder-heading"><div><span>OPEN FOLDER / 03 MORE PROJECTS</span><h2>More things I’ve made.</h2></div><button type="button" onClick={() => setFolderOpen(false)} aria-label="Close other projects"><X aria-hidden="true" /></button></div>
                  <div className="canvas-folder-grid">
                    {otherWork.map((project, index) => (
                      <motion.a
                        className="canvas-folder-project"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        key={project.id}
                        initial={{ opacity: 0, y: 26, rotate: index === 1 ? 2 : -2 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        whileHover={{ y: -4, rotate: index === 1 ? 1 : -1 }}
                        transition={{ delay: 0.1 + index * 0.08, duration: 0.45 }}
                      >
                        <img src={project.image} alt="" loading="lazy" />
                        <span>{project.number} / {project.kind}</span>
                        <strong>{project.title} <ArrowUpRight aria-hidden="true" /></strong>
                        <p>{project.summary}</p>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
          <div className="canvas-board-bottom"><span>Drag to rearrange <span aria-hidden="true">↗</span></span><span>Click a project to step inside</span></div>
        </section>
      </main>

      <section className="portfolio-contact-strip" aria-label="Contact Zaka"><h2>Have a related problem?</h2><a href="/#/about?chat=1">Start a conversation →</a><a href="mailto:zakanoor@outlook.co.id">zakanoor@outlook.co.id</a></section>
      <Footer />
    </>
  );
}

export default Archive;
