import Home from './pages/Home'
import Timeline from './pages/Timeline'

/**
 * Main App Component
 * Simple wrapper for the cinematic Hero and Countdown experience.
 */
const App = () => {
  return (
    <div className="main-app-container">
      <Home />
      <Timeline />
    </div>
  )
}

export default App