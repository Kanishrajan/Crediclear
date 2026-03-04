import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * LanguageSwitcher – A polished dropdown for switching between English, Tamil and Hindi.
 * Props:
 *   variant: 'dark' (default – for dashboard TopBar) | 'nav' (for LandingPage navbar)
 */
export default function LanguageSwitcher({ variant = 'dark' }) {
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

    const triggerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: isNav ? '7px 14px' : '6px 12px',
        background: isNav ? 'rgba(99,102,241,0.08)' : 'rgba(31,45,68,0.8)',
        border: `1px solid ${open ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.22)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        color: isNav ? '#94a3b8' : '#94a3b8',
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
        background: '#111827',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: '10px',
        minWidth: '160px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
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
          color: #94a3b8;
          transition: background 0.15s, color 0.15s;
        }
        .lang-option:hover {
          background: rgba(99,102,241,0.12);
          color: #f1f5f9;
        }
        .lang-option.active {
          background: rgba(99,102,241,0.18);
          color: #818cf8;
          font-weight: 600;
        }
        .lang-chevron {
          transition: transform 0.2s;
        }
        .lang-chevron.open {
          transform: rotate(180deg);
        }
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
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
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
                            color: '#475569',
                            textTransform: 'uppercase',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
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
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
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
