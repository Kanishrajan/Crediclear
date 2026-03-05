import { useEffect, useRef } from 'react';
import { MapPin, Lightbulb } from 'lucide-react';

// Risk Score Gauge
export function RiskGauge({ score, size = 200 }) {
    const level = score <= 30 ? 'Low Risk' : score <= 60 ? 'Moderate Risk' : 'High Risk';
    const color = score <= 30 ? '#22c55e' : score <= 60 ? '#f59e0b' : '#ef4444';

    const radius = size * 0.38;
    const cx = size / 2;
    const cy = size / 2;
    const strokeWidth = size * 0.08;
    const circumference = Math.PI * radius; // half circle
    const dashArray = circumference;
    const dashOffset = circumference - (score / 100) * circumference;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: size, height: size * 0.6 }}>
                <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
                    {/* Background arc */}
                    <path
                        d={`M ${strokeWidth / 2} ${size * 0.58} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size * 0.58}`}
                        fill="none"
                        stroke="rgba(0,0,0,0.08)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Score arc */}
                    <path
                        d={`M ${strokeWidth / 2} ${size * 0.58} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size * 0.58}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
                    />
                    {/* Zone markers */}
                    {['Low', 'Moderate', 'High'].map((zone, i) => {
                        const angle = -180 + i * 60 + 30;
                        const rad = (angle * Math.PI) / 180;
                        const x = cx + (radius - strokeWidth) * Math.cos(rad);
                        const y = cy + (radius - strokeWidth) * Math.sin(rad) * 0.9;
                        return null;
                    })}
                </svg>
                {/* Center text */}
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: size * 0.18, fontWeight: 800, color, fontFamily: 'Outfit', lineHeight: 1 }}>
                        {score}
                    </div>
                    <div style={{ fontSize: size * 0.07, color: '#94a3b8', fontWeight: 500 }}>/ 100</div>
                </div>
            </div>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '20px',
                background: `${color}22`,
                border: `1px solid ${color}55`,
                fontSize: '13px',
                fontWeight: 700,
                color,
            }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                {level}
            </div>
        </div>
    );
}

// Stat Card
export function StatCard({ icon, label, value, trend, color = '#6366f1', subtitle }) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '10px',
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                }}>
                    {typeof icon === 'string' ? icon : icon}
                </div>
                {trend !== undefined && (
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: trend >= 0 ? '#16a34a' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                    }}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a2e', fontFamily: 'Outfit' }}>{value}</div>
                <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>{label}</div>
                {subtitle && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{subtitle}</div>}
            </div>
        </div>
    );
}

// Risk Badge
export function RiskBadge({ level, score }) {
    const config = {
        Low: { bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.25)', color: '#16a34a' },
        Moderate: { bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.25)', color: '#d97706' },
        High: { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)', color: '#dc2626' },
    };
    const c = config[level] || config.Low;
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 10px',
            borderRadius: '20px',
            background: c.bg,
            border: `1px solid ${c.border}`,
            color: c.color,
            fontSize: '12px',
            fontWeight: 700,
        }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color, display: 'inline-block' }} />
            {level} Risk {score !== undefined && `(${score})`}
        </span>
    );
}

// Loading Spinner
export function LoadingSpinner({ text = 'Processing...' }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px' }}>
            <div style={{
                width: '48px', height: '48px',
                border: '3px solid rgba(99,102,241,0.2)',
                borderTop: '3px solid #6366f1',
                borderRadius: '50%',
                animation: 'spin-slow 0.8s linear infinite',
            }} />
            <p style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'Inter' }}>{text}</p>
        </div>
    );
}

// Clause Card
export function ClauseCard({ clause, index }) {
    const riskColors = {
        low: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', badge: '#22c55e' },
        moderate: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', badge: '#f59e0b' },
        high: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', badge: '#ef4444' },
    };
    const c = riskColors[clause.risk] || riskColors.low;

    return (
        <div
            className="animate-fade-in"
            style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: '10px',
                padding: '16px',
                animationDelay: `${index * 0.05}s`,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(99,102,241,0.1)',
                        color: '#6366f1',
                        letterSpacing: '0.5px',
                    }}>
                        {clause.type}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{clause.label}</span>
                </div>
                <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: `${c.badge}22`,
                    color: c.badge,
                    textTransform: 'uppercase',
                }}>
                    {clause.risk}
                </span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={13} color="#6366f1" style={{ marginTop: '2px', flexShrink: 0 }} />
                {clause.value}
            </div>
            <div style={{
                fontSize: '13px',
                color: '#334155',
                background: '#f8fafc',
                borderRadius: '6px',
                padding: '8px 12px',
                borderLeft: `3px solid ${c.badge}`,
                lineHeight: 1.5,
                display: 'flex', alignItems: 'flex-start', gap: '6px',
            }}>
                <Lightbulb size={13} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                {clause.explanation}
            </div>
            {clause.raw && (
                <details style={{ marginTop: '8px' }}>
                    <summary style={{ fontSize: '11px', color: '#64748b', cursor: 'pointer', userSelect: 'none' }}>
                        View original clause text
                    </summary>
                    <div style={{
                        marginTop: '6px',
                        fontSize: '12px',
                        color: '#64748b',
                        fontStyle: 'italic',
                        background: '#f8f9fa',
                        padding: '8px',
                        borderRadius: '6px',
                        lineHeight: 1.6,
                    }}>
                        "{clause.raw}"
                    </div>
                </details>
            )}
        </div>
    );
}

// Progress Bar
export function ProgressBar({ value, max = 100, color = '#6366f1', label, showValue = true }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div>
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
                    {showValue && <span style={{ fontSize: '13px', fontWeight: 600, color }}>{value}</span>}
                </div>
            )}
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                        transition: 'width 1s ease',
                    }}
                />
            </div>
        </div>
    );
}

// Empty State
export function EmptyState({ icon, title, description, action }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            textAlign: 'center',
            gap: '16px',
        }}>
            <div style={{ fontSize: '64px', filter: 'grayscale(0.3)' }}>{icon}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e', fontFamily: 'Outfit' }}>{title}</div>
            <div style={{ fontSize: '14px', color: '#64748b', maxWidth: '300px', lineHeight: 1.6 }}>{description}</div>
            {action}
        </div>
    );
}
