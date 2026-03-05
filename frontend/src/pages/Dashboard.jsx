import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, AlertTriangle, FileText, BarChart3, Shield, Zap, ArrowRight, Building2, BookOpen, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { StatCard, RiskBadge, RiskGauge } from '../components/UI';
import useStore from '../store/useStore';
import { BANK_DATA, calculateRiskScore, calculateEMI, formatCurrency } from '../data/bankData';

const emiTrendData = [
    { month: 'Jan', SBI: 43000, HDFC: 45000, ICICI: 44500 },
    { month: 'Feb', SBI: 43000, HDFC: 45000, ICICI: 44500 },
    { month: 'Mar', SBI: 44200, HDFC: 46100, ICICI: 45600 },
    { month: 'Apr', SBI: 44200, HDFC: 46100, ICICI: 45600 },
    { month: 'May', SBI: 43800, HDFC: 46100, ICICI: 46000 },
    { month: 'Jun', SBI: 43800, HDFC: 47200, ICICI: 46000 },
];

const riskDistData = [
    { name: 'Low Risk', value: 35, color: '#22c55e' },
    { name: 'Moderate', value: 45, color: '#f59e0b' },
    { name: 'High Risk', value: 20, color: '#ef4444' },
];

const loanTypeData = [
    { name: 'Home', count: 12 },
    { name: 'Education', count: 8 },
    { name: 'Car', count: 6 },
    { name: 'Personal', count: 15 },
    { name: 'Business', count: 5 },
    { name: 'Gold', count: 3 },
];

const recentAlerts = [
    { id: 1, bank: 'HDFC', type: 'Personal Loan', risk: 'High', issue: 'Cross-default clause detected', time: '2h ago' },
    { id: 2, bank: 'ICICI', type: 'Home Loan', risk: 'Moderate', issue: 'Floating rate with high spread', time: '5h ago' },
    { id: 3, bank: 'Axis', type: 'Car Loan', risk: 'Low', issue: 'No hidden clauses found', time: '1d ago' },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
    const navigate = useNavigate();

    const topDeals = BANK_DATA
        .filter(b => b.loanType === 'Home Loan')
        .sort((a, b) => a.interestRate - b.interestRate)
        .slice(0, 4)
        .map(loan => ({
            ...loan,
            riskData: calculateRiskScore(loan),
            emi: calculateEMI(5000000, loan.interestRate, loan.tenure),
        }));

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #f5f3ff 0%, #ecfdf5 100%)',
                border: '1px solid #e0e7ff',
                borderRadius: '16px',
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '180px', height: '180px',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
                        <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>AI SYSTEM ONLINE</span>
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: '#1a1a2e', margin: 0 }}>
                        Welcome to <span className="gradient-text">CrediClear AI</span>
                    </h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '6px 0 0' }}>
                        India's most advanced AI-powered loan transparency platform • 10 loan types • 8 banks • XAI enabled
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                    <button className="btn-primary" onClick={() => navigate('/app/analyzer')}>
                        <FileText size={16} /> Analyze Document
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/app/comparison')}>
                        <BarChart3 size={16} /> Compare Banks
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <StatCard icon={<Building2 size={20} color="#6366f1" />} label="Banks Tracked" value="8" trend={0} color="#6366f1" subtitle="India's top banks" />
                <StatCard icon={<BookOpen size={20} color="#10b981" />} label="Loan Types" value="10" trend={0} color="#10b981" subtitle="Fully supported" />
                <StatCard icon={<AlertTriangle size={20} color="#f59e0b" />} label="Avg Risk Score" value="42/100" color="#f59e0b" subtitle="Moderate risk level" />
                <StatCard icon={<Shield size={20} color="#22c55e" />} label="Clauses Analyzed" value="247" trend={12} color="#22c55e" subtitle="Across all documents" />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* EMI Trend */}
                <div className="card">
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ color: '#1a1a2e', fontFamily: 'Outfit', fontSize: '16px', marginBottom: '2px' }}>EMI Trend Comparison</h3>
                            <p style={{ fontSize: '12px', color: '#94a3b8' }}>₹50L Home Loan – Monthly EMI across banks</p>
                        </div>
                        <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, background: '#ede9fe', padding: '3px 10px', borderRadius: '12px' }}>
                            6 Months
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={emiTrendData}>
                            <defs>
                                <linearGradient id="sbiGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="hdfcGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="iciciGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                            <Tooltip
                                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1a1a2e', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                                formatter={(v) => [`₹${v.toLocaleString()}`, '']}
                            />
                            <Legend wrapperStyle={{ color: '#64748b', fontSize: 12 }} />
                            <Area type="monotone" dataKey="SBI" stroke="#6366f1" fill="url(#sbiGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="HDFC" stroke="#ef4444" fill="url(#hdfcGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="ICICI" stroke="#f97316" fill="url(#iciciGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Risk Distribution */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ color: '#1a1a2e', fontFamily: 'Outfit', fontSize: '16px', marginBottom: '2px' }}>Risk Distribution</h3>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>All tracked bank offers</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={riskDistData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                    {riskDistData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1a1a2e', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            {riskDistData.map((item) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color }} />
                                        <span style={{ fontSize: '13px', color: '#64748b' }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loan Type Bar + Top Deals */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Loan Types Bar Chart */}
                <div className="card">
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ color: '#1a1a2e', fontFamily: 'Outfit', fontSize: '16px' }}>Loan Types Distribution</h3>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Number of bank offers per type</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={loanTypeData} barSize={24}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1a1a2e', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
                            <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
                                {loanTypeData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Deals */}
                <div className="card">
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ color: '#1a1a2e', fontFamily: 'Outfit', fontSize: '16px' }}>Best Home Loan Deals</h3>
                            <p style={{ fontSize: '12px', color: '#94a3b8' }}>₹50L • Ranked by interest rate</p>
                        </div>
                        <button
                            className="btn-secondary"
                            style={{ padding: '5px 12px', fontSize: '12px' }}
                            onClick={() => navigate('/app/comparison')}
                        >
                            View All <ArrowRight size={12} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {topDeals.map((deal, i) => (
                            <div key={deal.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px',
                                background: i === 0 ? '#faf5ff' : '#fafafa',
                                borderRadius: '8px',
                                border: i === 0 ? '1px solid #e0d9ff' : '1px solid #f1f5f9',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        background: `${deal.color}15`,
                                        border: `1px solid ${deal.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '10px', fontWeight: 800, color: deal.color,
                                    }}>
                                        {deal.logo}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>{deal.bank} {deal.loanType}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>EMI: {formatCurrency(deal.emi)}/mo</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#6366f1' }}>{deal.interestRate}%</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{deal.rateType}</div>
                                    </div>
                                    <RiskBadge level={deal.riskData.level} score={deal.riskData.score} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="card">
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#1a1a2e', fontFamily: 'Outfit', fontSize: '16px' }}>
                        <AlertTriangle size={16} style={{ color: '#d97706', verticalAlign: 'middle', marginRight: '8px' }} />
                        Recent Risk Alerts
                    </h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Last 7 days</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recentAlerts.map((alert) => (
                        <div key={alert.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            background: '#fafafa',
                            borderRadius: '8px',
                            border: '1px solid #f1f5f9',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: alert.risk === 'High' ? 'rgba(220,38,38,0.08)' : alert.risk === 'Moderate' ? 'rgba(217,119,6,0.08)' : 'rgba(22,163,74,0.08)',
                                }}>
                                    {alert.risk === 'High'
                                        ? <ShieldAlert size={16} color="#dc2626" />
                                        : alert.risk === 'Moderate'
                                            ? <AlertTriangle size={16} color="#d97706" />
                                            : <CheckCircle2 size={16} color="#16a34a" />
                                    }
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>
                                        {alert.bank} • {alert.type}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{alert.issue}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RiskBadge level={alert.risk} />
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{alert.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
