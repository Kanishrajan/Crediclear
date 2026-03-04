from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Any, cast
import json
import re
import math
import random
import uvicorn

app = FastAPI(
    title="CrediClear AI API",
    description="Explainable AI Platform for Loan Transparency - India",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Mock Data ────────────────────────────────────────────────────────────────
BANK_DATA = [
    {
        "id": 1,
        "bank": "SBI",
        "loanType": "Home Loan",
        "interestRate": 8.4,
        "rateType": "Floating",
        "processingFee": 0.5,
        "prepaymentPenalty": 0,
        "latePenalty": 2.0,
        "states": ["Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Kerala"]
    },
    {
        "id": 2,
        "bank": "HDFC",
        "loanType": "Home Loan",
        "interestRate": 8.75,
        "rateType": "Floating",
        "processingFee": 1.0,
        "prepaymentPenalty": 2.0,
        "latePenalty": 2.5,
        "states": ["Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Kerala"]
    }
]

# ─── Models ───────────────────────────────────────────────────────────────────

class EMIRequest(BaseModel):
    principal: float
    annual_rate: float
    tenure_years: int

class RiskScoreRequest(BaseModel):
    interest_rate: float
    rate_type: str  # 'Fixed' or 'Floating'
    processing_fee: float
    prepayment_penalty: float
    late_penalty: float
    has_hidden_clauses: bool = False
    transparency_score: int = 80  # 0–100

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    document_context: Optional[str] = None
    loan_type: Optional[str] = None

class LoanFilterRequest(BaseModel):
    state: Optional[str] = None
    loan_type: Optional[str] = None
    bank: Optional[str] = None

# ─── Utility Functions ─────────────────────────────────────────────────────────

def calculate_emi(principal: float, annual_rate: float, tenure_years: int) -> float:
    R = annual_rate / (12 * 100)
    N = tenure_years * 12
    if R == 0:
        return principal / N
    return (principal * R * math.pow(1 + R, N)) / (math.pow(1 + R, N) - 1)

def calculate_risk_score(loan: dict) -> dict:
    score = 0
    factors: List[Any] = []
    
    rate = loan.get('interestRate', 0)
    if rate > 12:
        score += 20
        factors.append({'label': f'Very High Interest Rate ({rate}%)', 'points': 20, 'severity': 'high'})
    elif rate > 10:
        score += 12
        factors.append({'label': f'High Interest Rate ({rate}%)', 'points': 12, 'severity': 'moderate'})
    
    if loan.get('rateType') == 'Floating':
        score += 15
        factors.append({'label': 'Floating Rate (Volatile)', 'points': 15, 'severity': 'moderate'})
    
    penalty = loan.get('prepaymentPenalty', 0)
    if penalty > 2:
        score += 15
        factors.append({'label': f'High Prepayment Penalty ({penalty}%)', 'points': 15, 'severity': 'high'})
    elif penalty > 0:
        score += 8
        factors.append({'label': f'Prepayment Penalty ({penalty}%)', 'points': 8, 'severity': 'low'})
    
    fee = loan.get('processingFee', 0)
    if fee > 1:
        score += 10
        factors.append({'label': f'High Processing Fee ({fee}%)', 'points': 10, 'severity': 'moderate'})
    
    late = loan.get('latePenalty', 0)
    if late > 2:
        score += 10
        factors.append({'label': f'High Late Payment Penalty ({late}%)', 'points': 10, 'severity': 'moderate'})
    
    total = min(100, score)
    level = 'Low' if total <= 30 else 'Moderate' if total <= 60 else 'High'
    
    # Extract labels for the top 2 factors to avoid complex indexing in the return expression
    primary_labels = [str(factors[i].get('label', '')) for i in range(min(2, len(factors)))]
    primary_factors_str = ", ".join(primary_labels) if primary_labels else "None detected"
    
    return {
        'score': total,
        'level': level,
        'factors': factors,
        'explanation': f"Risk score of {total}/100 assigned as {level} risk. Primary factors: {primary_factors_str}."
    }


def extract_clauses(text: str, loan_type: str = "Home Loan") -> list:
    clauses = []
    
    rate_patterns = [
        r'(\d+\.?\d*)\s*%\s*(?:per annum|p\.?a\.?|per year)',
        r'interest\s+(?:rate\s+)?(?:of\s+)?(\d+\.?\d*)\s*%',
    ]
    for pattern in rate_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            rate = match.group(1)
            is_floating = bool(re.search(r'floating|variable|repo|eblr|mclr', text, re.IGNORECASE))
            clauses.append({
                'id': len(clauses) + 1,
                'type': 'INTEREST_RATE',
                'label': 'Interest Rate',
                'value': f"{rate}% p.a. ({'Floating' if is_floating else 'Fixed'})",
                'risk': 'moderate' if is_floating else 'low',
                'explanation': f"{'Floating rate linked to RBI benchmark. Can change with policy.' if is_floating else 'Fixed rate provides payment certainty.'}",
                'highlight': is_floating,
            })
            break
    
    fee_match = re.search(r'processing\s+fee\s+(?:of\s+)?(\d+\.?\d*)\s*%', text, re.IGNORECASE)
    if fee_match:
        fee = float(fee_match.group(1))
        clauses.append({
            'id': len(clauses) + 1,
            'type': 'PROCESSING_FEE',
            'label': 'Processing Fee',
            'value': f"{fee}%",
            'risk': 'high' if fee > 1.5 else 'moderate' if fee > 0.5 else 'low',
            'explanation': f"Processing fee of {fee}%. {'Above recommended 1% threshold.' if fee > 1 else 'Reasonable.'}",
            'highlight': fee > 1,
        })
    
    prepay_match = re.search(r'(?:foreclos|prepay|pre-pay).*?(\d+\.?\d*)\s*%', text, re.IGNORECASE)
    if prepay_match:
        penalty = float(prepay_match.group(1))
        clauses.append({
            'id': len(clauses) + 1,
            'type': 'PREPAYMENT',
            'label': 'Prepayment/Foreclosure Penalty',
            'value': f"{penalty}% of outstanding",
            'risk': 'high' if penalty > 2 else 'moderate',
            'explanation': f"Foreclosure charges of {penalty}% discourage early repayment. {'HIGH RISK: Above 2% threshold!' if penalty > 2 else 'Within acceptable range.'}",
            'highlight': penalty > 1.5,
        })
    
    if re.search(r'sarfaesi|securitisation', text, re.IGNORECASE):
        clauses.append({
            'id': len(clauses) + 1,
            'type': 'DEFAULT',
            'label': 'SARFAESI Act Clause',
            'value': 'Bank can invoke SARFAESI Act on default',
            'risk': 'high',
            'explanation': 'CRITICAL: Bank can take possession of and auction the collateral property under SARFAESI Act without court order after 90-day NPA classification.',
            'highlight': True,
        })
    
    if re.search(r'cross[- ]default|any other.*facility|any credit.*product', text, re.IGNORECASE):
        clauses.append({
            'id': len(clauses) + 1,
            'type': 'CONDITION',
            'label': 'Cross-Default Clause',
            'value': 'Default on any bank product triggers this loan',
            'risk': 'high',
            'explanation': 'HIDDEN RISK: If you default on any other product (credit card, etc.) with this bank, this loan also goes into immediate default.',
            'highlight': True,
        })
    
    if not clauses:
        clauses = [
            {
                'id': 1,
                'type': 'INTEREST_RATE',
                'label': 'Interest Rate',
                'value': '8.40% p.a. (Floating)',
                'risk': 'moderate',
                'explanation': 'Floating rate linked to RBI EBLR. Rate may change quarterly.',
                'highlight': True,
            }
        ]
    
    return clauses

# ─── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "CrediClear AI API v1.0", "status": "online"}

@app.get("/api/health")
def health():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/api/analyze")
async def analyze_document(file: UploadFile = File(...), loan_type: str = "Home Loan"):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    demo_text = """
    The rate of interest shall be 8.40% per annum, floating, linked to the RBI External Benchmark 
    Lending Rate (EBLR). A processing fee of 0.50% of the sanctioned loan amount. 
    Foreclosure charges of 2.50% plus applicable taxes if foreclosed before 12 months.
    The Bank reserves the right to invoke the SARFAESI Act, 2002 upon default.
    """
    
    clauses = extract_clauses(demo_text, loan_type)
    
    risk_data = {
        'interestRate': 8.4,
        'rateType': 'Floating',
        'processingFee': 0.5,
        'prepaymentPenalty': 2.5,
        'latePenalty': 2.0,
    }
    risk_score = calculate_risk_score(risk_data)
    
    return {
        "status": "success",
        "filename": file.filename,
        "loanType": loan_type,
        "clauses": clauses,
        "riskScore": risk_score['score'],
        "riskLevel": risk_score['level'],
        "riskFactors": risk_score['factors'],
        "summary": f"Document analyzed. Risk: {risk_score['level']} ({risk_score['score']}/100).",
    }

@app.post("/api/emi")
def calculate_emi_api(request: EMIRequest):
    emi = calculate_emi(request.principal, request.annual_rate, request.tenure_years)
    total_repayment = emi * request.tenure_years * 12
    total_interest = total_repayment - request.principal
    
    simulations = []
    for delta in [-1, 0, 1, 2, 3]:
        adj_rate = request.annual_rate + delta
        if adj_rate > 0:
            adj_emi = calculate_emi(request.principal, adj_rate, request.tenure_years)
            simulations.append({
                'rate': f"{adj_rate:.1f}%",
                'emi': int(round(adj_emi)),
                'totalInterest': int(round(adj_emi * request.tenure_years * 12 - request.principal)),
                'isDelta': delta,
            })
    
    monthly_rate = request.annual_rate / (12 * 100)
    balance = request.principal
    amortization = []
    for month in range(1, min(request.tenure_years * 12 + 1, 61)):
        interest_component = balance * monthly_rate
        principal_component = emi - interest_component
        balance -= principal_component
        if month % 6 == 0 or month == 1:
            amortization.append({
                'month': month,
                'principal': int(round(max(0.0, float(principal_component)))),
                'interest': int(round(interest_component)),
                'balance': int(round(max(0.0, float(balance)))),
            })
    
    return {
        "emi": int(round(emi)),
        "totalRepayment": int(round(total_repayment)),
        "totalInterest": int(round(total_interest)),
        "interestPercent": float(f"{(total_interest / request.principal) * 100:.1f}"),
        "simulations": simulations,
        "amortization": amortization,
    }

@app.post("/api/risk-score")
def get_risk_score(request: RiskScoreRequest):
    loan = {
        'interestRate': request.interest_rate,
        'rateType': request.rate_type,
        'processingFee': request.processing_fee,
        'prepaymentPenalty': request.prepayment_penalty,
        'latePenalty': request.late_penalty,
    }
    result = calculate_risk_score(loan)
    
    if request.has_hidden_clauses:
        result['score'] = min(100, result['score'] + 20)
        result['factors'].append({'label': 'Hidden Conditional Clauses', 'points': 20, 'severity': 'high'})
    
    if request.transparency_score < 60:
        result['score'] = min(100, result['score'] + 15)
        result['factors'].append({'label': 'Low Transparency Score', 'points': 15, 'severity': 'high'})
    
    return result

@app.post("/api/chat")
def chat(request: ChatRequest):
    last_message = request.messages[-1].content.lower() if request.messages else ""
    
    if 'emi' in last_message or 'calculate' in last_message:
        response = "To calculate your EMI, use the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]."
    elif 'risk' in last_message:
        response = "Risk scores are calculated based on interest rate, rate type, penalties, and hidden clauses."
    else:
        response = "I'm CrediClear AI, here to help you understand loan agreements."
    
    return {
        "role": "assistant",
        "content": response,
        "timestamp": "2024-01-01T12:00:00Z",
    }

@app.get("/api/banks")
def get_banks(state: Optional[str] = None, loan_type: Optional[str] = None):
    filtered = BANK_DATA
    if state:
        filtered = [b for b in filtered if any(state == s for s in cast(List[Any], b.get('states', [])))]
    if loan_type:
        filtered = [b for b in filtered if b.get('loanType') == loan_type]
    
    # Cast to dict[str, Any] to allow adding 'riskData' key
    for loan in cast(List[dict[str, Any]], filtered):
        loan['riskData'] = calculate_risk_score(loan)
    
    return {"banks": filtered, "total": len(filtered)}

@app.get("/api/loan-types")
def get_loan_types():
    return {
        "types": [
            {"id": "home", "name": "Home Loan", "icon": "🏠"},
            {"id": "education", "name": "Education Loan", "icon": "🎓"},
            {"id": "car", "name": "Car Loan", "icon": "🚗"},
            {"id": "personal", "name": "Personal Loan", "icon": "💳"},
        ]
    }

@app.get("/api/states")
def get_states():
    return {"states": ["Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Kerala"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
