// React
import { lazy, Suspense, useEffect } from 'react';
import {
  HashRouter as Router,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// static component
import { Navbar } from './components/Navbar'

// pages
import { Welcome } from './pages/Welcome';

const About = lazy(() => import('./pages/About'));
const Archive = lazy(() => import('./pages/Archive'));
const Operator = lazy(() => import('./pages/Operator'));

// Source css
import './App.css';

function SmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    // GitHub Pages has no SPA fallback. Hash routing keeps shared and refreshed
    // links working while this makes route changes start at the top as expected.
    window.scrollTo(0, 0);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHorizontalStory = location.pathname.startsWith('/about');
    const isOperatorDesk = location.pathname.startsWith('/operator');
    const isTouchDevice = navigator.maxTouchPoints > 0
      || window.matchMedia('(pointer: coarse)').matches;

    // Keep touch devices on native scrolling (especially iPad), but smooth
    // desktop wheel input so the horizontal story does not step between events.
    if (isOperatorDesk || reducedMotion || (isHorizontalStory && isTouchDevice)) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      duration: isHorizontalStory ? 0.8 : 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      prevent: (node) => node.closest?.('.about-conversation') !== null,
    });

    return () => lenis.destroy();
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isOperatorDesk = location.pathname.startsWith('/operator');

  return (
    <>
      <SmoothScroll />
      {!isOperatorDesk && <Navbar />}
      <Suspense fallback={<main className="page-loading" aria-live="polite">Loading page…</main>}>
        <Routes>
          <Route path='/' Component={Welcome} />
          <Route path='/about' Component={About} />
          <Route path='/archive' Component={Archive} />
          <Route path='/operator' Component={Operator} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
