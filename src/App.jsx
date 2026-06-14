// React
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// static component
import { Navbar } from './components/Navbar'
import { Footer } from "./components/Footer";

// pages
import { Welcome } from './pages/Welcome';
import About from './pages/About';

// Source css
import './App.css';


function App() {
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
