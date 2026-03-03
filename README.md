# 🛡️ CrediClear AI – Explainable AI Platform for Loan Transparency

> India's most advanced AI-powered loan transparency platform. Analyze loan documents, compare bank offers, simulate EMI, and detect hidden risks with Explainable AI (XAI).

![CrediClear AI](https://img.shields.io/badge/CrediClear-AI%20Platform-6366f1?style=for-the-badge&logo=shield)
![India](https://img.shields.io/badge/Made%20for-India-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🚀 Quick Start

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### Backend (FastAPI)
```bash
cd backend
pip install fastapi uvicorn python-multipart pdfplumber
uvicorn main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

---

## 🏗️ Architecture

```
crediclear/
├── frontend/                    # React + Vite + TailwindCSS v4
│   └── src/
│       ├── components/
│       │   ├── Sidebar.jsx      # Navigation sidebar
│       │   ├── TopBar.jsx       # Header bar
│       │   └── UI.jsx           # Shared components (RiskGauge, etc.)
│       ├── pages/
│       │   ├── Dashboard.jsx    # Overview with charts
│       │   ├── DocumentAnalyzer.jsx  # PDF upload & clause extraction
│       │   ├── EMISimulator.jsx # Financial impact simulator
│       │   ├── LoanComparison.jsx   # Bank comparison dashboard
│       │   └── AIChat.jsx       # AI chatbot assistant
│       ├── store/
│       │   └── useStore.js      # Zustand global state
│       └── data/
│           ├── bankData.js      # India bank test data (36 offers)
│           └── demoData.js      # Demo documents & chatbot responses
└── backend/                     # FastAPI Python backend
    ├── main.py                  # API routes & business logic
    ├── requirements.txt         # Python dependencies
    └── .env.example             # Environment variables template
```

---

## 🔥 Core Modules

### Module 1 – Smart Document Analyzer
- **PDF Upload**: Drag & drop interface with instant feedback
- **NLP Extraction**: Identifies 10+ clause types (INTEREST_RATE, TENURE, PENALTY, FEE, etc.)
- **XAI Output**: Shows WHY each clause is risky
- **Demo Mode**: Try with SBI Home Loan or HDFC Personal Loan samples

### Module 2 – Financial Impact Simulator
- **EMI Calculator**: Real-time calculation with slider controls
- **Rate Simulation**: See impact of ±1-3% rate changes
- **Amortization**: Monthly principal vs interest breakdown
- **Foreclosure**: Calculate savings from early repayment
- **Income Burden**: Warning if EMI > 50% of monthly income

### Module 3 – Loan Comparison Dashboard
- **36 Bank Offers**: 8 banks × 10 loan types
- **State Filtering**: Tamil Nadu, Karnataka, Maharashtra, Delhi, Kerala
- **Multi-Select**: Compare up to 4 banks side-by-side
- **Radar Chart**: Multi-dimension comparison (Interest, Safety, Penalty, etc.)
- **Comparison Table**: Highlights best values

### Module 4 – AI Chatbot Assistant
- **Natural Language**: Ask questions in plain English
- **EMI Queries**: "Calculate EMI for 50L at 8.5% for 20 years"
- **Comparisons**: "Compare SBI and HDFC home loans"
- **Education**: Explains SARFAESI, cross-default, XAI, etc.
- **RAG-ready**: Architecture supports document-specific Q&A

---

## 🏦 India Bank Data

| Bank | Interest Range | Loan Types |
|------|----------------|------------|
| SBI | 7.0% – 11.15% | All 10 types |
| HDFC | 8.5% – 15.0% | 7 types |
| ICICI | 8.75% – 14.49% | 6 types |
| Axis | 9.0% – 15.0% | 5 types |
| Bank of Baroda | 7.0% – 9.15% | 4 types |
| PNB | 7.0% – 8.65% | 3 types |
| Canara | 7.65% – 8.7% | 2 types |
| IDFC First | 8.85% – 14.0% | 3 types |

---

## 🛡️ Risk Score Model (0–100)

| Factor | Points |
|--------|--------|
| Very High Interest Rate (>12%) | +20 |
| High Interest Rate (10-12%) | +12 |
| Floating Rate | +15 |
| Prepayment Penalty >2% | +15 |
| Prepayment Penalty 0-2% | +8 |
| Processing Fee >1% | +10 |
| High Late Penalty >2% | +10 |
| Hidden Conditional Clauses | +20 |
| Low Transparency | +15 |

- 🟢 **0–30:** Low Risk
- 🟡 **31–60:** Moderate Risk  
- 🔴 **61–100:** High Risk

---

## 📋 Supported Loan Types (10)
1. 🏠 Home Loan
2. 🎓 Education Loan
3. 🚗 Car Loan
4. 💳 Personal Loan
5. 🏢 Business Loan
6. 🥇 Gold Loan
7. 🌾 Agricultural Loan
8. 🏭 MSME Loan
9. 🚀 Startup Loan
10. 🏥 Medical Emergency Loan

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze PDF document |
| POST | `/api/emi` | Calculate EMI & generate schedule |
| POST | `/api/risk-score` | Calculate risk score with XAI |
| POST | `/api/chat` | AI chatbot endpoint |
| GET | `/api/banks` | List bank offers (filterable) |
| GET | `/api/loan-types` | Get all 10 loan types |
| GET | `/api/states` | Get supported Indian states |

---

## 🗄️ Database Schema (Supabase)

```sql
-- Users
CREATE TABLE users (id UUID PRIMARY KEY, email TEXT, name TEXT, plan TEXT);

-- Loan Documents
CREATE TABLE documents (id UUID, user_id UUID, filename TEXT, loan_type TEXT, upload_date TIMESTAMP);

-- Extracted Clauses
CREATE TABLE extracted_clauses (id UUID, document_id UUID, clause_type TEXT, value TEXT, risk_level TEXT, explanation TEXT);

-- Bank Rates
CREATE TABLE bank_rates (id UUID, bank TEXT, loan_type TEXT, interest_rate DECIMAL, state TEXT, ...);

-- Risk Scores
CREATE TABLE risk_scores (id UUID, document_id UUID, score INT, level TEXT, factors JSONB);

-- Chatbot Logs
CREATE TABLE chatbot_logs (id UUID, user_id UUID, session_id UUID, messages JSONB);
```

---

## 🔮 Production Upgrade Path

1. **LLM Integration**: Replace demo chatbot with GPT-4 Turbo API
2. **Real PDF Parsing**: Enable PDFPlumber + spaCy NER in backend
3. **Supabase Auth**: Add JWT-based user authentication
4. **RAG Pipeline**: Index extracted clauses in vector DB (pgvector)
5. **BERT Model**: Fine-tune BERT on Indian loan agreements
6. **Rate Monitoring**: Real-time bank rate tracking via scraping

---

## 💻 Tech Stack

**Frontend:** React 18, Vite 5, TailwindCSS 4, Recharts, Zustand, Framer Motion  
**Backend:** FastAPI 0.104, PDFPlumber, spaCy, Transformers  
**Database:** Supabase (PostgreSQL + Auth + Storage)  
**AI/ML:** BERT-based NER, GPT-4 Turbo, RAG pipeline  

---

*Built with ❤️ for Indian loan borrowers. CrediClear AI makes loan transparency a right, not a privilege.*
