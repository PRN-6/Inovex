import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Events from './pages/Events'
import InovexSection from './components/InovexSection'
import Media from './pages/Media'
import Footer from './components/Footer'
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
          <Route path="/events" element={<Events />} />
          <Route path="/timeline" element={<InovexSection />} />
          <Route path="/media" element={<Media />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App