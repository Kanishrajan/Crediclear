// India-specific bank loan test data

export const BANK_DATA = [
    // Home Loans
    { id: 1, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Home Loan', interestRate: 8.4, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Floating', minAmount: 300000, maxAmount: 75000000, tenure: 30, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 2, bank: 'HDFC', bankFull: 'HDFC Bank', loanType: 'Home Loan', interestRate: 8.8, processingFee: 1.0, prepaymentPenalty: 2.0, latePenalty: 2.5, rateType: 'Floating', minAmount: 500000, maxAmount: 100000000, tenure: 30, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'HDFC', color: '#dc2626' },
    { id: 3, bank: 'ICICI', bankFull: 'ICICI Bank', loanType: 'Home Loan', interestRate: 8.75, processingFee: 0.75, prepaymentPenalty: 2.0, latePenalty: 2.0, rateType: 'Floating', minAmount: 500000, maxAmount: 100000000, tenure: 30, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi'], logo: 'ICICI', color: '#f97316' },
    { id: 4, bank: 'Axis', bankFull: 'Axis Bank', loanType: 'Home Loan', interestRate: 9.0, processingFee: 1.0, prepaymentPenalty: 2.5, latePenalty: 2.5, rateType: 'Fixed', minAmount: 300000, maxAmount: 50000000, tenure: 25, states: ['Maharashtra', 'Delhi', 'Karnataka'], logo: 'AXIS', color: '#7c3aed' },
    { id: 5, bank: 'BOB', bankFull: 'Bank of Baroda', loanType: 'Home Loan', interestRate: 8.6, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 1.5, rateType: 'Floating', minAmount: 300000, maxAmount: 60000000, tenure: 30, states: ['Tamil Nadu', 'Maharashtra', 'Delhi'], logo: 'BOB', color: '#0891b2' },
    { id: 6, bank: 'PNB', bankFull: 'Punjab National Bank', loanType: 'Home Loan', interestRate: 8.65, processingFee: 0.35, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Floating', minAmount: 100000, maxAmount: 50000000, tenure: 30, states: ['Delhi', 'Karnataka', 'Kerala'], logo: 'PNB', color: '#065f46' },
    { id: 7, bank: 'Canara', bankFull: 'Canara Bank', loanType: 'Home Loan', interestRate: 8.7, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 1.5, rateType: 'Floating', minAmount: 200000, maxAmount: 40000000, tenure: 30, states: ['Karnataka', 'Tamil Nadu', 'Kerala'], logo: 'CAN', color: '#1d4ed8' },
    { id: 8, bank: 'IDFC', bankFull: 'IDFC First Bank', loanType: 'Home Loan', interestRate: 8.85, processingFee: 0.5, prepaymentPenalty: 3.0, latePenalty: 3.0, rateType: 'Floating', minAmount: 500000, maxAmount: 75000000, tenure: 30, states: ['Maharashtra', 'Karnataka', 'Delhi'], logo: 'IDFC', color: '#0f766e' },

    // Education Loans
    { id: 9, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Education Loan', interestRate: 8.15, processingFee: 0, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Floating', minAmount: 100000, maxAmount: 1500000, tenure: 15, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 10, bank: 'HDFC', bankFull: 'HDFC Bank', loanType: 'Education Loan', interestRate: 10.0, processingFee: 1.0, prepaymentPenalty: 1.0, latePenalty: 2.0, rateType: 'Fixed', minAmount: 200000, maxAmount: 1500000, tenure: 15, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'HDFC', color: '#dc2626' },
    { id: 11, bank: 'ICICI', bankFull: 'ICICI Bank', loanType: 'Education Loan', interestRate: 10.5, processingFee: 1.5, prepaymentPenalty: 1.0, latePenalty: 2.5, rateType: 'Fixed', minAmount: 100000, maxAmount: 2000000, tenure: 15, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi'], logo: 'ICICI', color: '#f97316' },
    { id: 12, bank: 'Axis', bankFull: 'Axis Bank', loanType: 'Education Loan', interestRate: 13.7, processingFee: 2.0, prepaymentPenalty: 2.0, latePenalty: 2.5, rateType: 'Fixed', minAmount: 50000, maxAmount: 2000000, tenure: 15, states: ['Maharashtra', 'Delhi'], logo: 'AXIS', color: '#7c3aed' },
    { id: 13, bank: 'BOB', bankFull: 'Bank of Baroda', loanType: 'Education Loan', interestRate: 9.15, processingFee: 0, prepaymentPenalty: 0, latePenalty: 1.5, rateType: 'Floating', minAmount: 100000, maxAmount: 1500000, tenure: 15, states: ['Tamil Nadu', 'Maharashtra', 'Delhi'], logo: 'BOB', color: '#0891b2' },

    // Car Loans
    { id: 14, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Car Loan', interestRate: 8.75, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Fixed', minAmount: 100000, maxAmount: 15000000, tenure: 7, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 15, bank: 'HDFC', bankFull: 'HDFC Bank', loanType: 'Car Loan', interestRate: 8.5, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Fixed', minAmount: 100000, maxAmount: 25000000, tenure: 7, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'HDFC', color: '#dc2626' },
    { id: 16, bank: 'ICICI', bankFull: 'ICICI Bank', loanType: 'Car Loan', interestRate: 8.8, processingFee: 1.0, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Fixed', minAmount: 100000, maxAmount: 20000000, tenure: 7, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi'], logo: 'ICICI', color: '#f97316' },

    // Personal Loans
    { id: 17, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Personal Loan', interestRate: 11.15, processingFee: 1.0, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Fixed', minAmount: 25000, maxAmount: 2000000, tenure: 6, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 18, bank: 'HDFC', bankFull: 'HDFC Bank', loanType: 'Personal Loan', interestRate: 10.5, processingFee: 2.5, prepaymentPenalty: 2.5, latePenalty: 2.5, rateType: 'Fixed', minAmount: 50000, maxAmount: 4000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'HDFC', color: '#dc2626' },
    { id: 19, bank: 'ICICI', bankFull: 'ICICI Bank', loanType: 'Personal Loan', interestRate: 10.75, processingFee: 2.25, prepaymentPenalty: 3.0, latePenalty: 2.5, rateType: 'Fixed', minAmount: 50000, maxAmount: 5000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi'], logo: 'ICICI', color: '#f97316' },
    { id: 20, bank: 'Axis', bankFull: 'Axis Bank', loanType: 'Personal Loan', interestRate: 10.49, processingFee: 2.0, prepaymentPenalty: 2.0, latePenalty: 2.5, rateType: 'Fixed', minAmount: 50000, maxAmount: 4000000, tenure: 5, states: ['Maharashtra', 'Delhi', 'Karnataka'], logo: 'AXIS', color: '#7c3aed' },

    // Business Loans
    { id: 21, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Business Loan', interestRate: 11.15, processingFee: 1.0, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Floating', minAmount: 100000, maxAmount: 50000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 22, bank: 'HDFC', bankFull: 'HDFC Bank', loanType: 'Business Loan', interestRate: 15.0, processingFee: 2.0, prepaymentPenalty: 3.0, latePenalty: 3.0, rateType: 'Fixed', minAmount: 500000, maxAmount: 40000000, tenure: 5, states: ['Maharashtra', 'Delhi', 'Karnataka'], logo: 'HDFC', color: '#dc2626' },
    { id: 23, bank: 'ICICI', bankFull: 'ICICI Bank', loanType: 'Business Loan', interestRate: 14.49, processingFee: 2.0, prepaymentPenalty: 2.5, latePenalty: 3.0, rateType: 'Fixed', minAmount: 100000, maxAmount: 20000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra'], logo: 'ICICI', color: '#f97316' },

    // Gold Loans
    { id: 24, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Gold Loan', interestRate: 7.5, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 1.5, rateType: 'Fixed', minAmount: 20000, maxAmount: 5000000, tenure: 3, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 25, bank: 'HDFC', bankFull: 'HDFC Bank', loanType: 'Gold Loan', interestRate: 9.9, processingFee: 1.0, prepaymentPenalty: 1.0, latePenalty: 2.0, rateType: 'Fixed', minAmount: 25000, maxAmount: 3000000, tenure: 2, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'HDFC', color: '#dc2626' },
    { id: 26, bank: 'Canara', bankFull: 'Canara Bank', loanType: 'Gold Loan', interestRate: 7.65, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 1.5, rateType: 'Fixed', minAmount: 10000, maxAmount: 2000000, tenure: 3, states: ['Karnataka', 'Tamil Nadu', 'Kerala'], logo: 'CAN', color: '#1d4ed8' },

    // Agricultural Loans
    { id: 27, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Agricultural Loan', interestRate: 7.0, processingFee: 0, prepaymentPenalty: 0, latePenalty: 0, rateType: 'Fixed', minAmount: 10000, maxAmount: 10000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 28, bank: 'BOB', bankFull: 'Bank of Baroda', loanType: 'Agricultural Loan', interestRate: 7.0, processingFee: 0, prepaymentPenalty: 0, latePenalty: 0, rateType: 'Fixed', minAmount: 10000, maxAmount: 5000000, tenure: 5, states: ['Tamil Nadu', 'Maharashtra', 'Delhi'], logo: 'BOB', color: '#0891b2' },
    { id: 29, bank: 'PNB', bankFull: 'Punjab National Bank', loanType: 'Agricultural Loan', interestRate: 7.0, processingFee: 0, prepaymentPenalty: 0, latePenalty: 0, rateType: 'Floating', minAmount: 10000, maxAmount: 8000000, tenure: 5, states: ['Delhi', 'Karnataka', 'Kerala'], logo: 'PNB', color: '#065f46' },

    // MSME Loans
    { id: 30, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'MSME Loan', interestRate: 8.0, processingFee: 0.5, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Floating', minAmount: 100000, maxAmount: 50000000, tenure: 7, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 31, bank: 'IDFC', bankFull: 'IDFC First Bank', loanType: 'MSME Loan', interestRate: 14.0, processingFee: 2.0, prepaymentPenalty: 3.0, latePenalty: 3.0, rateType: 'Fixed', minAmount: 500000, maxAmount: 20000000, tenure: 5, states: ['Maharashtra', 'Karnataka', 'Delhi'], logo: 'IDFC', color: '#0f766e' },

    // Startup Loans
    { id: 32, bank: 'SBI', bankFull: 'State Bank of India', loanType: 'Startup Loan', interestRate: 8.5, processingFee: 1.0, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Floating', minAmount: 500000, maxAmount: 25000000, tenure: 7, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'SBI', color: '#1e40af' },
    { id: 33, bank: 'ICICI', bankFull: 'ICICI Bank', loanType: 'Startup Loan', interestRate: 14.0, processingFee: 2.0, prepaymentPenalty: 2.0, latePenalty: 3.0, rateType: 'Fixed', minAmount: 1000000, maxAmount: 50000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra'], logo: 'ICICI', color: '#f97316' },

    // Medical Emergency Loans
    { id: 34, bank: 'HDFC', bankFull: 'HDFC Bank', loanType: 'Medical Emergency Loan', interestRate: 10.5, processingFee: 1.5, prepaymentPenalty: 0, latePenalty: 2.5, rateType: 'Fixed', minAmount: 25000, maxAmount: 5000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'], logo: 'HDFC', color: '#dc2626' },
    { id: 35, bank: 'ICICI', bankFull: 'ICICI Bank', loanType: 'Medical Emergency Loan', interestRate: 10.75, processingFee: 1.0, prepaymentPenalty: 0, latePenalty: 2.0, rateType: 'Fixed', minAmount: 20000, maxAmount: 3000000, tenure: 5, states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi'], logo: 'ICICI', color: '#f97316' },
    { id: 36, bank: 'Axis', bankFull: 'Axis Bank', loanType: 'Medical Emergency Loan', interestRate: 15.0, processingFee: 2.0, prepaymentPenalty: 2.5, latePenalty: 2.5, rateType: 'Fixed', minAmount: 25000, maxAmount: 1500000, tenure: 3, states: ['Maharashtra', 'Delhi', 'Karnataka'], logo: 'AXIS', color: '#7c3aed' },
];

export const LOAN_TYPES = [
    { id: 'home', name: 'Home Loan', icon: '🏠', description: 'For purchasing residential property', maxLTV: 75, typicalTenure: 30 },
    { id: 'education', name: 'Education Loan', icon: '🎓', description: 'For higher education in India/abroad', maxLTV: 100, typicalTenure: 15 },
    { id: 'car', name: 'Car Loan', icon: '🚗', description: 'For new or used vehicle purchase', maxLTV: 85, typicalTenure: 7 },
    { id: 'personal', name: 'Personal Loan', icon: '💳', description: 'Unsecured loan for any purpose', maxLTV: 100, typicalTenure: 5 },
    { id: 'business', name: 'Business Loan', icon: '🏢', description: 'For business expansion & operations', maxLTV: 80, typicalTenure: 5 },
    { id: 'gold', name: 'Gold Loan', icon: '🥇', description: 'Loan against gold collateral', maxLTV: 75, typicalTenure: 3 },
    { id: 'agricultural', name: 'Agricultural Loan', icon: '🌾', description: 'For farming & agricultural needs', maxLTV: 100, typicalTenure: 5 },
    { id: 'msme', name: 'MSME Loan', icon: '🏭', description: 'For micro, small & medium enterprises', maxLTV: 80, typicalTenure: 7 },
    { id: 'startup', name: 'Startup Loan', icon: '🚀', description: 'For new business ventures', maxLTV: 90, typicalTenure: 7 },
    { id: 'medical', name: 'Medical Emergency Loan', icon: '🏥', description: 'For urgent medical expenses', maxLTV: 100, typicalTenure: 5 },
];

export const STATES = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala'];

export const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'BOB', 'PNB', 'Canara', 'IDFC'];

export const DOCUMENT_TYPES = [
    'Loan Agreement',
    'Sanction Letter',
    'EMI Schedule',
    'Terms & Conditions',
    'Offer Letter',
    'Mortgage Document',
    'Bank Statement',
    'Credit Agreement Addendum',
];

// Risk scoring configuration
export const RISK_CONFIG = {
    HIGH_INTEREST_THRESHOLD: 10,     // > 10% = high interest
    HIGH_PENALTY_THRESHOLD: 2,       // > 2% = high penalty
    HIGH_PROCESSING_FEE_THRESHOLD: 1, // > 1% = high processing fee
    INCOME_BURDEN_THRESHOLD: 0.5,    // EMI > 50% income = warning
};

// Calculate risk score for a bank loan offer
export function calculateRiskScore(loan) {
    let score = 0;
    const factors = [];

    if (loan.interestRate > 12) {
        score += 20;
        factors.push({ label: 'Very High Interest Rate', points: 20, severity: 'high' });
    } else if (loan.interestRate > 10) {
        score += 12;
        factors.push({ label: 'High Interest Rate', points: 12, severity: 'moderate' });
    }

    if (loan.rateType === 'Floating') {
        score += 15;
        factors.push({ label: 'Floating Interest Rate (Volatile)', points: 15, severity: 'moderate' });
    }

    if (loan.prepaymentPenalty > 2) {
        score += 15;
        factors.push({ label: `High Prepayment Penalty (${loan.prepaymentPenalty}%)`, points: 15, severity: 'high' });
    } else if (loan.prepaymentPenalty > 0) {
        score += 8;
        factors.push({ label: `Prepayment Penalty (${loan.prepaymentPenalty}%)`, points: 8, severity: 'low' });
    }

    if (loan.processingFee > 1) {
        score += 10;
        factors.push({ label: `High Processing Fee (${loan.processingFee}%)`, points: 10, severity: 'moderate' });
    } else if (loan.processingFee > 0.5) {
        score += 5;
        factors.push({ label: `Processing Fee (${loan.processingFee}%)`, points: 5, severity: 'low' });
    }

    if (loan.latePenalty > 2) {
        score += 10;
        factors.push({ label: `High Late Payment Penalty (${loan.latePenalty}%)`, points: 10, severity: 'moderate' });
    }

    const totalScore = Math.min(100, score);
    const level = totalScore <= 30 ? 'Low' : totalScore <= 60 ? 'Moderate' : 'High';
    const color = totalScore <= 30 ? '#22c55e' : totalScore <= 60 ? '#f59e0b' : '#ef4444';

    return { score: totalScore, level, color, factors };
}

// EMI Calculator
export function calculateEMI(principal, annualRate, tenureYears) {
    const monthlyRate = annualRate / (12 * 100);
    const tenureMonths = tenureYears * 12;
    if (monthlyRate === 0) return principal / tenureMonths;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi);
}

export function calculateTotalRepayment(emi, tenureYears) {
    return emi * tenureYears * 12;
}

export function formatCurrency(amount) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)} K`;
    return `₹${amount}`;
}
