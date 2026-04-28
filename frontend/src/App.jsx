import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Events from './pages/Events'
import InovexSection from './components/InovexSection'
import Media from './pages/Media'
import Footer from './components/Footer'
import { NotificationProvider } from './context/NotificationContext'
import './styles/globals.css'

// Lazy load non-critical pages
const Team = lazy(() => import('./pages/Team'));
const About = lazy(() => import('./pages/About'));
const Register = lazy(() => import('./pages/Register'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Admin = lazy(() => import('./pages/Admin'));

const AppContent = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/inovex-terminal-2026' || location.pathname.startsWith('/event/');

  return (
    <div className="main-app-container">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <Events />
              <InovexSection />
              <Media />
            </>
          } />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/inovex-terminal-2026" element={<Admin />} />
        </Routes>
      </Suspense>
      {!hideFooter && <Footer />}
      <Analytics />
    </div>
  );
}

/**
 * Main App Component
 */
const App = () => {
  return (
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  )
}

export default App