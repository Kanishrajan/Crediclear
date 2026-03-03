import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import DocumentAnalyzer from './pages/DocumentAnalyzer';
import EMISimulator from './pages/EMISimulator';
import LoanComparison from './pages/LoanComparison';
import AIChat from './pages/AIChat';
import useStore from './store/useStore';

const PAGE_MAP = {
  dashboard: Dashboard,
  analyzer: DocumentAnalyzer,
  simulator: EMISimulator,
  comparison: LoanComparison,
  chatbot: AIChat,
};

export default function App() {
  const { activePage, sidebarOpen } = useStore();
  const ActivePage = PAGE_MAP[activePage] || Dashboard;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      {/* Ambient background blobs */}
      <div style={{
        position: 'fixed',
        top: '-100px',
        left: '200px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-50px',
        right: '100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
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
          <ActivePage key={activePage} />
        </main>
      </div>
    </div>
  );
}
