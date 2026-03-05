import { Bell, Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const PAGE_KEYS = {
    '/app/dashboard': 'dashboard',
    '/app/analyzer': 'analyzer',
    '/app/simulator': 'simulator',
    '/app/comparison': 'comparison',
    '/app/chatbot': 'chatbot',
};

export default function TopBar() {
    const { toggleSidebar } = useStore();
    const { t } = useLanguage();
    const location = useLocation();
    const pageKey = PAGE_KEYS[location.pathname] || 'dashboard';
    const page = t.topbar.pages[pageKey];

    return (
        <header style={{
            height: '64px',
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', display: 'flex', alignItems: 'center',
                        padding: '6px', borderRadius: '8px', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#6366f1'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', fontFamily: 'Outfit', margin: 0 }}>
                        {page.title}
                    </h1>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{page.subtitle}</p>
                </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Search */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f8f9fa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    transition: 'border-color 0.2s',
                }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                        placeholder={t.topbar.searchPlaceholder}
                        style={{
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            color: '#475569',
                            fontFamily: 'Inter',
                            fontSize: '13px',
                            width: '180px',
                        }}
                    />
                </div>

                {/* Language Switcher */}
                <LanguageSwitcher variant="light" />

                {/* Notifications */}
                <button style={{
                    position: 'relative',
                    background: '#f8f9fa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = '#6366f1'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                    <Bell size={16} />
                    <div style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '7px',
                        height: '7px',
                        background: '#ef4444',
                        borderRadius: '50%',
                        border: '1.5px solid #fff',
                    }} />
                </button>

                {/* XAI Active status badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: '20px',
                    padding: '5px 12px',
                }}>
                    <div style={{
                        width: '6px', height: '6px',
                        background: '#10b981', borderRadius: '50%',
                        boxShadow: '0 0 5px rgba(16,185,129,0.6)',
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#059669' }}>{t.topbar.xaiActive}</span>
                </div>
            </div>
        </header>
    );
}
