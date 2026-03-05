import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Calculator, BarChart3, MessageSquare,
    ChevronLeft, ChevronRight, Shield,
    Cpu, Lock, Building2
} from 'lucide-react';
import useStore from '../store/useStore';
import { useLanguage } from '../context/LanguageContext';

const NAV_IDS = [
    { id: 'dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
    { id: 'analyzer', icon: FileText, path: '/app/analyzer' },
    { id: 'simulator', icon: Calculator, path: '/app/simulator' },
    { id: 'comparison', icon: BarChart3, path: '/app/comparison' },
    { id: 'chatbot', icon: MessageSquare, path: '/app/chatbot' },
];

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar, user } = useStore();
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { ...NAV_IDS[0], label: t.sidebar.dashboard },
        { ...NAV_IDS[1], label: t.sidebar.analyzer },
        { ...NAV_IDS[2], label: t.sidebar.simulator },
        { ...NAV_IDS[3], label: t.sidebar.comparison },
        { ...NAV_IDS[4], label: t.sidebar.chatbot },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: sidebarOpen ? '260px' : '72px',
                    transition: 'width 0.3s ease',
                    background: '#ffffff',
                    borderRight: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 30,
                    overflow: 'hidden',
                    boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
                }}
            >
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    style={{
                        padding: '20px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        minHeight: '72px',
                        cursor: 'pointer',
                    }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #6366f1, #10b981)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                    }}>
                        <Shield size={22} color="white" />
                    </div>
                    {sidebarOpen && (
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'Outfit', color: '#1a1a2e' }}>
                                CrediClear
                            </div>
                            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, letterSpacing: '0.5px' }}>
                                AI PLATFORM
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
                    {navItems.map(({ id, label, icon: Icon, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={id}
                                to={path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: sidebarOpen ? '10px 12px' : '10px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: 'none',
                                    transition: 'all 0.2s',
                                    textDecoration: 'none',
                                    fontFamily: 'Inter',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textAlign: 'left',
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.06))'
                                        : 'transparent',
                                    color: isActive ? '#4f46e5' : '#64748b',
                                    borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                                }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <Icon size={18} style={{ flexShrink: 0 }} />
                                {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                                {sidebarOpen && isActive && (
                                    <div style={{
                                        marginLeft: 'auto',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#6366f1',
                                        boxShadow: '0 0 6px rgba(99,102,241,0.6)',
                                    }} />
                                )}
                            </Link>
                        );
                    })}

                    {/* Feature badges */}
                    {sidebarOpen && (
                        <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            background: '#f8faff',
                            borderRadius: '8px',
                            border: '1px solid #e0e7ff',
                        }}>
                            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.5px' }}>
                                ACTIVE FEATURES
                            </div>
                            {[
                                { icon: Cpu, label: 'XAI Enabled' },
                                { icon: Lock, label: '10 Loan Types' },
                                { icon: Building2, label: 'India Banks' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <Icon size={13} color="#6366f1" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </nav>

                {/* User profile + collapse */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid #f1f5f9' }}>
                    {sidebarOpen && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: '#f8f9fa',
                            border: '1px solid #e5e7eb',
                            marginBottom: '8px',
                        }}>
                            <div style={{
                                width: '34px', height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1, #10b981)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', fontWeight: 700, color: 'white', flexShrink: 0,
                            }}>
                                {user.name[0]}
                            </div>
                            <div style={{ overflow: 'hidden', flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 500 }}>{user.plan} Plan</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarOpen ? 'flex-end' : 'center',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#6366f1'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </aside>
        </>
    );
}
