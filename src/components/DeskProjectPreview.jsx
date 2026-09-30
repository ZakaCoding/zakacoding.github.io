/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// These are small, illustrative previews. Navigation stays in the project link.
export function DeskProjectPreview({ project }) {
  const [open, setOpen] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [node, setNode] = useState({ x: 235, y: 86 });
  const map = useRef(null);
  const reduced = useReducedMotion();
  const moveNode = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const rect = map.current.getBoundingClientRect();
    setNode({ x: Math.max(175, Math.min(247, (event.clientX - rect.left) / rect.width * 310)), y: Math.max(62, Math.min(112, (event.clientY - rect.top) / rect.height * 145)) });
  };
  if (project.id === 'owa') return (
    <div className={`desk-receipt${open ? ' is-unrolled' : ''}`}>
      <div className="desk-receipt-screen">
        <span className="desk-preview-meta">OwA / local session <span>●</span></span>
        <code>› owa ask<br /><b>“where does this live?”</b></code>
        <AnimatePresence initial={false}>
          {open && <motion.div id="owa-receipt-result" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35 }} style={{ overflow: 'hidden' }}>
            <div className="desk-receipt-result">
              <span>↳ searching this repository</span>
              <strong>src/pages/Archive.jsx</strong>
              <span>The desk starts here. Follow the paper trail.</span>
            </div>
          </motion.div>}
        </AnimatePresence>
        <span className="desk-receipt-foot">YOUR REPO. YOUR MACHINE.</span>
      </div>
      <button type="button" className="desk-receipt-pull" aria-expanded={open} aria-controls="owa-receipt-result" onClick={() => setOpen(!open)}><span aria-hidden="true">↓</span> {open ? 'Fold the receipt' : 'Pull the paper trail'} <span aria-hidden="true">↓</span></button>
    </div>
  );
  if (project.id === 'logistics') return (
    <div className={`desk-shipping${dispatched ? ' is-dispatched' : ''}`}>
      <div className="desk-preview-meta"><span>CKL / DiGILOG</span><span>ROUTE 002</span></div>
      <div className="desk-shipping-route" aria-hidden="true">
        <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path d="M30 26H150H270V70H150H30" /></svg>
        {['OMS', 'WMS', 'TMS', 'FMS', 'VMS'].map((name, index) => <span key={name} className={`desk-route-stop desk-route-stop-${index}`}>{name}</span>)}
        {dispatched && <motion.i className="desk-shipment" initial={false} animate={{ left: reduced ? '10%' : ['10%', '50%', '90%', '90%', '50%', '10%'], top: reduced ? '78%' : ['29%', '29%', '29%', '78%', '78%', '78%'] }} transition={{ duration: reduced ? 0 : 2.2, ease: 'easeInOut' }} onAnimationComplete={() => setDelivered(true)} />}
      </div>
      <div className="desk-shipping-bottom"><span className="desk-barcode" aria-hidden="true" /><button type="button" disabled={dispatched && !delivered} onClick={() => { if (delivered) { setDispatched(false); setDelivered(false); } else { setDispatched(true); if (reduced) setDelivered(true); } }}>{delivered ? 'Send another ↗' : dispatched ? 'In transit…' : 'Dispatch ↗'}</button></div>
      <span className={`desk-delivery-stamp${delivered ? ' is-visible' : ''}`} role="status">{delivered ? 'Delivered ✓' : ''}</span>
    </div>
  );
  return (
    <div className="desk-map" ref={map}>
      <span className="desk-preview-meta">A thought, still taking shape</span>
      <svg viewBox="0 0 310 145" preserveAspectRatio="none" aria-hidden="true"><path d={`M56 75 Q110 75 145 48 Q195 40 ${node.x} ${node.y}`} /></svg>
      <span className="desk-map-node desk-map-start">what if?</span><span className="desk-map-node desk-map-middle">connect</span>
      <button type="button" className="desk-map-node desk-map-loose" style={{ left: `${node.x / 310 * 100}%`, top: `${node.y / 145 * 100}%` }} aria-label="Move your next idea. Drag or use arrow keys." onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={moveNode} onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)} onKeyDown={(event) => {
        const move = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }[event.key];
        if (!move) return;
        event.preventDefault(); setNode(({ x, y }) => ({ x: Math.max(175, Math.min(247, x + move[0])), y: Math.max(62, Math.min(112, y + move[1])) }));
      }}>your next idea</button>
      <span className="desk-map-caption">give that idea a little room ↗</span>
    </div>
  );
}
