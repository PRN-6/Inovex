import Home from './pages/Home'
import Navbar from './components/Navbar'
import Events from './pages/Events'

/**
 * Main App Component
 * Includes the sidebar navigation and main content area.
 */
const App = () => {
  return (
    <div className="main-app-container">
      <Navbar />
      <Home />
      <Events />
    </div>
  )
}

export default App