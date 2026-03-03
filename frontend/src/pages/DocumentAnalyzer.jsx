import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertTriangle, Info, Zap, Brain, ShieldAlert, Lightbulb, CheckCircle2 } from 'lucide-react';
import { ClauseCard, RiskGauge, LoadingSpinner } from '../components/UI';
import useStore from '../store/useStore';
import { DEMO_DOCUMENTS, } from '../data/demoData';
import { DOCUMENT_TYPES, LOAN_TYPES } from '../data/bankData';

const CLAUSE_TYPES = [
    'INTEREST_RATE', 'TENURE', 'PENALTY', 'FEE', 'LOAN_AMOUNT',
    'COLLATERAL', 'DEFAULT', 'CONDITION', 'PREPAYMENT', 'LATE_PAYMENT'
];

function simulateAnalysis(fileName) {
    // For demo: pick home_loan_sbi or personal_loan_hdfc
    if (fileName && fileName.toLowerCase().includes('hdfc')) {
        return DEMO_DOCUMENTS['personal_loan_hdfc'];
    }
    return DEMO_DOCUMENTS['home_loan_sbi'];
}

export default function DocumentAnalyzer() {
    const { analysisResult, analysisLoading, setAnalysisResult, setAnalysisLoading, setUploadedDocument } = useStore();
    const [selectedDocType, setSelectedDocType] = useState('Loan Agreement');
    const [selectedLoanType, setSelectedLoanType] = useState('Home Loan');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [activeTab, setActiveTab] = useState('clauses');
    const [demoMode, setDemoMode] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFile(file);
            setUploadedDocument(file.name);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    const handleAnalyze = async () => {
        if (!uploadedFile && !demoMode) return;
        setAnalysisLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 2500));
        const result = simulateAnalysis(uploadedFile?.name || 'sbi_home.pdf');
        setAnalysisResult(result);
        setAnalysisLoading(false);
    };

    const handleDemoAnalyze = async (demoKey) => {
        setAnalysisLoading(true);
        setUploadedFile({ name: demoKey === 'personal_loan_hdfc' ? 'HDFC_Personal_Loan.pdf' : 'SBI_Home_Loan.pdf' });
        await new Promise(r => setTimeout(r, 2000));
        setAnalysisResult(DEMO_DOCUMENTS[demoKey]);
        setAnalysisLoading(false);
    };

    const highRiskClauses = analysisResult?.clauses?.filter(c => c.risk === 'high') || [];
    const moderateClauses = analysisResult?.clauses?.filter(c => c.risk === 'moderate') || [];

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08))',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Brain size={20} color="#6366f1" />
                        Smart Document Analyzer
                    </h2>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                        AI-powered clause extraction • NER-based entity detection • XAI risk explanation
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['home_loan_sbi', 'personal_loan_hdfc'].map(key => (
                        <button
                            key={key}
                            className="btn-secondary"
                            style={{ fontSize: '12px', padding: '6px 14px' }}
                            onClick={() => handleDemoAnalyze(key)}
                        >
                            <Zap size={12} />
                            {key === 'home_loan_sbi' ? 'Demo: SBI Home' : 'Demo: HDFC Personal'}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: analysisResult ? '1fr 2fr' : '1fr', gap: '24px' }}>
                {/* Upload Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Config */}
                    <div className="card">
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>Configuration</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Document Type</label>
                                <select
                                    className="input-field"
                                    value={selectedDocType}
                                    onChange={e => setSelectedDocType(e.target.value)}
                                >
                                    {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Loan Type</label>
                                <select
                                    className="input-field"
                                    value={selectedLoanType}
                                    onChange={e => setSelectedLoanType(e.target.value)}
                                >
                                    {LOAN_TYPES.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Upload */}
                    <div className="card">
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>Upload Document</h3>
                        <div
                            {...getRootProps()}
                            className={`upload-area ${isDragActive ? 'dragging' : ''}`}
                            style={{ padding: '30px 20px' }}
                        >
                            <input {...getInputProps()} />
                            {uploadedFile ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <CheckCircle size={40} color="#22c55e" />
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>{uploadedFile.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Ready to analyze</div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <Upload size={36} color="#6366f1" style={{ opacity: 0.7 }} />
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>
                                        {isDragActive ? 'Drop PDF here' : 'Upload Loan PDF'}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Drag & drop or click • PDF only • Max 20MB</div>
                                </div>
                            )}
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '12px', justifyContent: 'center', opacity: (!uploadedFile) ? 0.5 : 1 }}
                            onClick={handleAnalyze}
                            disabled={!uploadedFile || analysisLoading}
                        >
                            <Brain size={16} />
                            {analysisLoading ? 'Analyzing...' : 'Analyze with AI'}
                        </button>
                    </div>

                    {/* Supported types */}
                    <div className="card">
                        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>NLP ENTITIES DETECTED</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {CLAUSE_TYPES.map(type => (
                                <span key={type} style={{
                                    fontSize: '11px',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    background: 'rgba(99,102,241,0.1)',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    color: '#818cf8',
                                    fontWeight: 600,
                                }}>
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analysis Results */}
                {analysisLoading ? (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px' }}>
                            <div style={{
                                width: '64px', height: '64px',
                                border: '3px solid rgba(99,102,241,0.2)',
                                borderTop: '3px solid #6366f1',
                                borderRadius: '50%',
                                animation: 'spin-slow 0.8s linear infinite',
                            }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Outfit' }}>Analyzing Document</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                                    Extracting clauses • Running NER • Calculating risk score...
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {['PDF Parse', 'NER', 'XAI', 'Risk Score'].map((step, i) => (
                                    <div key={step} style={{
                                        fontSize: '11px',
                                        padding: '3px 10px',
                                        borderRadius: '12px',
                                        background: 'rgba(99,102,241,0.1)',
                                        border: '1px solid rgba(99,102,241,0.25)',
                                        color: '#6366f1',
                                        fontWeight: 600,
                                        animation: 'pulse-glow 1.5s ease-in-out infinite',
                                        animationDelay: `${i * 0.3}s`,
                                    }}>
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : analysisResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Summary Card */}
                        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <CheckCircle size={18} color="#22c55e" />
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>Analysis Complete</span>
                                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontWeight: 600 }}>
                                        {analysisResult.bank} • {analysisResult.loanType}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                                    {[
                                        { label: 'Loan Amount', value: `₹${(analysisResult.amount / 100000).toFixed(0)}L` },
                                        { label: 'Interest Rate', value: `${analysisResult.interestRate}% (${analysisResult.rateType})` },
                                        { label: 'Monthly EMI', value: `₹${analysisResult.emi?.toLocaleString()}` },
                                    ].map(item => (
                                        <div key={item.label} style={{ background: 'rgba(99,102,241,0.05)', borderRadius: '8px', padding: '10px' }}>
                                            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{item.label}</div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{item.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                                    <Info size={14} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#6366f1' }} />
                                    <strong style={{ color: '#f1f5f9' }}>AI Summary:</strong> {analysisResult.summary}
                                </div>

                                {/* Risk Summary */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                    <div style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <ShieldAlert size={11} /> {highRiskClauses.length} High Risk Clause{highRiskClauses.length !== 1 ? 's' : ''}
                                    </div>
                                    <div style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <AlertTriangle size={11} /> {moderateClauses.length} Moderate Risks
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>RISK SCORE</div>
                                <RiskGauge score={analysisResult.riskScore} size={160} />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="card" style={{ padding: 0 }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,102,241,0.15)', padding: '0 16px' }}>
                                {[
                                    { id: 'clauses', label: `Clauses (${analysisResult.clauses?.length || 0})` },
                                    { id: 'xai', label: 'XAI Explanation' },
                                    { id: 'raw', label: 'Raw Extraction' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            padding: '14px 16px',
                                            border: 'none',
                                            background: 'none',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: activeTab === tab.id ? '#818cf8' : '#64748b',
                                            borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                                            fontFamily: 'Inter',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                                {activeTab === 'clauses' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {analysisResult.clauses?.map((clause, i) => (
                                            <ClauseCard key={clause.id} clause={clause} index={i} />
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'xai' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{
                                            background: 'rgba(99,102,241,0.08)',
                                            border: '1px solid rgba(99,102,241,0.2)',
                                            borderRadius: '10px',
                                            padding: '16px',
                                        }}>
                                            <h4 style={{ color: '#818cf8', fontFamily: 'Outfit', fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Brain size={15} color="#818cf8" />
                                                Why Risk Score = {analysisResult.riskScore}/100?
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {analysisResult.clauses?.filter(c => c.risk !== 'low').map(clause => (
                                                    <div key={clause.id} style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '10px',
                                                        padding: '10px 12px',
                                                        background: 'rgba(0,0,0,0.2)',
                                                        borderRadius: '8px',
                                                        borderLeft: `3px solid ${clause.risk === 'high' ? '#ef4444' : '#f59e0b'}`,
                                                    }}>
                                                        <div style={{
                                                            width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                                                            background: clause.risk === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            {clause.risk === 'high'
                                                                ? <ShieldAlert size={14} color="#ef4444" />
                                                                : <AlertTriangle size={14} color="#f59e0b" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{clause.label}</div>
                                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{clause.explanation}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'rgba(16,185,129,0.08)',
                                            border: '1px solid rgba(16,185,129,0.2)',
                                            borderRadius: '10px',
                                            padding: '16px',
                                        }}>
                                            <h4 style={{ color: '#10b981', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Lightbulb size={14} color="#10b981" />
                                                AI Recommendation
                                            </h4>
                                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
                                                {analysisResult.riskScore > 60
                                                    ? 'This loan agreement has HIGH risk. We strongly recommend negotiating the foreclosure charges and review the cross-default clause carefully. Consider comparing with other lenders.'
                                                    : analysisResult.riskScore > 30
                                                        ? 'This is a MODERATE risk loan. The floating rate poses some uncertainty. Ensure you can handle rate increases of up to 2–3%. No major hidden clauses detected.'
                                                        : 'This appears to be a LOW risk loan agreement with transparent terms. No major hidden clauses detected. The floating rate is the only notable risk factor.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'raw' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {analysisResult.clauses?.map((clause) => (
                                            <div key={clause.id} style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                fontFamily: 'monospace',
                                                fontSize: '12px',
                                                color: '#94a3b8',
                                                lineHeight: 1.6,
                                            }}>
                                                <span style={{ color: '#6366f1' }}>// [{clause.type}] {clause.label}</span>
                                                <br />
                                                {clause.raw}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
