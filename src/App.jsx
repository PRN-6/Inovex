import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Events from './pages/Events'
import InovexSection from './components/InovexSection'
import Media from './pages/Media'
import Team from './pages/Team'
import Footer from './components/Footer'
import About from './pages/About'
import './styles/globals.css'

/**
 * Main App Component
 * Includes scroll-based layout with modal event details.
 */
const App = () => {
  return (
    <Router>
      <div className="main-app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <Events />
              <InovexSection />
              <Media />
              <Footer />
            </>
          } />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App