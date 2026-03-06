import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Copy } from 'lucide-react';
import useStore from '../store/useStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const DOC_QUICK_PROMPTS = [
    "What is the interest rate?",
    "Are there any hidden charges?",
    "What happens if I miss a payment?",
    "Explain the collateral clause",
    "Can I prepay this loan?",
    "Give me a summary",
];

function renderInline(text) {
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
}

function renderContent(text) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        if (line.startsWith('# ')) return <h3 key={i} style={{ color: '#1a1a2e', marginBottom: '6px' }}>{line.slice(2)}</h3>;
        if (line.startsWith('## ')) return <h4 key={i} style={{ color: '#6366f1', marginBottom: '4px' }}>{line.slice(3)}</h4>;
        if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: '16px', color: '#475569', lineHeight: 1.6 }}>• {renderInline(line.slice(2))}</div>;
        if (line.match(/^\d+\./)) return <div key={i} style={{ paddingLeft: '8px', color: '#475569', lineHeight: 1.7 }}>{renderInline(line)}</div>;
        if (line === '') return <br key={i} />;
        return <div key={i} style={{ color: '#475569', lineHeight: 1.7 }}>{renderInline(line)}</div>;
    });
}

function DocChatMessage({ message, isUser }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            gap: '8px',
            alignItems: 'flex-start',
            animation: 'fadeIn 0.3s ease',
        }}>
            <div style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                background: isUser
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isUser ? '0 2px 8px rgba(99,102,241,0.25)' : '0 2px 8px rgba(16,185,129,0.25)',
            }}>
                {isUser ? <User size={13} color="white" /> : <Bot size={13} color="white" />}
            </div>
            <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '3px', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                <div style={{
                    background: isUser ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#ffffff',
                    border: isUser ? 'none' : '1px solid #e5e7eb',
                    borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    boxShadow: isUser ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                    {isUser
                        ? <span style={{ color: 'white' }}>{message.content}</span>
                        : <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>{renderContent(message.content)}</div>
                    }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                        {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}
                        >
                            <Copy size={9} /> {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DocumentChatPanel({ analysisResult }) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const {
        documentChatMessages,
        addDocumentChatMessage,
        documentChatLoading,
        setDocumentChatLoading,
        extractedDocumentText,
    } = useStore();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [documentChatMessages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = async (messageText) => {
        const text = messageText || input.trim();
        if (!text) return;
        setInput('');

        addDocumentChatMessage({ role: 'user', content: text });
        setDocumentChatLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/document-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: text }],
                    document_context: extractedDocumentText || '{}',
                    loan_type: analysisResult?.loanType || '',
                    bank: analysisResult?.bank || '',
                }),
            });
            const data = await res.json();
            addDocumentChatMessage({ role: 'assistant', content: data.content });
        } catch {
            // Fallback: generate a local response if API is unreachable
            addDocumentChatMessage({
                role: 'assistant',
                content: "I'm having trouble connecting to the server right now. Please make sure the backend is running and try again."
            });
        }
        setDocumentChatLoading(false);
    };

    if (!analysisResult) return null;

    return (
        <>
            {/* Floating chat button */}
            {!isOpen && (
                <button
                    id="document-chat-toggle"
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                        transition: 'all 0.3s ease',
                        zIndex: 1000,
                        animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.5)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
                    title="Ask about your document"
                >
                    <MessageSquare size={24} color="white" />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '400px',
                    height: '560px',
                    background: '#fafbfc',
                    borderRadius: '16px',
                    border: '1px solid #e0e7ff',
                    boxShadow: '0 8px 40px rgba(99,102,241,0.15), 0 2px 12px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease',
                    overflow: 'hidden',
                }}>
                    {/* Panel Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f5f3ff, #ecfdf5)',
                        borderBottom: '1px solid #e0e7ff',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 12px rgba(16,185,129,0.2)',
                            }}>
                                <Bot size={16} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>Document Q&A</div>
                                <div style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '5px', height: '5px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 6px #10b981' }} />
                                    {analysisResult.bank} • {analysisResult.loanType}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                width: '28px', height: '28px', borderRadius: '6px',
                                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                        >
                            <X size={14} color="#6366f1" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '12px',
                        minHeight: 0,
                    }}>
                        {documentChatMessages.map(msg => (
                            <DocChatMessage key={msg.id} message={msg} isUser={msg.role === 'user'} />
                        ))}

                        {documentChatLoading && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Bot size={13} color="white" />
                                </div>
                                <div style={{
                                    background: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '14px 14px 14px 4px',
                                    padding: '10px 14px',
                                    display: 'flex',
                                    gap: '4px',
                                    alignItems: 'center',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{
                                            width: '5px', height: '5px', borderRadius: '50%',
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
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                        padding: '6px 12px',
                        flexShrink: 0,
                        borderTop: '1px solid #f1f5f9',
                    }}>
                        {DOC_QUICK_PROMPTS.slice(0, 3).map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => handleSend(prompt)}
                                style={{
                                    fontSize: '10px',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
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
                        gap: '8px',
                        background: '#ffffff',
                        borderTop: '1px solid #e5e7eb',
                        padding: '10px 12px',
                        flexShrink: 0,
                        alignItems: 'flex-end',
                    }}>
                        <Sparkles size={14} color="#6366f1" style={{ flexShrink: 0, marginBottom: '4px' }} />
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
                            placeholder="Ask about your loan document..."
                            style={{
                                flex: 1,
                                background: 'none',
                                border: 'none',
                                outline: 'none',
                                color: '#1a1a2e',
                                fontFamily: 'Inter',
                                fontSize: '12px',
                                resize: 'none',
                                lineHeight: 1.5,
                                maxHeight: '60px',
                                minHeight: '20px',
                            }}
                            rows={1}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || documentChatLoading}
                            style={{
                                width: '32px', height: '32px',
                                borderRadius: '8px',
                                background: input.trim() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                                border: 'none',
                                cursor: input.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                                flexShrink: 0,
                            }}
                        >
                            <Send size={14} color={input.trim() ? 'white' : '#94a3b8'} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
