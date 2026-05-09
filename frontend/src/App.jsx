import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Events from './pages/Events'
import InovexSection from './components/InovexSection'
import Media from './pages/Media'
import Footer from './components/Footer'
import GlobalMaintenance from './components/GlobalMaintenance'
import { NotificationProvider } from './context/NotificationContext'
import './styles/globals.css'

// Lazy load non-critical pages
const Team = lazy(() => import('./pages/Team'));
const About = lazy(() => import('./pages/About'));
const Register = lazy(() => import('./pages/Register'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Admin = lazy(() => import('./pages/Admin'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));

const AppContent = () => {
  const location = useLocation();
  const [isMaintenance, setIsMaintenance] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  const hideFooter = location.pathname === '/inovex-terminal-2026' || location.pathname.startsWith('/event/');
  const isBackendDisabled = import.meta.env.VITE_DISABLE_BACKEND === 'true';
  const isMediaEnabled = import.meta.env.VITE_ENABLE_MEDIA === 'true';
  const isTeamEnabled = import.meta.env.VITE_ENABLE_TEAM === 'true';
  const API_URL = import.meta.env.VITE_API_URL || 'https://inovex-backend01.onrender.com';

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/status`);
        const data = await res.json();
        setIsMaintenance(data.maintenance);
      } catch (err) {
        console.error('Failed to fetch status:', err);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
    
    // Periodically check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [API_URL]);

  if (isChecking) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // If maintenance is on, and we are NOT on the admin page, show maintenance screen
  if (isMaintenance && location.pathname !== '/inovex-terminal-2026') {
    return <GlobalMaintenance />;
  }

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
              {isMediaEnabled && <Media />}
            </>
          } />
          {isTeamEnabled ? (
            <Route path="/team" element={<Team />} />
          ) : (
            <Route path="/team" element={<Navigate to="/" replace />} />
          )}
          <Route path="/about" element={<About />} />
          {!isBackendDisabled ? (
            <Route path="/register" element={<Register />} />
          ) : (
            <Route path="/register" element={<Navigate to="/" replace />} />
          )}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
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