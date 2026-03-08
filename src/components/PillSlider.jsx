import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import silhouetteZaka from '../assets/image/sillhouete_zaka.png';

const items = [
  { icon: "💻",  text: "Fullstack Web Development",  color: "#3b82f6" },
  { icon: "🎨",  text: "UI/UX Design & Prototyping",    color: "#8b5cf6" },
  { icon: "⚡",  text: "Performance Optimization", color: "#f97316" },
  { icon: "🚀",  text: "Modern Web Applications",   color: "#2563eb" },
  { icon: "☕",  text: "Coffee-Driven Development",    color: "#16a34a" },
];

const glassStyle = (size, opacity = 1) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(14px) saturate(180%)",
  WebkitBackdropFilter: "blur(14px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.85)",
  opacity,
  cursor: "pointer",
  flexShrink: 0,
});

export default function PillSlider() {
  const [active, setActive] = useState(2);
  const [clicked, setClicked] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.classList.add('hide-navbar');
        } else {
          document.body.classList.remove('hide-navbar');
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      document.body.classList.remove('hide-navbar');
    };
  }, []);

  const prev2 = (active - 2 + items.length) % items.length;
  const prev1 = (active - 1 + items.length) % items.length;
  const next1 = (active + 1) % items.length;
  const next2 = (active + 2) % items.length;

  const advance = () => {
    setActive((p) => (p + 1) % items.length);
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
  };

  return (
    <div className="relative w-full h-screen flex items-start justify-center pt-32 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div ref={containerRef} className="flex items-center justify-center gap-5 select-none w-full">

      {/* ── LEFT icons (previous) ── */}
      <motion.div
        className="flex items-center gap-4"
        layout
      >
        {/* far left — smaller, dimmer */}
        <motion.div
          key={prev2}
          layout
          onClick={() => setActive(prev2)}
          animate={{ opacity: 0.45, scale: 0.75 }}
          whileHover={{ opacity: 0.7, scale: 0.82 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={glassStyle(44)}
        >
          <span style={{ fontSize: 18 }}>{items[prev2].icon}</span>
        </motion.div>

        {/* near left — bigger, clearer */}
        <motion.div
          key={prev1}
          layout
          onClick={() => setActive(prev1)}
          animate={{ opacity: 0.75, scale: 1 }}
          whileHover={{ opacity: 1, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={glassStyle(52)}
        >
          <span style={{ fontSize: 24 }}>{items[prev1].icon}</span>
        </motion.div>
      </motion.div>

      {/* ── CENTER pill ── */}
      <motion.button
        onClick={advance}
        animate={{ backgroundColor: items[active].color }}
        transition={{ duration: 0.35 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "none",
          borderRadius: 999,
          padding: "12px 26px 12px 14px",
          color: "#fff",
          fontWeight: 600,
          fontSize: 15,
          fontFamily: "'Helvetica Neue', sans-serif",
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: `0 6px 28px ${items[active].color}66`,
          flexShrink: 0,
        }}
      >
        {/* icon circle */}
        <AnimatePresence mode="wait">
          <motion.span
            key={active + "-icon"}
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {items[active].icon}
          </motion.span>
        </AnimatePresence>

        {/* text */}
        <AnimatePresence mode="wait">
          <motion.span
            key={active + "-text"}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.22 }}
          >
            {items[active].text}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* ── RIGHT icons (next) ── */}
      <motion.div
        className="flex items-center gap-4"
        layout
      >
        {/* near right */}
        <motion.div
          key={next1}
          layout
          onClick={() => setActive(next1)}
          animate={{ opacity: 0.75, scale: 1 }}
          whileHover={{ opacity: 1, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={glassStyle(52)}
        >
          <span style={{ fontSize: 24 }}>{items[next1].icon}</span>
        </motion.div>

        {/* far right */}
        <motion.div
          key={next2}
          layout
          onClick={() => setActive(next2)}
          animate={{ opacity: 0.45, scale: 0.75 }}
          whileHover={{ opacity: 0.7, scale: 0.82 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={glassStyle(44)}
        >
          <span style={{ fontSize: 18 }}>{items[next2].icon}</span>
        </motion.div>
      </motion.div>

      </div>

      {/* Silhouette at bottom absolute */}
      <motion.img
        src={silhouetteZaka}
        alt="Zaka"
        className="absolute bottom-0 -translate-x-1/2 w-48 h-auto"
        animate={{
          scale: clicked ? [1, 1.15, 1] : 1,
          rotate: clicked ? [0, -5, 5, 0] : 0
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}