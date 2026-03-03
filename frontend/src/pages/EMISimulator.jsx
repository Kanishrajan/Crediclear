import { useState, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { AlertTriangle, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import useStore from '../store/useStore';
import { LOAN_TYPES, calculateEMI, calculateTotalRepayment, formatCurrency } from '../data/bankData';

function calcEMI(P, annualRate, years) {
    const R = annualRate / (12 * 100);
    const N = years * 12;
    if (R === 0) return P / N;
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
}

export default function EMISimulator() {
    const { simulatorState, setSimulatorState } = useStore();
    const { loanAmount, interestRate, tenure, loanType, monthlyIncome } = simulatorState;
    const [showForeclosure, setShowForeclosure] = useState(false);
    const [foreclosureMonth, setForeclosureMonth] = useState(60);

    const P = Number(loanAmount);
    const R = Number(interestRate);
    const T = Number(tenure);
    const income = Number(monthlyIncome);

    const emi = useMemo(() => calcEMI(P, R, T), [P, R, T]);
    const totalRepayment = emi * T * 12;
    const totalInterest = totalRepayment - P;
    const incomeBurden = income > 0 ? (emi / income) * 100 : 0;

    // Rate simulation
    const rateSimData = useMemo(() => {
        return [-1, 0, 1, 2, 3].map(delta => ({
            rate: `${(R + delta).toFixed(1)}%`,
            emi: Math.round(calcEMI(P, R + delta, T)),
            totalInterest: Math.round(calcEMI(P, R + delta, T) * T * 12 - P),
        }));
    }, [P, R, T]);

    // Monthly amortization
    const amortizationData = useMemo(() => {
        const monthlyRate = R / (12 * 100);
        const months = T * 12;
        let balance = P;
        const data = [];
        for (let m = 1; m <= Math.min(months, 60); m++) {
            const interest = balance * monthlyRate;
            const principal = emi - interest;
            balance -= principal;
            if (m % 6 === 0 || m === 1) {
                data.push({
                    month: m,
                    principal: Math.round(Math.max(0, principal)),
                    interest: Math.round(interest),
                    balance: Math.round(Math.max(0, balance)),
                });
            }
        }
        return data;
    }, [P, R, T, emi]);

    const pieData = [
        { name: 'Principal', value: P, color: '#6366f1' },
        { name: 'Total Interest', value: Math.round(totalInterest), color: '#f59e0b' },
    ];

    const foreclosureData = useMemo(() => {
        const monthlyRate = R / (12 * 100);
        const months = T * 12;
        let balance = P;
        for (let m = 1; m <= Math.min(foreclosureMonth, months); m++) {
            const interest = balance * monthlyRate;
            const principal = emi - interest;
            balance -= principal;
        }
        const outstanding = Math.max(0, balance);
        const paidTillNow = emi * foreclosureMonth;
        const savings = emi * (months - foreclosureMonth) - outstanding;
        return { outstanding, paidTillNow, savings };
    }, [P, R, T, emi, foreclosureMonth]);

    const loanInfo = LOAN_TYPES.find(l => l.name === loanType);

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(99,102,241,0.08))',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '12px',
                padding: '20px 24px',
            }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                    💰 Financial Impact Simulator
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                    EMI Calculator • Interest Simulation • Foreclosure Analysis • Amortization Schedule
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>Loan Parameters</h3>

                        {/* Loan Type */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Loan Type</label>
                            <select
                                className="input-field"
                                value={loanType}
                                onChange={e => setSimulatorState({ loanType: e.target.value })}
                            >
                                {LOAN_TYPES.map(t => <option key={t.id} value={t.name}>{t.icon} {t.name}</option>)}
                            </select>
                        </div>

                        {/* Loan Amount */}
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Loan Amount</label>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1' }}>{formatCurrency(P)}</span>
                            </div>
                            <input
                                type="range"
                                min={100000}
                                max={50000000}
                                step={100000}
                                value={P}
                                onChange={e => setSimulatorState({ loanAmount: Number(e.target.value) })}
                                style={{ width: '100%', accentColor: '#6366f1' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>₹1L</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>₹5Cr</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Interest Rate</label>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>{R}% p.a.</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={20}
                                step={0.1}
                                value={R}
                                onChange={e => setSimulatorState({ interestRate: Number(e.target.value) })}
                                style={{ width: '100%', accentColor: '#f59e0b' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>5%</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>20%</span>
                            </div>
                        </div>

                        {/* Tenure */}
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Tenure</label>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{T} years</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={loanInfo?.typicalTenure || 30}
                                step={1}
                                value={T}
                                onChange={e => setSimulatorState({ tenure: Number(e.target.value) })}
                                style={{ width: '100%', accentColor: '#10b981' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>1yr</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{loanInfo?.typicalTenure || 30}yrs</span>
                            </div>
                        </div>

                        {/* Monthly Income */}
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Monthly Income</label>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#8b5cf6' }}>{formatCurrency(income)}</span>
                            </div>
                            <input
                                type="range"
                                min={20000}
                                max={1000000}
                                step={5000}
                                value={income}
                                onChange={e => setSimulatorState({ monthlyIncome: Number(e.target.value) })}
                                style={{ width: '100%', accentColor: '#8b5cf6' }}
                            />
                        </div>

                        {/* Income Burden Warning */}
                        {incomeBurden > 50 && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'flex-start',
                            }}>
                                <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>High EMI Burden Warning</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                                        EMI is {incomeBurden.toFixed(0)}% of income. RBI recommends &lt;50%.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Foreclosure */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Early Foreclosure</h3>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={showForeclosure}
                                    onChange={e => setShowForeclosure(e.target.checked)}
                                    style={{ accentColor: '#6366f1' }}
                                />
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Enable</span>
                            </label>
                        </div>
                        {showForeclosure && (
                            <>
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <label style={{ fontSize: '12px', color: '#94a3b8' }}>Foreclose after</label>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1' }}>{foreclosureMonth} months</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={6}
                                        max={T * 12 - 6}
                                        step={6}
                                        value={foreclosureMonth}
                                        onChange={e => setForeclosureMonth(Number(e.target.value))}
                                        style={{ width: '100%', accentColor: '#6366f1' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        { label: 'Outstanding Balance', value: formatCurrency(Math.round(foreclosureData.outstanding)), color: '#ef4444' },
                                        { label: 'Total Paid', value: formatCurrency(Math.round(foreclosureData.paidTillNow)), color: '#6366f1' },
                                        { label: 'Interest Saved', value: formatCurrency(Math.round(foreclosureData.savings)), color: '#22c55e' },
                                    ].map(item => (
                                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.label}</span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Output */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Key Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'Monthly EMI', value: formatCurrency(Math.round(emi)), sub: 'Per month', color: '#6366f1', icon: '📅' },
                            { label: 'Total Repayment', value: formatCurrency(Math.round(totalRepayment)), sub: `Over ${T} years`, color: '#f59e0b', icon: '💰' },
                            { label: 'Total Interest', value: formatCurrency(Math.round(totalInterest)), sub: `${((totalInterest / P) * 100).toFixed(0)}% of principal`, color: '#ef4444', icon: '📈' },
                            { label: 'Income Burden', value: `${incomeBurden.toFixed(1)}%`, sub: incomeBurden > 50 ? '⚠️ High' : '✅ Safe', color: incomeBurden > 50 ? '#ef4444' : '#22c55e', icon: '🏦' },
                        ].map((metric) => (
                            <div key={metric.label} className="card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{metric.icon}</div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: metric.color, fontFamily: 'Outfit' }}>{metric.value}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{metric.label}</div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{metric.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Rate Simulation Chart */}
                    <div className="card">
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: '15px', color: '#f1f5f9' }}>Interest Rate Impact Simulation</h3>
                            <p style={{ fontSize: '12px', color: '#64748b' }}>How EMI changes with rate variations of ±1-3%</p>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={rateSimData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="rate" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                                <Tooltip
                                    contentStyle={{ background: '#1a2236', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#f1f5f9' }}
                                    formatter={(v, name) => [`₹${v.toLocaleString()}`, name === 'emi' ? 'Monthly EMI' : 'Total Interest']}
                                />
                                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                                <ReferenceLine y={Math.round(emi)} stroke="#6366f1" strokeDasharray="4 4" label={{ value: 'Current', fill: '#6366f1', fontSize: 11 }} />
                                <Bar dataKey="emi" name="Monthly EMI" fill="#6366f1" radius={[4, 4, 0, 0]}>
                                    {rateSimData.map((entry, i) => (
                                        <Cell key={i} fill={entry.rate === `${R.toFixed(1)}%` ? '#6366f1' : i > 2 ? `rgba(239,68,68,${0.5 + i * 0.1})` : `rgba(34,197,94,${0.5 + (2 - i) * 0.1})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Amortization + Pie */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Amortization */}
                        <div className="card">
                            <div style={{ marginBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'Outfit', fontSize: '15px', color: '#f1f5f9' }}>Amortization Schedule</h3>
                                <p style={{ fontSize: '12px', color: '#64748b' }}>Principal vs Interest over time (first 5 years)</p>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={amortizationData} barSize={10}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `M${v}`} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                                    <Tooltip
                                        contentStyle={{ background: '#1a2236', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#f1f5f9' }}
                                        formatter={(v) => [`₹${v.toLocaleString()}`, '']}
                                    />
                                    <Bar dataKey="principal" name="Principal" stackId="a" fill="#6366f1" />
                                    <Bar dataKey="interest" name="Interest" stackId="a" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Cost Breakdown Pie */}
                        <div className="card">
                            <div style={{ marginBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'Outfit', fontSize: '15px', color: '#f1f5f9' }}>Cost Breakdown</h3>
                                <p style={{ fontSize: '12px', color: '#64748b' }}>Principal vs Total Interest paid</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                                            {pieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: '#1a2236', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#f1f5f9' }}
                                            formatter={(v) => [`₹${v.toLocaleString()}`, '']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                {pieData.map(item => (
                                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color }} />
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.name}</span>
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{formatCurrency(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
