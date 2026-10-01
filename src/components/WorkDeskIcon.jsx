/* eslint-disable react/prop-types */
// One small SVG vocabulary for the paper desk. Labels live on the controls.
export function WorkDeskIcon({ name, active = false, className = '' }) {
  const artwork = {
    tidy: <>
      <g className="desk-icon-sheet desk-icon-sheet-back"><rect x="6" y="4" width="12" height="16" rx="1.6" /></g>
      <g className="desk-icon-sheet desk-icon-sheet-middle"><rect x="6" y="4" width="12" height="16" rx="1.6" /></g>
      <g className="desk-icon-sheet desk-icon-sheet-front"><rect x="6" y="4" width="12" height="16" rx="1.6" /><path d="M9 9h6M9 12h4" /></g>
    </>,
    sound: <><path d="M4 9h4l5-4v14l-5-4H4z" /><g className="desk-icon-waves"><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14" /></g></>,
    reset: <><path d="M5 8a8 8 0 1 1-1 8M5 3v5h5" /></>,
    grip: <>{[7, 12, 17].flatMap((y) => [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="currentColor" stroke="none" />))}</>,
    sticker: <><path d="M20 13V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h6z" /><path d="M7 8h9M7 11h5" /><path className="desk-icon-peel" d="M12 21v-5a3 3 0 0 1 3-3h5z" /></>,
    folder: <><path d="M3 9V6a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v2" /><path d="M3 9h6l2 2h11l-3 9H4z" /></>,
    'arrow-up-right': <><path d="M6 18 18 6M7 6h11v11" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg className={`desk-icon desk-icon-${name}${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{artwork[name]}</svg>;
}
