import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

/* ─── Animated Canvas Particle Grid ─────────────────────────────────────── */
function ParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }

        const mouse = { x: -9999, y: -9999 };
        const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        window.addEventListener('mousemove', onMouseMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Mouse interaction
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(129, 140, 248, ${0.3 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Draw particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}

/* ─── 3D Tilt Card ──────────────────────────────────────────────────────── */
function TiltCard({ children, style }) {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;
        cardRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transition: 'transform 0.15s ease',
                transformStyle: 'preserve-3d',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/* ─── Animated Counter ──────────────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '', prefix = '' }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                let start = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { setVal(target); clearInterval(timer); }
                    else setVal(Math.floor(start));
                }, 16);
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);

    return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─── 3D Floating Dashboard Preview ────────────────────────────────────── */
function DashboardPreview() {
    return (
        <div style={{
            perspective: '1200px',
            width: '100%',
            maxWidth: '700px',
            margin: '0 auto',
        }}>
            <div style={{
                transform: 'rotateX(8deg) rotateY(-4deg)',
                transformStyle: 'preserve-3d',
                animation: 'floatPreview 5s ease-in-out infinite',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.25)',
                border: '1px solid rgba(99,102,241,0.25)',
            }}>
                {/* Mock Dashboard Header */}
                <div style={{ background: '#111827', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                            <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                        ))}
                    </div>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(99,102,241,0.15)', borderRadius: '3px' }} />
                    <div style={{ width: '60px', height: '6px', background: 'rgba(99,102,241,0.3)', borderRadius: '3px' }} />
                </div>

                {/* Mock Dashboard Body */}
                <div style={{ background: '#0d1117', display: 'flex', minHeight: '340px' }}>
                    {/* Sidebar */}
                    <div style={{ width: '56px', background: '#0f1628', borderRight: '1px solid rgba(99,102,241,0.1)', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#10b981)' }} />
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ width: '22px', height: '22px', borderRadius: '5px', background: i === 1 ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)' }} />
                        ))}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Stat cards row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                            {[
                                { color: '#6366f1', val: '8' },
                                { color: '#10b981', val: '10' },
                                { color: '#f59e0b', val: '42' },
                                { color: '#22c55e', val: '247' },
                            ].map((s, i) => (
                                <div key={i} style={{ background: '#1a2236', borderRadius: '8px', padding: '10px', border: `1px solid ${s.color}22` }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${s.color}22`, marginBottom: '6px' }} />
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: s.color, fontFamily: 'Outfit' }}>{s.val}</div>
                                    <div style={{ width: '60%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '4px' }} />
                                </div>
                            ))}
                        </div>

                        {/* Chart row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', flex: 1 }}>
                            <div style={{ background: '#1a2236', borderRadius: '8px', padding: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                                <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', marginBottom: '12px' }} />
                                {/* Simulated bar chart */}
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
                                    {[60, 85, 45, 90, 70, 55, 80].map((h, i) => (
                                        <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', background: `linear-gradient(180deg, ${i % 2 === 0 ? '#6366f1' : '#10b981'}, transparent)`, opacity: 0.7 }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: '#1a2236', borderRadius: '8px', padding: '12px', border: '1px solid rgba(99,102,241,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px' }} />
                                {/* Donut-like rings */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '8px solid #22c55e', borderTopColor: '#f59e0b', borderRightColor: '#ef4444', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {[['#22c55e', 'Low'], ['#f59e0b', 'Moderate'], ['#ef4444', 'High']].map(([c, l]) => (
                                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: c }} />
                                            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Table row */}
                        <div style={{ background: '#1a2236', borderRadius: '8px', padding: '10px', border: '1px solid rgba(99,102,241,0.1)' }}>
                            {[1, 2, 3].map(r => (
                                <div key={r} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: r < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                    <div style={{ width: '50px', height: '5px', background: 'rgba(99,102,241,0.3)', borderRadius: '3px' }} />
                                    <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }} />
                                    <div style={{ width: '30px', height: '5px', background: r === 1 ? 'rgba(34,197,94,0.4)' : r === 2 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)', borderRadius: '3px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Landing Page ─────────────────────────────────────────────────── */
export default function LandingPage() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const goToDashboard = () => navigate('/app/dashboard');

    const features = [
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            title: 'Smart Document Analysis',
            desc: 'Upload loan agreements in PDF format. Our NLP engine extracts clauses, identifies risk entities, and explains every term in plain language.',
            color: '#6366f1',
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
            title: 'Financial Impact Simulator',
            desc: 'Calculate exact EMIs, simulate interest rate changes, and model early foreclosure scenarios with real-time interactive charts.',
            color: '#10b981',
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
                </svg>
            ),
            title: 'Bank Offer Comparison',
            desc: 'Compare up to four banks simultaneously across 10 loan types and 5 Indian states with structured risk scoring and radar analysis.',
            color: '#f59e0b',
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: 'AI-Powered Advisor',
            desc: 'Ask questions in natural language. Our AI explains hidden clauses, compares offers, and gives personalized financial guidance in real time.',
            color: '#8b5cf6',
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            title: 'Explainable Risk Scoring',
            desc: 'Every risk score from 0 to 100 is fully explainable. See exactly which clause contributed to the score and why, with XAI transparency.',
            color: '#ef4444',
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            ),
            title: 'India-Specific Intelligence',
            desc: 'Built specifically for Indian borrowers. Covers RBI regulations, SARFAESI implications, EBLR-linked rates, and state-specific bank offers.',
            color: '#06b6d4',
        },
    ];

    const stats = [
        { value: 8, suffix: '', label: 'Banks Covered', sub: 'All major Indian lenders' },
        { value: 10, suffix: '', label: 'Loan Types', sub: 'Home, Education, MSME & more' },
        { value: 36, suffix: '+', label: 'Loan Products', sub: 'Across 5 Indian states' },
        { value: 100, suffix: '', label: 'XAI Risk Score', sub: 'Fully explainable scoring' },
    ];

    const steps = [
        { num: '01', title: 'Upload Your Document', desc: 'Drag and drop any loan agreement, sanction letter, or offer document in PDF format.' },
        { num: '02', title: 'AI Extracts Clauses', desc: 'Our NLP engine identifies interest rates, penalties, hidden conditions, and risk entities.' },
        { num: '03', title: 'Get Your Risk Score', desc: 'Receive a fully explained risk score with clause-level attribution and AI recommendations.' },
        { num: '04', title: 'Compare and Decide', desc: 'Use the comparison dashboard to evaluate multiple bank offers and make an informed decision.' },
    ];

    return (
        <div style={{ background: '#070b14', color: '#f1f5f9', fontFamily: 'Inter, sans-serif', position: 'relative', overflowX: 'hidden' }}>
            <style>{`
        @keyframes floatPreview {
          0%, 100% { transform: rotateX(8deg) rotateY(-4deg) translateY(0px); }
          50% { transform: rotateX(6deg) rotateY(-2deg) translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.1; }
        }
        .landing-btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border: none;
          padding: 14px 36px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: Inter, sans-serif;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.2px;
        }
        .landing-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(99,102,241,0.45);
        }
        .landing-btn-ghost {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(99,102,241,0.3);
          padding: 14px 36px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: Inter, sans-serif;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .landing-btn-ghost:hover {
          border-color: #6366f1;
          color: #f1f5f9;
          background: rgba(99,102,241,0.08);
        }
        .feature-card {
          background: rgba(17,24,39,0.6);
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 14px;
          padding: 28px;
          transition: all 0.3s;
          backdrop-filter: blur(8px);
        }
        .feature-card:hover {
          border-color: rgba(99,102,241,0.35);
          background: rgba(26,34,54,0.8);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 12px;
        }
        .nav-link {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
          background: none;
          border: none;
          font-family: Inter, sans-serif;
        }
        .nav-link:hover { color: #f1f5f9; }
        .step-line {
          position: absolute;
          left: 19px;
          top: 44px;
          bottom: -20px;
          width: 1px;
          background: linear-gradient(180deg, rgba(99,102,241,0.4), transparent);
        }
      `}</style>

            <ParticleCanvas />

            {/* ── Ambient blobs ─────────────────────────────────────────────── */}
            <div style={{ position: 'fixed', top: '-150px', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-100px', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

            {/* ── Navbar ────────────────────────────────────────────────────── */}
            <nav style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                zIndex: 100,
                padding: '0 48px',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: scrolled ? 'rgba(7,11,20,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(99,102,241,0.12)' : 'none',
                transition: 'all 0.4s',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: 'linear-gradient(135deg, #6366f1, #10b981)',
                        borderRadius: '9px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <div>
                        <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9' }}>CrediClear</span>
                        <span style={{ fontSize: '10px', color: '#6366f1', fontWeight: 700, letterSpacing: '1px', display: 'block', lineHeight: 1, marginTop: '1px' }}>AI PLATFORM</span>
                    </div>
                </div>

                {/* Nav links */}
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    {['Features', 'How It Works', 'Statistics'].map(link => (
                        <button key={link} className="nav-link" onClick={() => {
                            document.getElementById(link.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            {link}
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <button className="landing-btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={goToDashboard}>
                    Get Started
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </nav>

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '120px 48px 80px',
                position: 'relative',
                zIndex: 1,
                maxWidth: '1280px',
                margin: '0 auto',
                gap: '60px',
            }}>
                {/* Left Content */}
                <div style={{ flex: '0 0 auto', maxWidth: '540px', animation: 'fadeUp 0.8s ease forwards' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        marginBottom: '28px',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.5px' }}>
                            Explainable AI for Indian Loan Markets
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: 'clamp(38px, 4.5vw, 58px)',
                        fontWeight: 900,
                        fontFamily: 'Outfit, sans-serif',
                        lineHeight: 1.08,
                        letterSpacing: '-1.5px',
                        marginBottom: '20px',
                        color: '#f1f5f9',
                    }}>
                        Make Loan Decisions<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 40%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            With Full Clarity
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p style={{
                        fontSize: '17px',
                        color: '#64748b',
                        lineHeight: 1.75,
                        marginBottom: '36px',
                        fontWeight: 400,
                    }}>
                        CrediClear AI analyzes your loan documents, extracts every clause, scores hidden risks, and provides bank-by-bank comparisons — all powered by Explainable Artificial Intelligence.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        <button className="landing-btn-primary" onClick={goToDashboard}>
                            Get Started — It's Free
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                        <button className="landing-btn-ghost" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                            </svg>
                            See How It Works
                        </button>
                    </div>

                    {/* Trust indicators */}
                    <div style={{ display: 'flex', gap: '24px', marginTop: '44px', alignItems: 'center' }}>
                        {[
                            { label: '8 Banks', sub: 'Tracked' },
                            { label: '10 Loan Types', sub: 'Supported' },
                            { label: 'XAI', sub: 'Powered' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{item.label}</span>
                                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{item.sub}</span>
                            </div>
                        )).reduce((acc, el, i) => {
                            if (i > 0) acc.push(<div key={`d${i}`} style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' }} />);
                            acc.push(el);
                            return acc;
                        }, [])}
                    </div>
                </div>

                {/* Right — 3D Dashboard Preview */}
                <div style={{ flex: 1, minWidth: 0, animation: 'fadeUp 0.8s 0.2s ease both' }}>
                    <DashboardPreview />
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────────────────── */}
            <section id="features" style={{ padding: '100px 48px', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <div className="section-label">Core Capabilities</div>
                        <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.8px', color: '#f1f5f9', marginBottom: '14px' }}>
                            Everything You Need to Evaluate a Loan
                        </h2>
                        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                            A complete intelligence layer between you and your lender — built for Indian borrowers.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {features.map((f, i) => (
                            <TiltCard key={i}>
                                <div className="feature-card" style={{ height: '100%' }}>
                                    <div style={{
                                        width: '44px', height: '44px',
                                        borderRadius: '10px',
                                        background: `${f.color}18`,
                                        border: `1px solid ${f.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: f.color,
                                        marginBottom: '18px',
                                    }}>
                                        {f.icon}
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px', fontFamily: 'Outfit' }}>{f.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Statistics ────────────────────────────────────────────────── */}
            <section id="statistics" style={{ padding: '80px 48px', position: 'relative', zIndex: 1 }}>
                <div style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.05) 100%)',
                    border: '1px solid rgba(99,102,241,0.18)',
                    borderRadius: '20px',
                    padding: '56px 64px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4,1fr)',
                    gap: '0',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background rings */}
                    <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '300px', height: '300px', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '50%', animation: 'pulseRing 4s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '50%', animation: 'pulseRing 4s ease-in-out infinite 1s' }} />

                    {stats.map((s, i) => (
                        <div key={i} style={{
                            textAlign: 'center',
                            padding: '0 24px',
                            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        }}>
                            <div style={{ fontSize: '44px', fontWeight: 900, fontFamily: 'Outfit', color: '#f1f5f9', lineHeight: 1, marginBottom: '8px' }}>
                                <AnimatedNumber target={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>{s.label}</div>
                            <div style={{ fontSize: '12px', color: '#475569' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ──────────────────────────────────────────────── */}
            <section id="how-it-works" style={{ padding: '80px 48px 100px', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <div className="section-label">Process</div>
                        <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.8px', color: '#f1f5f9', marginBottom: '12px' }}>
                            From Document to Decision in Minutes
                        </h2>
                        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>
                            A transparent, four-step workflow powered by AI.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '28px', position: 'relative', paddingBottom: i < steps.length - 1 ? '40px' : '0' }}>
                                {/* Number + line */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.1))',
                                        border: '1px solid rgba(99,102,241,0.35)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', fontWeight: 800, color: '#6366f1',
                                        fontFamily: 'Outfit',
                                        flexShrink: 0,
                                    }}>
                                        {i + 1}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div style={{ width: '1px', flex: 1, marginTop: '8px', background: 'linear-gradient(180deg, rgba(99,102,241,0.3), transparent)' }} />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ paddingTop: '8px', flex: 1 }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', letterSpacing: '1.5px', marginBottom: '6px' }}>
                                        STEP {step.num}
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Outfit', marginBottom: '8px' }}>{step.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ────────────────────────────────────────────────── */}
            <section style={{ padding: '60px 48px 100px', position: 'relative', zIndex: 1 }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.08) 100%)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '24px',
                    padding: '72px 48px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                    <div className="section-label" style={{ marginBottom: '16px' }}>Start Now</div>
                    <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.8px', color: '#f1f5f9', marginBottom: '16px' }}>
                        Stop Signing Loans You Don't Fully Understand
                    </h2>
                    <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
                        CrediClear gives you the same analytical power that banks use — now in your hands, for free.
                    </p>
                    <button className="landing-btn-primary" style={{ fontSize: '15px', padding: '15px 40px' }} onClick={goToDashboard}>
                        Open Dashboard
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <footer style={{
                borderTop: '1px solid rgba(99,102,241,0.1)',
                padding: '32px 48px',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                background: 'rgba(7,11,20,0.8)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#10b981)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Outfit' }}>CrediClear AI</span>
                </div>
                <div style={{ display: 'flex', gap: '28px' }}>
                    {['Features', 'How It Works', 'Statistics'].map(link => (
                        <button key={link} className="nav-link" style={{ fontSize: '13px' }}>{link}</button>
                    ))}
                </div>
                <div style={{ fontSize: '13px', color: '#475569' }}>
                    Built for Indian borrowers · 2025
                </div>
            </footer>
        </div>
    );
}
