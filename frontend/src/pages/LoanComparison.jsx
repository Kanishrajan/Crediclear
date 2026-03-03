import { useState, useMemo } from 'react';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Filter, ArrowUpDown, Star, Shield, AlertTriangle } from 'lucide-react';
import { RiskGauge, RiskBadge, ProgressBar } from '../components/UI';
import useStore from '../store/useStore';
import { BANK_DATA, LOAN_TYPES, STATES, calculateRiskScore, calculateEMI, formatCurrency } from '../data/bankData';

const BANK_COLORS = {
    SBI: '#1e40af', HDFC: '#dc2626', ICICI: '#f97316',
    Axis: '#7c3aed', BOB: '#0891b2', PNB: '#065f46',
    Canara: '#1d4ed8', IDFC: '#0f766e'
};

export default function LoanComparison() {
    const { selectedState, selectedLoanType, setSelectedState, setSelectedLoanType } = useStore();
    const [sortBy, setSortBy] = useState('interestRate');
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [loanAmount, setLoanAmount] = useState(2500000);

    const filteredLoans = useMemo(() => {
        return BANK_DATA
            .filter(l =>
                l.loanType === selectedLoanType &&
                l.states.includes(selectedState)
            )
            .map(loan => ({
                ...loan,
                riskData: calculateRiskScore(loan),
                emi: Math.round(calculateEMI(loanAmount, loan.interestRate, loan.tenure)),
                totalRepayment: Math.round(calculateEMI(loanAmount, loan.interestRate, loan.tenure) * loan.tenure * 12),
            }))
            .sort((a, b) => {
                if (sortBy === 'interestRate') return a.interestRate - b.interestRate;
                if (sortBy === 'riskScore') return a.riskData.score - b.riskData.score;
                if (sortBy === 'emi') return a.emi - b.emi;
                return 0;
            });
    }, [selectedState, selectedLoanType, sortBy, loanAmount]);

    const toggleCompare = (loanId) => {
        setSelectedForCompare(prev =>
            prev.includes(loanId)
                ? prev.filter(id => id !== loanId)
                : prev.length < 4 ? [...prev, loanId] : prev
        );
    };

    const compareLoans = useMemo(() => {
        return filteredLoans.filter(l => selectedForCompare.includes(l.id));
    }, [filteredLoans, selectedForCompare]);

    const radarData = useMemo(() => {
        if (compareLoans.length < 2) return [];
        return [
            { subject: 'Interest', ...Object.fromEntries(compareLoans.map(l => [l.bank, (100 - (l.interestRate - 7) * 10)])) },
            { subject: 'Processing', ...Object.fromEntries(compareLoans.map(l => [l.bank, (100 - l.processingFee * 30)])) },
            { subject: 'Safety', ...Object.fromEntries(compareLoans.map(l => [l.bank, 100 - l.riskData.score])) },
            { subject: 'Penalty', ...Object.fromEntries(compareLoans.map(l => [l.bank, (100 - l.prepaymentPenalty * 20)])) },
            { subject: 'EMI Load', ...Object.fromEntries(compareLoans.map(l => [l.bank, (100 - (l.emi - filteredLoans[0]?.emi || 0) / 200)])) },
        ];
    }, [compareLoans, filteredLoans]);

    const emiCompareData = useMemo(() => {
        return compareLoans.length >= 2
            ? compareLoans.map(l => ({ bank: l.bank, EMI: l.emi, Interest: Math.round(l.totalRepayment - loanAmount) }))
            : filteredLoans.slice(0, 5).map(l => ({ bank: l.bank, EMI: l.emi, Interest: Math.round(l.totalRepayment - loanAmount) }));
    }, [compareLoans, filteredLoans, loanAmount]);

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(245,158,11,0.08))',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
            }}>
                <div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                        📊 Loan Comparison Dashboard
                    </h2>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                        State-wise bank comparison • Risk scoring • XAI-powered analysis
                    </p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Filter size={14} color="#6366f1" />
                        <select
                            className="input-field"
                            style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
                            value={selectedState}
                            onChange={e => setSelectedState(e.target.value)}
                        >
                            {STATES.map(s => <option key={s} value={s}>📍 {s}</option>)}
                        </select>
                    </div>
                    <select
                        className="input-field"
                        style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
                        value={selectedLoanType}
                        onChange={e => setSelectedLoanType(e.target.value)}
                    >
                        {LOAN_TYPES.map(t => <option key={t.id} value={t.name}>{t.icon} {t.name}</option>)}
                    </select>
                    <select
                        className="input-field"
                        style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                    >
                        <option value="interestRate">Sort: Interest Rate</option>
                        <option value="riskScore">Sort: Risk Score</option>
                        <option value="emi">Sort: EMI Amount</option>
                    </select>
                </div>
            </div>

            {/* Loan Amount Control */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', whiteSpace: 'nowrap' }}>Loan Amount:</span>
                <input
                    type="range"
                    min={100000}
                    max={50000000}
                    step={100000}
                    value={loanAmount}
                    onChange={e => setLoanAmount(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#6366f1' }}
                />
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#6366f1', whiteSpace: 'nowrap' }}>
                    {formatCurrency(loanAmount)}
                </span>
                <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {selectedForCompare.length > 0 ? `${selectedForCompare.length}/4 selected` : 'Select up to 4 to compare'}
                </div>
                {selectedForCompare.length > 0 && (
                    <button className="btn-secondary" style={{ fontSize: '12px', padding: '5px 10px', whiteSpace: 'nowrap' }} onClick={() => setSelectedForCompare([])}>
                        Clear
                    </button>
                )}
            </div>

            {/* Bank Cards Grid */}
            {filteredLoans.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏦</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9' }}>No offers found</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                        No banks offer {selectedLoanType} in {selectedState} yet.
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                    {filteredLoans.map((loan, idx) => {
                        const isSelected = selectedForCompare.includes(loan.id);
                        const isBest = idx === 0;
                        return (
                            <div
                                key={loan.id}
                                className="card animate-fade-in"
                                style={{
                                    border: isSelected
                                        ? '2px solid #6366f1'
                                        : isBest
                                            ? '1px solid rgba(34,197,94,0.4)'
                                            : '1px solid rgba(99,102,241,0.15)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    animationDelay: `${idx * 0.05}s`,
                                    transition: 'all 0.3s',
                                    transform: isSelected ? 'translateY(-2px)' : 'none',
                                    boxShadow: isSelected ? '0 8px 32px rgba(99,102,241,0.3)' : 'none',
                                }}
                                onClick={() => toggleCompare(loan.id)}
                            >
                                {isBest && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '16px',
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        padding: '3px 10px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}>
                                        <Star size={9} fill="white" /> BEST OFFER
                                    </div>
                                )}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        width: '20px', height: '20px',
                                        background: '#6366f1',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', color: 'white', fontWeight: 700,
                                    }}>
                                        ✓
                                    </div>
                                )}

                                {/* Bank Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '38px', height: '38px', borderRadius: '10px',
                                            background: `${BANK_COLORS[loan.bank] || '#6366f1'}22`,
                                            border: `1px solid ${BANK_COLORS[loan.bank] || '#6366f1'}44`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '10px', fontWeight: 800, color: BANK_COLORS[loan.bank] || '#6366f1',
                                        }}>
                                            {loan.logo}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{loan.bankFull}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{loan.loanType}</div>
                                        </div>
                                    </div>
                                    <RiskBadge level={loan.riskData.level} score={loan.riskData.score} />
                                </div>

                                {/* Main Metrics */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                                    {[
                                        { label: 'Interest Rate', value: `${loan.interestRate}%`, sub: loan.rateType, color: '#6366f1' },
                                        { label: 'Monthly EMI', value: formatCurrency(loan.emi), sub: `for ${formatCurrency(loanAmount)}`, color: '#10b981' },
                                        { label: 'Processing Fee', value: `${loan.processingFee}%`, sub: loan.processingFee > 1 ? '⚠️ High' : '✅ Low', color: loan.processingFee > 1 ? '#ef4444' : '#22c55e' },
                                        { label: 'Prepay Penalty', value: loan.prepaymentPenalty === 0 ? 'NIL' : `${loan.prepaymentPenalty}%`, sub: loan.prepaymentPenalty > 2 ? '⚠️ High' : '✅ OK', color: loan.prepaymentPenalty > 2 ? '#ef4444' : '#22c55e' },
                                    ].map(m => (
                                        <div key={m.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px' }}>
                                            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>{m.label}</div>
                                            <div style={{ fontSize: '15px', fontWeight: 800, color: m.color }}>{m.value}</div>
                                            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{m.sub}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Risk Score Bar */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Risk Score</span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: loan.riskData.color }}>{loan.riskData.score}/100</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div style={{
                                            width: `${loan.riskData.score}%`,
                                            height: '100%',
                                            borderRadius: '3px',
                                            background: `linear-gradient(90deg, ${loan.riskData.color}, ${loan.riskData.color}cc)`,
                                            transition: 'width 1s ease',
                                        }} />
                                    </div>
                                </div>

                                {/* Total Repayment */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '12px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                }}>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Total Repayment ({loan.tenure}yr)</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>{formatCurrency(loan.totalRepayment)}</span>
                                </div>

                                {/* XAI Risk Factors */}
                                {loan.riskData.factors.length > 0 && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {loan.riskData.factors.slice(0, 2).map((f, i) => (
                                            <span key={i} style={{
                                                fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                                                background: f.severity === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                                color: f.severity === 'high' ? '#ef4444' : '#f59e0b',
                                                border: `1px solid ${f.severity === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                                            }}>
                                                {f.label.slice(0, 30)}{f.label.length > 30 ? '...' : ''}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Comparison Charts */}
            {(compareLoans.length >= 2 || filteredLoans.length >= 2) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* EMI & Interest Comparison */}
                    <div className="card">
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: '15px', color: '#f1f5f9' }}>
                                {compareLoans.length >= 2 ? 'Selected Banks' : 'Top Banks'} – EMI vs Interest
                            </h3>
                            <p style={{ fontSize: '12px', color: '#64748b' }}>For {formatCurrency(loanAmount)} loan</p>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={emiCompareData} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="bank" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                                <Tooltip
                                    contentStyle={{ background: '#1a2236', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#f1f5f9' }}
                                    formatter={v => [`₹${v.toLocaleString()}`, '']}
                                />
                                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                                <Bar dataKey="EMI" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Interest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Radar Chart */}
                    {compareLoans.length >= 2 ? (
                        <div className="card">
                            <div style={{ marginBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'Outfit', fontSize: '15px', color: '#f1f5f9' }}>Multi-Dimension Comparison</h3>
                                <p style={{ fontSize: '12px', color: '#64748b' }}>Higher is better in each dimension</p>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} />
                                    {compareLoans.map((loan, i) => (
                                        <Radar
                                            key={loan.bank}
                                            name={loan.bank}
                                            dataKey={loan.bank}
                                            stroke={Object.values(BANK_COLORS)[i % Object.keys(BANK_COLORS).length]}
                                            fill={Object.values(BANK_COLORS)[i % Object.keys(BANK_COLORS).length]}
                                            fillOpacity={0.15}
                                            strokeWidth={2}
                                        />
                                    ))}
                                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#f1f5f9' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ fontSize: '40px' }}>📡</div>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', fontFamily: 'Outfit' }}>Select 2–4 banks</div>
                            <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center' }}>Click on bank cards above to compare them in a multi-dimension radar chart</div>
                        </div>
                    )}
                </div>
            )}

            {/* Comparison Table */}
            {compareLoans.length >= 2 && (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '15px', color: '#f1f5f9', marginBottom: '16px' }}>
                        📋 Detailed Comparison Table
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Parameter</th>
                                {compareLoans.map(l => (
                                    <th key={l.id} style={{ textAlign: 'center', padding: '10px 12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        {l.bank}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { key: 'interestRate', label: 'Interest Rate', format: v => `${v}%`, bestFn: arr => Math.min(...arr) },
                                { key: 'rateType', label: 'Rate Type', format: v => v, bestFn: null },
                                { key: 'emi', label: 'Monthly EMI', format: v => `₹${v.toLocaleString()}`, bestFn: arr => Math.min(...arr) },
                                { key: 'processingFee', label: 'Processing Fee', format: v => `${v}%`, bestFn: arr => Math.min(...arr) },
                                { key: 'prepaymentPenalty', label: 'Prepayment Penalty', format: v => v === 0 ? 'NIL' : `${v}%`, bestFn: arr => Math.min(...arr) },
                                { key: 'tenure', label: 'Max Tenure', format: v => `${v} yrs`, bestFn: arr => Math.max(...arr) },
                                { key: 'totalRepayment', label: 'Total Repayment', format: v => formatCurrency(v), bestFn: arr => Math.min(...arr) },
                            ].map(row => {
                                const values = compareLoans.map(l => l[row.key]);
                                const bestVal = row.bestFn ? row.bestFn(values.filter(v => typeof v === 'number')) : null;
                                return (
                                    <tr key={row.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.label}</td>
                                        {compareLoans.map(l => {
                                            const isBest = bestVal !== null && l[row.key] === bestVal;
                                            return (
                                                <td key={l.id} style={{
                                                    textAlign: 'center', padding: '10px 12px',
                                                    color: isBest ? '#22c55e' : '#f1f5f9',
                                                    fontWeight: isBest ? 700 : 400,
                                                    background: isBest ? 'rgba(34,197,94,0.05)' : 'transparent',
                                                }}>
                                                    {row.format(l[row.key])}
                                                    {isBest && <span style={{ marginLeft: '4px', fontSize: '10px' }}>✓</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
