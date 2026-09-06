// React
import { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
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

// Source css
import './App.css';

function SmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHorizontalStory = location.pathname.startsWith('/about');
    const isTouchDevice = navigator.maxTouchPoints > 0
      || window.matchMedia('(pointer: coarse)').matches;

    // Keep touch devices on native scrolling (especially iPad), but smooth
    // desktop wheel input so the horizontal story does not step between events.
    if (reducedMotion || (isHorizontalStory && isTouchDevice)) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      duration: isHorizontalStory ? 0.8 : 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    return () => lenis.destroy();
  }, [location.pathname]);

  return null;
}


function App() {
  return (
   <div>
    <Router>
      <SmoothScroll />
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' Component={Welcome} />
          <Route path='/about' Component={About} />
          <Route path='/archive' Component={Archive} />
        </Routes>
      </Suspense>
    </Router>
   </div>
  );
}

export default App;
