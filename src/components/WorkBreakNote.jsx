/* eslint-disable react/prop-types */
import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './WorkBreakNote.css';

// Frame individual die-cuts from the atlas or the Pinterest reaction cutout.
const stickerSets = {
  quiet: [
    { id: 'wine', frame: '140 65 285 468' },
    { id: 'email-reaction', frame: '154 53 947 1148', image: '/work/stickers/email-reaction.webp', imageWidth: 1254, imageHeight: 1254 },
    { id: 'candle', frame: '1078 73 345 468', name: 'candle' },
  ],
  chatty: [
    { id: 'coffee', frame: '99 539 422 442' },
    { id: 'wave', frame: '584 552 392 429' },
    { id: 'chat', frame: '1068 647 388 309', name: 'chat bubble' },
  ],
};

function StickerArtwork({ sticker, index, reduced }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.span
        key={sticker.id}
        className="canvas-break-sticker-face"
        aria-hidden="true"
        initial={{ opacity: 0, y: reduced ? 0 : 8, rotate: reduced ? 0 : 5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : -10, rotate: reduced ? 0 : -8 }}
        transition={{ duration: reduced ? 0 : 0.19, delay: reduced ? 0 : index * 0.025, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="canvas-break-sticker-art" viewBox={sticker.frame} aria-hidden="true" focusable="false">
          <image href={sticker.image || '/work/stickers/desk-stickers.webp'} width={sticker.imageWidth || 1536} height={sticker.imageHeight || 1024} />
        </svg>
      </motion.span>
    </AnimatePresence>
  );
}

export function WorkBreakNote() {
  const [quiet, setQuiet] = useState(true);
  const [peekPinned, setPeekPinned] = useState(false);
  const [peekHovered, setPeekHovered] = useState(false);
  const reduced = useReducedMotion();
  const secretId = useId();
  const peeking = peekPinned || peekHovered;
  const stickers = stickerSets[quiet ? 'quiet' : 'chatty'];

  const toggleQuiet = () => {
    setQuiet((current) => !current);
    setPeekPinned(false);
    setPeekHovered(false);
  };

  return (
    <div className={'canvas-break-note' + (quiet ? ' is-quiet' : ' is-chatty')}>
      <span className="canvas-break-label">{quiet ? 'out of office / probably' : 'back at my desk / allegedly'}</span>
      <p>{quiet ? 'Thank you for your email, but...' : 'Plot twist: my inbox is awake.'}</p>
      <button type="button" className="canvas-break-dnd" role="switch" aria-label="Do not disturb" aria-checked={quiet} onClick={toggleQuiet}>
        <span className="canvas-break-dnd-label" aria-hidden="true">{quiet ? 'Do Not Disturb' : 'Please Disturb'}</span>
      </button>
      <div className={'canvas-break-stickers' + (peeking ? ' is-peeking' : '')}>
        {stickers.map((sticker, index) => index === 2 ? (
          <button
            key="peel"
            type="button"
            className="canvas-break-sticker canvas-break-peel"
            aria-label={'Peek under the ' + sticker.name + ' sticker'}
            aria-expanded={peeking}
            aria-controls={secretId}
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') setPeekHovered(true); }}
            onPointerLeave={() => setPeekHovered(false)}
            onClick={() => setPeekPinned((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setPeekPinned(false);
                setPeekHovered(false);
              }
            }}
          >
            <span className="canvas-break-sticker-mount">
              <StickerArtwork sticker={sticker} index={index} reduced={reduced} />
              <span className="canvas-break-sticker-curl" aria-hidden="true" />
            </span>
          </button>
        ) : (
          <span className="canvas-break-sticker" key={index} aria-hidden="true">
            <span className="canvas-break-sticker-mount"><StickerArtwork sticker={sticker} index={index} reduced={reduced} /></span>
          </span>
        ))}
        <span className="canvas-break-secret" id={secretId} aria-hidden={!peeking}>unless you brought coffee</span>
      </div>
      <span className="canvas-break-aside" role="status">{quiet ? 'You can still look around. Just quietly.' : 'Okay, the bugs can talk again.'}</span>
      <a className="canvas-break-coffee-link" href="https://ko-fi.com/zakacoding" target="_blank" rel="noopener noreferrer">
        Enjoyed the little worlds? Buy me a coffee <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
