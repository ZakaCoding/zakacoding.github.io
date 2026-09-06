// React
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useEffect } from 'react';
import Lenis from 'lenis';

// static component
import { Navbar } from './components/Navbar'
import { Footer } from "./components/Footer";

// pages
import { Welcome } from './pages/Welcome';
import About from './pages/About';

// Source css
import './App.css';


function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis();
    let animationFrame;

    const raf = (time) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(raf);
    };

    animationFrame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  return (
   <div>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' Component={Welcome} />
        <Route path='/about' Component={About} />
      </Routes>
      {/* <Footer /> */}
    </Router>
   </div>
  );
}

export default App;
