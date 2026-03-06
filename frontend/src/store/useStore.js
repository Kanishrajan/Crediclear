import { create } from 'zustand';

const useStore = create((set, get) => ({
    // Auth
    user: { name: 'Demo User', email: 'demo@crediclear.ai', plan: 'Pro' },

    // Auth
    user: { name: 'Demo User', email: 'demo@crediclear.ai', plan: 'Pro' },

    // Sidebar
    sidebarOpen: true,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

    // Document analysis
    uploadedDocument: null,
    analysisResult: null,
    analysisLoading: false,
    setUploadedDocument: (doc) => set({ uploadedDocument: doc }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    setAnalysisLoading: (loading) => set({ analysisLoading: loading }),

    // Loan simulator
    simulatorState: {
        loanAmount: 2500000,
        interestRate: 8.5,
        tenure: 20,
        loanType: 'Home Loan',
        monthlyIncome: 100000,
    },
    setSimulatorState: (updates) => set((s) => ({
        simulatorState: { ...s.simulatorState, ...updates }
    })),

    // Comparison
    selectedState: 'Tamil Nadu',
    selectedLoanType: 'Home Loan',
    selectedBanks: [],
    setSelectedState: (state) => set({ selectedState: state }),
    setSelectedLoanType: (type) => set({ selectedLoanType: type }),
    setSelectedBanks: (banks) => set({ selectedBanks: banks }),

    // Chatbot
    chatMessages: [
        {
            id: 1,
            role: 'assistant',
            content: "Hello! I'm **CrediClear AI**, your intelligent loan advisor. 🏦\n\nI can help you:\n- 📄 Understand loan clauses in plain language\n- 📊 Compare bank offers\n- 💰 Calculate EMI & financial impact\n- ⚠️ Identify hidden risks\n\nWhat would you like to explore today?",
            timestamp: new Date().toISOString()
        }
    ],
    chatLoading: false,
    addChatMessage: (msg) => set((s) => ({
        chatMessages: [...s.chatMessages, { ...msg, id: Date.now(), timestamp: new Date().toISOString() }]
    })),
    setChatLoading: (loading) => set({ chatLoading: loading }),

    // Document Chatbot (Analyzer page)
    documentChatMessages: [
        {
            id: 1,
            role: 'assistant',
            content: "👋 Hi! I've analyzed your loan document. Ask me anything about the clauses, interest rates, penalties, or hidden charges found in your agreement.\n\nTry asking:\n- \"What is the interest rate?\"\n- \"Are there any hidden charges?\"\n- \"What happens if I miss a payment?\"",
            timestamp: new Date().toISOString()
        }
    ],
    documentChatLoading: false,
    extractedDocumentText: null,
    addDocumentChatMessage: (msg) => set((s) => ({
        documentChatMessages: [...s.documentChatMessages, { ...msg, id: Date.now(), timestamp: new Date().toISOString() }]
    })),
    setDocumentChatLoading: (loading) => set({ documentChatLoading: loading }),
    setExtractedDocumentText: (text) => set({ extractedDocumentText: text }),
    clearDocumentChat: () => set({
        documentChatMessages: [
            {
                id: 1,
                role: 'assistant',
                content: "👋 Hi! I've analyzed your loan document. Ask me anything about the clauses, interest rates, penalties, or hidden charges found in your agreement.\n\nTry asking:\n- \"What is the interest rate?\"\n- \"Are there any hidden charges?\"\n- \"What happens if I miss a payment?\"",
                timestamp: new Date().toISOString()
            }
        ],
        extractedDocumentText: null,
    }),

    // Notifications
    notifications: [],
    addNotification: (notif) => set((s) => ({
        notifications: [...s.notifications, { ...notif, id: Date.now() }]
    })),
    removeNotification: (id) => set((s) => ({
        notifications: s.notifications.filter(n => n.id !== id)
    })),
}));

export default useStore;
