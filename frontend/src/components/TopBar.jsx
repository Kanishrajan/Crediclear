import { Bell, Search, Menu } from 'lucide-react';
import useStore from '../store/useStore';

const PAGE_TITLES = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your loan analysis' },
    analyzer: { title: 'Document Analyzer', subtitle: 'AI-powered PDF clause extraction' },
    simulator: { title: 'EMI Simulator', subtitle: 'Financial impact analysis' },
    comparison: { title: 'Loan Comparison', subtitle: 'State-wise bank comparison dashboard' },
    chatbot: { title: 'AI Assistant', subtitle: 'Intelligent loan guidance' },
};

export default function TopBar() {
    const { activePage, toggleSidebar } = useStore();
    const page = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

    return (
        <header style={{
            height: '64px',
            background: 'rgba(17, 24, 39, 0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(99,102,241,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
        }}>
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', display: 'flex', alignItems: 'center'
                    }}
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Outfit', margin: 0 }}>
                        {page.title}
                    </h1>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{page.subtitle}</p>
                </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Search */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(31,45,68,0.8)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                }}>
                    <Search size={14} color="#64748b" />
                    <input
                        placeholder="Search clauses, banks..."
                        style={{
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            color: '#94a3b8',
                            fontFamily: 'Inter',
                            fontSize: '13px',
                            width: '180px',
                        }}
                    />
                </div>

                {/* Notifications */}
                <button style={{
                    position: 'relative',
                    background: 'rgba(31,45,68,0.8)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Bell size={16} />
                    <div style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '7px',
                        height: '7px',
                        background: '#ef4444',
                        borderRadius: '50%',
                        border: '1px solid #0a0f1e',
                    }} />
                </button>

                {/* Status badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '20px',
                    padding: '5px 12px',
                }}>
                    <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 6px #10b981' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>XAI Active</span>
                </div>
            </div>
        </header>
    );
}
