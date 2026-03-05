import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import DocumentAnalyzer from './pages/DocumentAnalyzer';
import EMISimulator from './pages/EMISimulator';
import LoanComparison from './pages/LoanComparison';
import AIChat from './pages/AIChat';
import useStore from './store/useStore';

export default function App() {
  const { sidebarOpen } = useStore();

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main Application Shell with Sidebar and TopBar */}
      <Route
        path="/app/*"
        element={
          <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
            {/* Ambient background blobs – subtle in light theme */}
            <div style={{
              position: 'fixed',
              top: '-80px',
              left: '200px',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0,
            }} />
            <div style={{
              position: 'fixed',
              bottom: '-40px',
              right: '100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div style={{
              marginLeft: sidebarOpen ? '260px' : '72px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              transition: 'margin-left 0.3s ease',
              position: 'relative',
              zIndex: 1,
            }}>
              <TopBar />
              <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="analyzer" element={<DocumentAnalyzer />} />
                  <Route path="simulator" element={<EMISimulator />} />
                  <Route path="comparison" element={<LoanComparison />} />
                  <Route path="chatbot" element={<AIChat />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        }
      />

      {/* Fallback to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
