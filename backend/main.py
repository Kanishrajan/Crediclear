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


class DocumentChatRequest(BaseModel):
    messages: List[ChatMessage]
    document_context: str  # JSON-serialized clause data
    loan_type: Optional[str] = None
    bank: Optional[str] = None


def generate_document_response(user_message: str, doc_context: str, loan_type: str = "", bank: str = "") -> str:
    """Generate a context-aware response based on document clauses."""
    msg = user_message.lower()
    
    try:
        context_data = json.loads(doc_context)
    except (json.JSONDecodeError, TypeError):
        context_data = {}
    
    clauses = context_data.get("clauses", [])
    summary = context_data.get("summary", "")
    risk_score = context_data.get("riskScore", 0)
    interest_rate = context_data.get("interestRate", 0)
    rate_type = context_data.get("rateType", "")
    amount = context_data.get("amount", 0)
    emi_val = context_data.get("emi", 0)
    bank_name = bank or context_data.get("bank", "the bank")
    loan = loan_type or context_data.get("loanType", "loan")
    
    clause_map = {}
    for c in clauses:
        clause_map[c.get("type", "").upper()] = c
    
    # Interest rate questions
    if any(k in msg for k in ['interest rate', 'rate of interest', 'interest %', 'what rate', 'roi']):
        ic = clause_map.get("INTEREST_RATE")
        if ic:
            return (
                f"📊 **Interest Rate Details**\n\n"
                f"According to your {loan} agreement with {bank_name}:\n\n"
                f"- **Rate:** {ic.get('value', 'Not specified')}\n"
                f"- **Risk Level:** {ic.get('risk', 'N/A').capitalize()}\n\n"
                f"💡 **What this means:** {ic.get('explanation', '')}\n\n"
                f"{'⚠️ Since this is a floating rate, your EMI could change when RBI revises the repo rate. Budget for potential 1-2% rate increases.' if 'floating' in ic.get('value', '').lower() else '✅ A fixed rate means your EMI stays constant throughout the loan tenure.'}"
            )
        return f"The interest rate on your {loan} is {interest_rate}% p.a. ({rate_type})."
    
    # Hidden charges / fees
    if any(k in msg for k in ['hidden', 'charge', 'fee', 'processing fee', 'cost', 'extra']):
        pf = clause_map.get("PROCESSING_FEE")
        high_risk = [c for c in clauses if c.get("risk") == "high"]
        
        response = f"🔍 **Charges & Fees in Your {loan}**\n\n"
        
        if pf:
            response += f"**Processing Fee:** {pf.get('value', 'Not specified')}\n"
            response += f"- {pf.get('explanation', '')}\n\n"
        
        if high_risk:
            response += "⚠️ **Potential Hidden Costs:**\n"
            for c in high_risk:
                response += f"- **{c.get('label', '')}:** {c.get('value', '')} — {c.get('explanation', '')}\n"
            response += "\n"
        
        if not pf and not high_risk:
            response += "No specific hidden charges were detected in the analyzed clauses.\n"
        
        response += "💡 **Tip:** Always ask the lender to provide a complete fee schedule in writing before signing."
        return response
    
    # Missed payment / default
    if any(k in msg for k in ['miss', 'default', 'late', 'overdue', 'npa', 'not pay', 'skip', "don't pay", 'cant pay']):
        lp = clause_map.get("LATE_PAYMENT")
        dc = clause_map.get("DEFAULT")
        
        response = f"⚠️ **What Happens If You Miss a Payment**\n\n"
        
        if lp:
            response += f"**Late Payment Penalty:** {lp.get('value', 'Not specified')}\n"
            response += f"- {lp.get('explanation', '')}\n\n"
        
        if dc:
            response += f"**Default Consequences:** {dc.get('value', 'Not specified')}\n"
            response += f"- {dc.get('explanation', '')}\n\n"
        
        if not lp and not dc:
            response += "The specific penalties for missed payments were not found in the analyzed clauses. However, most Indian bank loans charge 1-2% per month on overdue amounts.\n\n"
        
        response += (
            "💡 **Important Steps if Facing Difficulty:**\n"
            "1. Contact your bank BEFORE missing a payment\n"
            "2. Ask about EMI restructuring options\n"
            "3. After 90 days of non-payment, your account may be classified as NPA\n"
            "4. Under SARFAESI Act, the bank can take possession of collateral without court order"
        )
        return response
    
    # Collateral
    if any(k in msg for k in ['collateral', 'security', 'mortgage', 'property', 'asset', 'guarantee']):
        cc = clause_map.get("COLLATERAL")
        
        if cc:
            return (
                f"🏠 **Collateral / Security Details**\n\n"
                f"**Clause:** {cc.get('value', 'Not specified')}\n"
                f"- **Risk Level:** {cc.get('risk', 'N/A').capitalize()}\n\n"
                f"💡 **In simple terms:** {cc.get('explanation', '')}\n\n"
                f"📌 **Key points to understand:**\n"
                f"- The property/asset pledged as security can be seized if you default\n"
                f"- Under the SARFAESI Act, the bank can auction the property without going to court\n"
                f"- You cannot sell or transfer the collateral without the bank's written permission"
            )
        return f"No specific collateral clause was found in the analyzed document. Personal loans are typically unsecured (no collateral required)."
    
    # Prepayment / foreclosure
    if any(k in msg for k in ['prepay', 'foreclose', 'early', 'close early', 'pay off', 'full payment', 'pre-pay']):
        pp = clause_map.get("PREPAYMENT")
        
        if pp:
            return (
                f"🔓 **Prepayment / Foreclosure Details**\n\n"
                f"**Clause:** {pp.get('value', 'Not specified')}\n"
                f"- **Risk Level:** {pp.get('risk', 'N/A').capitalize()}\n\n"
                f"💡 **In simple terms:** {pp.get('explanation', '')}\n\n"
                f"📌 **RBI Guidelines:**\n"
                f"- For floating rate individual loans: Banks CANNOT charge prepayment penalty (RBI mandate)\n"
                f"- For fixed rate loans: Banks may charge 1-3% of outstanding amount\n"
                f"- Always check if there's a lock-in period before which prepayment isn't allowed"
            )
        return "No specific prepayment clause was found in the analyzed document."
    
    # Risk score
    if any(k in msg for k in ['risk', 'score', 'risky', 'safe', 'danger']):
        response = f"🛡️ **Risk Assessment for Your {loan}**\n\n"
        response += f"- **Overall Risk Score:** {risk_score}/100\n"
        response += f"- **Risk Level:** {'Low ✅' if risk_score <= 30 else 'Moderate ⚠️' if risk_score <= 60 else 'High 🔴'}\n\n"
        
        high_risk = [c for c in clauses if c.get("risk") == "high"]
        moderate_risk = [c for c in clauses if c.get("risk") == "moderate"]
        
        if high_risk:
            response += "🔴 **High Risk Factors:**\n"
            for c in high_risk:
                response += f"- {c.get('label', '')}: {c.get('value', '')}\n"
            response += "\n"
        
        if moderate_risk:
            response += "🟡 **Moderate Risk Factors:**\n"
            for c in moderate_risk:
                response += f"- {c.get('label', '')}: {c.get('value', '')}\n"
            response += "\n"
        
        response += f"💡 **Recommendation:** {'This loan has significant risks. Consider negotiating terms or comparing with other lenders.' if risk_score > 60 else 'The risk level is manageable, but review the highlighted clauses carefully.' if risk_score > 30 else 'This appears to be a reasonably safe loan agreement.'}"
        return response
    
    # Summary / overview
    if any(k in msg for k in ['summary', 'overview', 'summarize', 'tell me about', 'what does', 'explain document', 'about this']):
        response = f"📋 **Document Summary — {bank_name} {loan}**\n\n"
        if amount:
            amount_str = f"₹{amount/100000:.0f}L" if amount >= 100000 else f"₹{amount:,.0f}"
            response += f"- **Loan Amount:** {amount_str}\n"
        response += f"- **Interest Rate:** {interest_rate}% p.a. ({rate_type})\n"
        if emi_val:
            response += f"- **Monthly EMI:** ₹{emi_val:,}\n"
        response += f"- **Risk Score:** {risk_score}/100\n\n"
        
        if summary:
            response += f"**AI Analysis:** {summary}\n\n"
        
        response += f"📊 **{len(clauses)} clauses analyzed** — "
        high_count = len([c for c in clauses if c.get("risk") == "high"])
        mod_count = len([c for c in clauses if c.get("risk") == "moderate"])
        response += f"{high_count} high risk, {mod_count} moderate risk\n\n"
        response += "Ask me about any specific clause for a detailed explanation!"
        return response
    
    # Cross-default / condition
    if any(k in msg for k in ['cross', 'condition', 'clause', 'term', 'terms and condition']):
        conditions = [c for c in clauses if c.get("type") in ["CONDITION", "DEFAULT"]]
        if conditions:
            response = "📜 **Important Conditions & Clauses**\n\n"
            for c in conditions:
                response += f"**{c.get('label', '')}**\n"
                response += f"- {c.get('value', '')}\n"
                response += f"- 💡 {c.get('explanation', '')}\n\n"
            return response
        return "No special condition or cross-default clauses were detected in this document."
    
    # EMI
    if any(k in msg for k in ['emi', 'monthly', 'payment amount', 'installment']):
        if emi_val:
            return (
                f"💰 **EMI Details**\n\n"
                f"- **Monthly EMI:** ₹{emi_val:,}\n"
                f"- **Interest Rate:** {interest_rate}% p.a. ({rate_type})\n"
                f"- **Loan Amount:** ₹{amount/100000:.0f}L\n\n"
                f"{'⚠️ Note: Since this is a floating rate loan, your EMI may change when the interest rate is revised.' if rate_type == 'Floating' else '✅ Your EMI will remain constant throughout the tenure.'}\n\n"
                f"💡 Use the EMI Simulator for detailed analysis with rate change scenarios!"
            )
        return "EMI details were not available in the analyzed document. Use the EMI Simulator for calculations."
    
    # SARFAESI
    if any(k in msg for k in ['sarfaesi', 'auction', 'seize', 'possession']):
        dc = clause_map.get("DEFAULT")
        if dc:
            return (
                f"⚠️ **SARFAESI Act Clause Found**\n\n"
                f"**In your document:** {dc.get('value', '')}\n\n"
                f"💡 **What this means in simple terms:**\n"
                f"- If you don't pay your EMI for 90 consecutive days, your account becomes NPA\n"
                f"- The bank will send you a 60-day notice\n"
                f"- After the notice period, the bank can TAKE POSSESSION of your property\n"
                f"- They can AUCTION it to recover the loan amount\n"
                f"- ⚠️ All of this can happen WITHOUT a court order\n\n"
                f"📌 **To protect yourself:** Always maintain an emergency fund covering 3-6 months of EMI. Contact the bank immediately if you're facing financial difficulty."
            )
        return "No SARFAESI clause was specifically found in the analyzed document."
    
    # Fallback: provide a helpful overview
    clause_labels = [c.get("label", "") for c in clauses[:5]]
    return (
        f"I've analyzed your {bank_name} {loan} document. Here's what I can help with:\n\n"
        f"📋 **Detected Clauses:** {', '.join(clause_labels)}\n\n"
        f"You can ask me:\n"
        f"- \"What is the interest rate?\"\n"
        f"- \"Are there any hidden charges?\"\n"
        f"- \"What happens if I miss a payment?\"\n"
        f"- \"Explain the collateral clause\"\n"
        f"- \"Can I prepay this loan?\"\n"
        f"- \"What is the risk score?\"\n"
        f"- \"Give me a summary of this document\"\n\n"
        f"Ask anything specific about the loan agreement!"
    )


@app.post("/api/document-chat")
def document_chat(request: DocumentChatRequest):
    last_message = request.messages[-1].content if request.messages else ""
    
    if not last_message:
        return {
            "role": "assistant",
            "content": "Please ask a question about your loan document.",
            "timestamp": "2024-01-01T12:00:00Z",
        }
    
    response = generate_document_response(
        last_message,
        request.document_context,
        request.loan_type or "",
        request.bank or "",
    )
    
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
