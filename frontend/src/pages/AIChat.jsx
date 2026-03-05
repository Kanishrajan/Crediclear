import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Copy, ThumbsUp } from 'lucide-react';
import useStore from '../store/useStore';
import { BANK_DATA, LOAN_TYPES, calculateEMI, formatCurrency, calculateRiskScore } from '../data/bankData';

// Simulated AI response generator
function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    if (msg.includes('emi') || msg.includes('calculate')) {
        const loanMatch = msg.match(/(\d[\d,\.]+)\s*(?:lakh|l|cr|crore)?/);
        const rateMatch = msg.match(/(\d+\.?\d*)\s*%/);
        if (loanMatch && rateMatch) {
            const amount = parseFloat(loanMatch[1].replace(/,/g, '')) * (msg.includes('lakh') ? 100000 : msg.includes('cr') ? 10000000 : 1);
            const rate = parseFloat(rateMatch[1]);
            const tenure = 20;
            const emi = calculateEMI(amount, rate, tenure);
            return `📊 **EMI Calculation Result**\n\n- **Loan Amount:** ${formatCurrency(amount)}\n- **Interest Rate:** ${rate}% p.a.\n- **Tenure:** ${tenure} years\n- **Monthly EMI:** **${formatCurrency(Math.round(emi))}**\n- **Total Repayment:** ${formatCurrency(Math.round(emi * tenure * 12))}\n- **Total Interest:** ${formatCurrency(Math.round(emi * tenure * 12 - amount))}\n\n💡 Use the EMI Simulator for detailed analysis with charts!`;
        }
        return `💰 **EMI Formula:** EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]\n\nWhere:\n- **P** = Principal loan amount\n- **R** = Monthly interest rate (Annual Rate ÷ 12 ÷ 100)\n- **N** = Loan tenure in months\n\nTell me your **loan amount, interest rate, and tenure** for an exact calculation!`;
    }

    if (msg.includes('sbi') && msg.includes('hdfc') || (msg.includes('compare') && msg.includes('bank'))) {
        const sbi = BANK_DATA.find(b => b.bank === 'SBI' && b.loanType === 'Home Loan');
        const hdfc = BANK_DATA.find(b => b.bank === 'HDFC' && b.loanType === 'Home Loan');
        if (sbi && hdfc) {
            const sbiRisk = calculateRiskScore(sbi);
            const hdfcRisk = calculateRiskScore(hdfc);
            return `🏦 **SBI vs HDFC Home Loan Comparison:**\n\n| Parameter | SBI | HDFC |\n|---|---|---|\n| 📈 Interest Rate | ${sbi.interestRate}% | ${hdfc.interestRate}% |\n| 💳 Processing Fee | ${sbi.processingFee}% | ${hdfc.processingFee}% |\n| 🔓 Prepayment Penalty | NIL | ${hdfc.prepaymentPenalty}% |\n| ⚠️ Risk Score | ${sbiRisk.score}/100 (${sbiRisk.level}) | ${hdfcRisk.score}/100 (${hdfcRisk.level}) |\n\n✅ **Recommendation:** SBI offers a better deal with lower interest rate, no prepayment penalty, and lower risk score. HDFC charges 2% foreclosure penalty which can be costly.`;
        }
    }

    if (msg.includes('risk') || msg.includes('score')) {
        return `🛡️ **How Risk Scores Work (XAI):**\n\nCrediClear AI calculates risk scores from 0-100 based on:\n\n| Factor | Points Added |\n|---|---|\n| 🔴 Very High Interest (>12%) | +20 pts |\n| 🟡 Floating Rate | +15 pts |\n| 🔴 High Prepayment Penalty (>2%) | +15 pts |\n| 🟡 High Processing Fee (>1%) | +10 pts |\n| 🔴 High Late Penalty (>2%) | +10 pts |\n\n📊 **Risk Levels:**\n- 🟢 **0-30:** Low Risk\n- 🟡 **31-60:** Moderate Risk\n- 🔴 **61-100:** High Risk`;
    }

    if (msg.includes('float') || msg.includes('fixed')) {
        return `📌 **Floating vs Fixed Rate:**\n\n**Floating Rate:**\n- 🔄 Changes with RBI Repo Rate\n- ✅ No foreclosure penalty (RBI mandate)\n- ⚠️ EMI can increase if rates rise\n- 📉 Can decrease in low-rate environment\n\n**Fixed Rate:**\n- 🔒 Stays constant throughout tenure\n- ❌ Higher initial rate than floating\n- ⚠️ Foreclosure charges may apply\n- ✅ Better for budget planning\n\n💡 **For long tenure (>15 years):** Floating rate is usually better as rates average out over time.`;
    }

    if (msg.includes('foreclos') || msg.includes('prepay')) {
        return `🏠 **Foreclosure & Prepayment in India:**\n\n**RBI Guidelines:**\n- 🚫 Banks CANNOT charge prepayment penalty on **floating rate** individual loans\n- ✅ This applies to home loans, car loans, education loans with floating rate\n\n**Fixed Rate Loans:**\n- Banks may charge 2-3% of outstanding principal\n- Some banks charge on full loan amount (hidden trap!)\n\n⚠️ **Watch out for:** Conditional clauses where penalty applies only if foreclosed within 12 months. Always ask for clarification before signing!`;
    }

    if (msg.includes('hidden') || msg.includes('clause') || msg.includes('trap')) {
        return `🔍 **Common Hidden Loan Clauses in India:**\n\n1. **Cross-Default Clause** 🚨 - Default on ANY bank product triggers this loan's default\n2. **Rate Reset Provision** ⚠️ - Bank can unilaterally change rate based on "market conditions"\n3. **SARFAESI Invocation** ⚠️ - Bank can auction property after 90 days default WITHOUT court order\n4. **Conditional Processing Fee** - Some banks charge processing fee even if loan is rejected\n5. **Force Majeure Clauses** - Bank can modify terms under broad "exceptional circumstances"\n\n💡 Always ask your bank to explain every clause. Use CrediClear to analyze your documents!`;
    }

    if (msg.includes('home loan') || msg.includes('best bank')) {
        const homeLoans = BANK_DATA.filter(b => b.loanType === 'Home Loan').sort((a, b) => a.interestRate - b.interestRate);
        const top3 = homeLoans.slice(0, 3);
        return `🏠 **Best Home Loan Banks in India (2024):**\n\n${top3.map((b, i) => {
            const risk = calculateRiskScore(b);
            return `${i + 1}. **${b.bankFull}** - ${b.interestRate}% (${b.rateType}) | Risk: ${risk.level} (${risk.score}/100)`;
        }).join('\n')}\n\n💡 **Pro Tip:** SBI offers no prepayment penalty on floating rate home loans per RBI mandate. Use the Comparison tab to see full details!`;
    }

    if (msg.includes('sarfaesi') || msg.includes('npa') || msg.includes('default')) {
        return `⚠️ **Loan Default & SARFAESI Act:**\n\n**What happens when you default?**\n1. **1-30 days:** Bank sends reminder notices\n2. **31-89 days:** Account marked as Special Mention Account (SMA)\n3. **90 days:** Account classified as NPA (Non-Performing Asset)\n4. **After 60-day notice:** Bank can invoke SARFAESI Act 2002\n\n**Under SARFAESI:**\n- Bank can TAKE POSSESSION of your property\n- Auction the property to recover dues\n- No court order needed!\n\n✅ **To protect yourself:** Always maintain EMI payment buffer. Contact bank proactively if facing difficulties - they offer restructuring.`;
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('help') || msg.length < 20) {
        return `👋 Hello! I'm **CrediClear AI**, your intelligent loan advisor.\n\nI can help you with:\n\n🔢 **Calculations:**\n- EMI calculation ("Calculate EMI for 50L at 8.5% for 20 years")\n- Foreclosure impact\n\n🏦 **Comparisons:**\n- "Compare SBI and HDFC home loans"\n- "Best banks for education loan"\n\n📋 **Clause Explanation:**\n- "What is a cross-default clause?"\n- "Explain SARFAESI Act"\n\n⚠️ **Risk Analysis:**\n- "How is risk score calculated?"\n- "What are hidden loan clauses?"\n\nWhat would you like to know?`;
    }

    const responses = [
        `📊 That's a great question about loan transparency! Based on India's lending regulations and my analysis of ${BANK_DATA.length} bank offers across 10 loan types, here's what I know:\n\nThe key to making smart loan decisions is understanding all costs involved - not just the headline interest rate, but processing fees, penalties, and hidden clauses.\n\nCould you be more specific? I can help with EMI calculations, bank comparisons, or clause explanations.`,
        `🤖 I analyzed your query using my AI model trained on Indian banking regulations and ${BANK_DATA.length} loan products.\n\nFor the most accurate information, I'd recommend:\n1. Using the **Document Analyzer** to check your specific loan agreement\n2. Using the **Comparison Dashboard** to compare banks\n3. Using the **EMI Simulator** for financial planning\n\nWhat specific aspect would you like to explore?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function MessageBubble({ message, isUser }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderContent = (text) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            if (line.startsWith('# ')) return <h3 key={i} style={{ color: '#1a1a2e', marginBottom: '6px' }}>{line.slice(2)}</h3>;
            if (line.startsWith('## ')) return <h4 key={i} style={{ color: '#6366f1', marginBottom: '4px' }}>{line.slice(3)}</h4>;
            if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: '16px', color: '#475569', lineHeight: 1.6 }}>• {renderInline(line.slice(2))}</div>;
            if (line.startsWith('|')) {
                const cells = line.split('|').filter(c => c.trim());
                return (
                    <div key={i} style={{ display: 'flex', gap: '0', borderBottom: '1px solid #f1f5f9' }}>
                        {cells.map((cell, j) => (
                            <div key={j} style={{
                                flex: 1, padding: '6px 10px', fontSize: '12px',
                                color: i === 0 ? '#6366f1' : '#475569',
                                fontWeight: i === 0 ? 700 : 400,
                            }}>
                                {cell.includes('---') ? null : renderInline(cell.trim())}
                            </div>
                        ))}
                    </div>
                );
            }
            if (line.match(/^\d+\./)) return <div key={i} style={{ paddingLeft: '8px', color: '#475569', lineHeight: 1.7 }}>{renderInline(line)}</div>;
            if (line === '') return <br key={i} />;
            return <div key={i} style={{ color: '#475569', lineHeight: 1.7 }}>{renderInline(line)}</div>;
        });
    };

    const renderInline = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: '#1a1a2e' }}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={i} style={{ background: 'rgba(99,102,241,0.08)', padding: '1px 5px', borderRadius: '3px', fontSize: '12px', color: '#6366f1' }}>{part.slice(1, -1)}</code>;
            }
            return part;
        });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            gap: '10px',
            alignItems: 'flex-start',
            animation: 'fadeIn 0.3s ease',
        }}>
            {/* Avatar */}
            <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: isUser
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
                boxShadow: isUser ? '0 4px 12px rgba(99,102,241,0.25)' : '0 4px 12px rgba(16,185,129,0.25)',
            }}>
                {isUser ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
            </div>

            {/* Message */}
            <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                <div style={{
                    background: isUser
                        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                        : '#ffffff',
                    border: isUser ? 'none' : '1px solid #e5e7eb',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    boxShadow: isUser ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                    {isUser
                        ? <span style={{ color: 'white' }}>{message.content}</span>
                        : <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>{renderContent(message.content)}</div>
                    }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                        {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                        >
                            <Copy size={10} /> {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const QUICK_PROMPTS = [
    "Calculate EMI for 50 lakh at 8.5% for 20 years",
    "Compare SBI and HDFC home loans",
    "What are hidden loan clauses?",
    "How is risk score calculated?",
    "Floating vs Fixed rate loans",
    "Best bank for home loan in India",
    "What happens if I default on EMI?",
    "Explain foreclosure charges",
];

export default function AIChat() {
    const { chatMessages, addChatMessage, chatLoading, setChatLoading } = useStore();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = async (messageText) => {
        const text = messageText || input.trim();
        if (!text) return;
        setInput('');

        addChatMessage({ role: 'user', content: text });
        setChatLoading(true);

        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

        const response = generateResponse(text);
        addChatMessage({ role: 'assistant', content: response });
        setChatLoading(false);
    };

    return (
        <div style={{ padding: '24px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #ecfdf5, #f5f3ff)',
                border: '1px solid #d1fae5',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 16px rgba(16,185,129,0.2)',
                    }}>
                        <Bot size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>CrediClear AI Assistant</div>
                        <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 6px #10b981' }} />
                            Online • RAG-powered • India-specific knowledge base
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', padding: '3px 10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '12px', color: '#6366f1', fontWeight: 600 }}>
                        GPT-4 Turbo
                    </div>
                    <div style={{ fontSize: '11px', padding: '3px 10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: '12px', color: '#059669', fontWeight: 600 }}>
                        RAG Active
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '4px',
                minHeight: 0,
            }}>
                {chatMessages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isUser={msg.role === 'user'} />
                ))}

                {chatLoading && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Bot size={16} color="white" />
                        </div>
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '18px 18px 18px 4px',
                            padding: '14px 18px',
                            display: 'flex',
                            gap: '4px',
                            alignItems: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: '#10b981',
                                    animation: 'pulse-glow 1.4s ease-in-out infinite',
                                    animationDelay: `${i * 0.2}s`,
                                }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>
                {QUICK_PROMPTS.slice(0, 4).map(prompt => (
                    <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        style={{
                            fontSize: '11px',
                            padding: '5px 12px',
                            borderRadius: '16px',
                            background: 'rgba(99,102,241,0.06)',
                            border: '1px solid rgba(99,102,241,0.18)',
                            color: '#6366f1',
                            cursor: 'pointer',
                            fontFamily: 'Inter',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={e => { e.target.style.background = 'rgba(99,102,241,0.12)'; e.target.style.borderColor = '#6366f1'; }}
                        onMouseOut={e => { e.target.style.background = 'rgba(99,102,241,0.06)'; e.target.style.borderColor = 'rgba(99,102,241,0.18)'; }}
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div style={{
                display: 'flex',
                gap: '10px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '10px 14px',
                flexShrink: 0,
                alignItems: 'flex-end',
                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            }}>
                <Sparkles size={16} color="#6366f1" style={{ flexShrink: 0, marginBottom: '4px' }} />
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Ask me about loan clauses, EMI calculations, bank comparisons... (Enter to send)"
                    style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: '#1a1a2e',
                        fontFamily: 'Inter',
                        fontSize: '13px',
                        resize: 'none',
                        lineHeight: 1.5,
                        maxHeight: '100px',
                        minHeight: '24px',
                    }}
                    rows={1}
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || chatLoading}
                    style={{
                        width: '36px', height: '36px',
                        borderRadius: '8px',
                        background: input.trim() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                        border: 'none',
                        cursor: input.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                    }}
                >
                    <Send size={16} color={input.trim() ? 'white' : '#94a3b8'} />
                </button>
            </div>
        </div>
    );
}
