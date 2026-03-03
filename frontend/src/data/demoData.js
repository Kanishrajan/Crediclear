// Sample PDF extracted clauses for demo purposes
export const DEMO_DOCUMENTS = {
    'home_loan_sbi': {
        bank: 'SBI',
        loanType: 'Home Loan',
        amount: 5000000,
        tenure: 20,
        interestRate: 8.4,
        rateType: 'Floating',
        emi: 43391,
        clauses: [
            {
                id: 1,
                type: 'INTEREST_RATE',
                label: 'Interest Rate',
                value: '8.40% p.a. (Floating - linked to RBI Repo Rate)',
                risk: 'moderate',
                explanation: 'This is a floating rate loan. Rate can change with RBI policy. Current spread is 2.65% above repo rate.',
                highlight: true,
                raw: 'The rate of interest shall be 8.40% per annum, floating, linked to the RBI External Benchmark Lending Rate (EBLR) with a spread of 2.65% per annum.'
            },
            {
                id: 2,
                type: 'PROCESSING_FEE',
                label: 'Processing Fee',
                value: '0.50% of loan amount (₹25,000)',
                risk: 'low',
                explanation: 'One-time processing fee. Reasonable at 0.5%.',
                highlight: false,
                raw: 'A processing fee of 0.50% of the sanctioned loan amount, subject to a minimum of ₹10,000, shall be collected at the time of disbursement.'
            },
            {
                id: 3,
                type: 'PREPAYMENT',
                label: 'Prepayment Clause',
                value: 'NIL charges for floating rate loans',
                risk: 'low',
                explanation: 'No prepayment penalty. As per RBI guidelines, floating rate home loans have no foreclosure charges.',
                highlight: false,
                raw: 'No prepayment or foreclosure charges shall be levied on floating rate home loans as per RBI circular RBI/2019-20/88.'
            },
            {
                id: 4,
                type: 'LATE_PAYMENT',
                label: 'Late Payment Penalty',
                value: '2% per month on overdue amount',
                risk: 'moderate',
                explanation: 'Late payment attracts 2% per month penalty. This can compound significantly if EMI is missed.',
                highlight: true,
                raw: 'In the event of default in payment of EMI, penal interest at the rate of 2% per month shall be charged on the overdue amount for the period of default.'
            },
            {
                id: 5,
                type: 'COLLATERAL',
                label: 'Collateral Clause',
                value: 'Mortgage of property being purchased',
                risk: 'moderate',
                explanation: 'The property is mortgaged as collateral. Non-payment may lead to forfeiture of property.',
                highlight: true,
                raw: 'The borrower shall create an equitable mortgage by deposit of title deeds of the subject property as security for the loan. In case of default, the bank reserves the right to invoke the SARFAESI Act, 2002.'
            },
            {
                id: 6,
                type: 'DEFAULT',
                label: 'Default Consequences',
                value: 'SARFAESI Act invocation, property auction',
                risk: 'high',
                explanation: 'HIDDEN RISK: Default allows bank to auction property under SARFAESI without court order. This is a significant risk.',
                highlight: true,
                raw: 'Upon default exceeding 90 days, the account shall be classified as Non-Performing Asset (NPA) and the Bank shall initiate recovery proceedings under the SARFAESI Act, 2002, which may include taking possession of and selling the secured asset.'
            },
            {
                id: 7,
                type: 'CONDITION',
                label: 'Conditional Rate Reset',
                value: 'Rate may increase without prior notice',
                risk: 'high',
                explanation: 'HIDDEN CLAUSE: The bank can revise the rate upward based on cost-of-fund changes. Very broad discretionary power.',
                highlight: true,
                raw: 'The Bank reserves the right to change the rate of interest prospectively, based on changes in the cost of funds or market conditions, and such changes shall be communicated through the Bank\'s website and shall be binding on the borrower.'
            }
        ],
        summary: 'This is a floating rate home loan from SBI at 8.40% p.a. The loan has no prepayment penalty and reasonable processing fees. Key risks include: rate volatility (floating rate), significant default consequences under SARFAESI Act, and broad bank discretion to revise interest rates.',
        riskScore: 38
    },

    'personal_loan_hdfc': {
        bank: 'HDFC',
        loanType: 'Personal Loan',
        amount: 500000,
        tenure: 5,
        interestRate: 10.5,
        rateType: 'Fixed',
        emi: 10747,
        clauses: [
            {
                id: 1,
                type: 'INTEREST_RATE',
                label: 'Interest Rate',
                value: '10.50% p.a. (Fixed)',
                risk: 'moderate',
                explanation: 'Fixed rate provides certainty but is on the higher side for personal loans.',
                highlight: false,
                raw: 'The rate of interest shall be 10.50% per annum, fixed for the entire tenure of the loan.'
            },
            {
                id: 2,
                type: 'PROCESSING_FEE',
                label: 'Processing Fee',
                value: '2.5% of loan amount (₹12,500)',
                risk: 'high',
                explanation: 'HIGH RISK: Processing fee of 2.5% is above the recommended 1% threshold. Adds to effective cost.',
                highlight: true,
                raw: 'A non-refundable processing fee of 2.50% of the loan amount along with applicable GST shall be deducted from the disbursed amount.'
            },
            {
                id: 3,
                type: 'PREPAYMENT',
                label: 'Prepayment Penalty',
                value: '2.5% + GST on outstanding amount',
                risk: 'high',
                explanation: 'HIGH RISK: 2.5% foreclosure charge discourages early repayment. You pay penalty for being financially responsible.',
                highlight: true,
                raw: 'Foreclosure charges of 2.50% plus applicable taxes shall be levied on the outstanding balance at the time of foreclosure, if foreclosed before expiry of 12 months from the date of first disbursement.'
            },
            {
                id: 4,
                type: 'LATE_PAYMENT',
                label: 'Late Payment',
                value: '2.5% per month on overdue EMI',
                risk: 'high',
                explanation: 'Very high late payment charge that can quickly compound.',
                highlight: true,
                raw: 'Late payment charges of 2.50% per month + GST shall be levied on EMI amounts overdue beyond the due date.'
            },
            {
                id: 5,
                type: 'CONDITION',
                label: 'Hidden Clause: Cross Default',
                value: 'Default on any HDFC product triggers this loan default',
                risk: 'high',
                explanation: 'CRITICAL HIDDEN CLAUSE: If you default on any other HDFC product (credit card, etc.), this loan also goes into default immediately.',
                highlight: true,
                raw: 'If the Borrower defaults on any other credit facility availed from HDFC Bank Limited, HDFC Bank at its sole discretion may treat this loan as a cross-default and declare the entire outstanding amount as immediately due and payable.'
            }
        ],
        summary: 'This HDFC personal loan carries multiple high-risk clauses. The 2.5% processing fee is above industry standard, foreclosure charges penalize early repayment, and the cross-default clause is a hidden risk that most borrowers miss. Overall risk score is HIGH.',
        riskScore: 72
    }
};

export const CHATBOT_RESPONSES = {
    greetings: [
        "Hello! I'm CrediClear AI. I can help you understand loan clauses, compare bank offers, and simulate financial impact. What would you like to know?",
        "Welcome to CrediClear! I'm here to help make your loan decisions transparent and informed. How can I assist you today?"
    ],
    emi_query: "To calculate your EMI, I need the loan amount, interest rate, and tenure. The formula is: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P = Principal, R = Monthly Rate, N = Months.",
    risk_query: "Risk scores are calculated based on: Interest Rate (High = +20 pts), Floating Rate (+15 pts), High Penalty >2% (+15 pts), High Processing Fee >1% (+10 pts), Hidden Clauses (+20 pts). Low Risk: 0-30 | Moderate: 31-60 | High: 61-100.",
    compare_query: "I can compare up to 5 banks simultaneously. I'll analyze interest rates, processing fees, penalties, and generate a comprehensive risk score for each offer.",
};
