import { useState } from 'react';
import {
    LayoutDashboard, FileText, Calculator, BarChart3, MessageSquare,
    ChevronLeft, ChevronRight, Shield, Bell, LogOut, Settings,
    TrendingUp, AlertTriangle, Menu, X
} from 'lucide-react';
import useStore from '../store/useStore';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Document Analyzer', icon: FileText },
    { id: 'simulator', label: 'EMI Simulator', icon: Calculator },
    { id: 'comparison', label: 'Loan Comparison', icon: BarChart3 },
    { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare },
];

export default function Sidebar() {
    const { activePage, setActivePage, sidebarOpen, toggleSidebar, user } = useStore();

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: sidebarOpen ? '260px' : '72px',
                    transition: 'width 0.3s ease',
                    background: 'linear-gradient(180deg, #0f1628 0%, #111827 100%)',
                    borderRight: '1px solid rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 30,
                    overflow: 'hidden',
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '20px 16px',
                    borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minHeight: '72px'
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
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                    }}>
                        <Shield size={22} color="white" />
                    </div>
                    {sidebarOpen && (
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9' }}>
                                CrediClear
                            </div>
                            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, letterSpacing: '0.5px' }}>
                                AI PLATFORM
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActivePage(id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: sidebarOpen ? '10px 12px' : '10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'all 0.2s',
                                fontFamily: 'Inter',
                                fontSize: '14px',
                                fontWeight: 500,
                                textAlign: 'left',
                                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                background: activePage === id
                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.1))'
                                    : 'transparent',
                                color: activePage === id ? '#818cf8' : '#94a3b8',
                                borderLeft: activePage === id ? '3px solid #6366f1' : '3px solid transparent',
                            }}
                        >
                            <Icon size={18} style={{ flexShrink: 0 }} />
                            {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                            {sidebarOpen && activePage === id && (
                                <div style={{
                                    marginLeft: 'auto',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#6366f1',
                                    boxShadow: '0 0 8px #6366f1',
                                }} />
                            )}
                        </button>
                    ))}

                    {/* Feature badges */}
                    {sidebarOpen && (
                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(99,102,241,0.08)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
                            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.5px' }}>ACTIVE FEATURES</div>
                            {[
                                { icon: '🤖', label: 'XAI Enabled' },
                                { icon: '🔒', label: '10 Loan Types' },
                                { icon: '🏦', label: 'India Banks' },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '14px' }}>{icon}</span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </nav>

                {/* User profile + collapse */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(99,102,241,0.15)' }}>
                    {sidebarOpen && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)',
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
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                                <div style={{ fontSize: '11px', color: '#6366f1' }}>{user.plan} Plan</div>
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
                            color: '#64748b',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </aside>
        </>
    );
}
