import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * LanguageSwitcher – A polished dropdown for switching between English, Tamil and Hindi.
 * Props:
 *   variant: 'light' (dashboard TopBar) | 'nav' (LandingPage navbar) | 'dark' (legacy)
 */
export default function LanguageSwitcher({ variant = 'light' }) {
    const { lang, setLang, LANGUAGES } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isNav = variant === 'nav';
    const isDark = variant === 'dark';

    const triggerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: isNav ? '7px 14px' : '6px 12px',
        background: isDark
            ? 'rgba(31,45,68,0.8)'
            : isNav
                ? 'rgba(99,102,241,0.08)'
                : '#f8f9fa',
        border: `1px solid ${open
            ? '#c7d2fe'
            : isDark
                ? 'rgba(99,102,241,0.22)'
                : '#e5e7eb'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        userSelect: 'none',
    };

    const dropdownStyle = {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        minWidth: '160px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        zIndex: 9999,
        overflow: 'hidden',
        animation: 'langDropIn 0.18s ease forwards',
    };

    return (
        <>
            <style>{`
        @keyframes langDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lang-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 13px;
          font-family: Inter, sans-serif;
          color: #475569;
          transition: background 0.15s, color 0.15s;
        }
        .lang-option:hover {
          background: #f1f5ff;
          color: #4f46e5;
        }
        .lang-option.active {
          background: #ede9fe;
          color: #4f46e5;
          font-weight: 600;
        }
        .lang-chevron { transition: transform 0.2s; }
        .lang-chevron.open { transform: rotate(180deg); }
      `}</style>

            <div ref={ref} style={{ position: 'relative' }}>
                <button
                    onClick={() => setOpen((v) => !v)}
                    style={triggerStyle}
                    aria-label="Select language"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    {/* Globe icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span>{current.label}</span>
                    <svg
                        width="11" height="11"
                        viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5"
                        className={`lang-chevron${open ? ' open' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {open && (
                    <div style={dropdownStyle} role="listbox">
                        {/* Header row */}
                        <div style={{
                            padding: '8px 16px 6px',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            borderBottom: '1px solid #f1f5f9',
                        }}>
                            Language
                        </div>

                        {LANGUAGES.map((l) => (
                            <div
                                key={l.code}
                                role="option"
                                aria-selected={l.code === lang}
                                className={`lang-option${l.code === lang ? ' active' : ''}`}
                                onClick={() => { setLang(l.code); setOpen(false); }}
                            >
                                <span style={{ fontSize: '16px' }}>{l.flag}</span>
                                <span>{l.label}</span>
                                {l.code === lang && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
