import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Events from './pages/Events'
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
            </>
          } />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App