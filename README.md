# ARTHSETU AI — Right Scheme. Right Support. Right Path.

> **AI-Driven Civic Finance & Scheme Matching Platform**  
> AI-Powered Scheme Discovery, Financial Repayment Planning, and NPA-Aware Geo-Spatial Channel Partner Routing for Eligible Beneficiaries.

---

## 🌟 Product Vision & Architecture

**ArthSetu AI** is an intelligent civic-fintech platform engineered to bridge the information and access gap for marginalized entrepreneurs and students. It provides an end-to-end journey:

```
User Profile → AI Requirement Understanding → Scheme Matching (100-Point Rule Engine) → Scheme Comparison → Financial Calculator (Moratorium & Limits) → Geo-Spatial Partner Locator → NPA & Fund Capacity Check → Intelligent Application Routing → Dossier Tracking
```

### Key Highlights & Core Components
1. **Smart Scheme Recommender**: Transparent 100-point rule-based scoring engine evaluating social category, annual family income, requested loan ceiling, state eligibility, and enterprise sector. Displays score clearly as **Profile Match %** (not guaranteed eligibility).
2. **Financial Calculator**: Interactive loan repayment planner with loan limit validation, 6-month moratorium grace period visualization, and Recharts amortization schedule breakdown.
3. **Geo-Spatial Partner Locator & Router**: OpenStreetMap Leaflet interface that locates nearby SCAs, Banks, and NBFC-MFIs. Evaluates fund utilization capacity and NPA/overdue ratios to route applicants away from restricted branches.
4. **AI Scheme Assistant**: Conversational assistant with fallback heuristic extraction for prompt parameter understanding (purpose, business type, location, loan amount, income).
5. **Financial Literacy**: Enhances concessional lending literacy (English/Hindi support) and brings transparency to channel finance.
6. **Quick Auto-Fill**: Pre-loaded profile parameters for rapid evaluation.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide React icons, Recharts, Leaflet / React-Leaflet, React Router DOM.
- **Backend**: Python, Flask, SQLite (with automatic schema migration & seed initializer).
- **AI Abstraction**: Flask natural-language parser with optional LLM key integration and offline regex heuristic fallback engine.

---

## 📁 Project Structure

```
ArthSetu AI/
├── backend/
│   ├── app.py                 # Flask server entry point (CORS, REST blueprints)
│   ├── config.py              # Configuration & database path settings
│   ├── models/
│   │   └── database.py        # SQLite schema & automatic seed data initialisation
│   ├── services/
│   │   ├── matching_service.py  # Transparent 100-point scheme matching score algorithm
│   │   ├── calculator_service.py# EMI, moratorium schedule & loan ceiling validator
│   │   ├── routing_service.py # Geo-spatial distance, fund capacity & NPA router
│   │   └── ai_service.py      # Natural language requirement parser & explanation generator
│   ├── routes/
│   │   ├── auth.py            # Authentication REST routes
│   │   ├── schemes.py         # Scheme listing & matching REST endpoints
│   │   ├── calculator.py      # Repayment calculation REST endpoint
│   │   ├── partners.py        # Geo-spatial partner locator & routing endpoints
│   │   ├── applications.py    # Application routing & dossier tracking endpoints
│   │   ├── ai.py              # AI prompt extraction REST endpoints
│   │   └── learn.py           # Financial literacy modules endpoint
│   └── data/
│       ├── schemes.json       # 10 structured government schemes
│       ├── partners.json      # 12 channel partners (SCAs, Banks, MFIs)
│       └── users.json         # User accounts
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer
│   │   ├── context/           # AppContext (Language toggle, Profile state)
│   │   ├── pages/             # Landing, Dashboard, AI Assistant, Form, Schemes, Comparison, Calculator, Map Router, Routing Confirmation, Applications, Learn, Admin, 404
│   │   ├── utils/             # Translations (English / Hindi dictionary)
│   │   ├── App.jsx            # React Router setup
│   │   ├── index.css          # Tailwind CSS v4 & Leaflet imports
│   │   └── main.jsx           # React app entry point
│   ├── package.json
│   └── vite.config.js         # Vite config with API proxy to Flask port 5000
│
└── README.md
```

---

## 🚀 Quick Start Instructions

### 1. Run Backend Server (Flask)
```bash
cd backend
py app.py
```
*Backend server runs live on `http://127.0.0.1:5000`*

### 2. Run Frontend Server (Vite React)
```bash
cd frontend
npm run dev
```
*Frontend dev server runs live on `http://127.0.0.1:5173`*

---

## 🎯 Platform User Flow

1. **Landing Page (`http://127.0.0.1:5173/`)**: View modern civic-tech visual design, tagline, 3 core solution cards, 6-step journey, and impact metrics.
2. **Auto-Fill Profile**: Click **"Auto-Fill Profile"** in the top navigation bar.
3. **AI Scheme Assistant (`/ai-assistant`)**: Click example prompt *"I want ₹3 lakh to start a tailoring business in Lucknow. My annual family income is around ₹3 lakh."* Watch the AI extract parameters into editable chips, then click **"Analyze My Eligibility →"**.
4. **Scheme Recommender Engine (`/schemes`)**: View 92% profile match score for NSFDC Micro Credit Scheme. Inspect the transparent checklist under *"Why it matches your profile"*.
5. **Scheme Comparison Matrix (`/compare`)**: Select 2-3 schemes to compare interest rates (4%-6%), maximum loan amounts, moratorium length, and document requirements side-by-side.
6. **Financial Calculator (`/calculator`)**: Adjust loan slider to ₹3,00,000. Try entering ₹6,00,000 to see the **Loan Limit Exceeded Warning**. Observe the 6-month moratorium grace period explanation and yearly amortization chart.
7. **Geo-Spatial Partner Router (`/partners`)**: View OpenStreetMap map showing nearby channel partners. Observe that **Regional Micro-Finance Institution** (1.8km away) is marked **🔴 Restricted** due to high NPA/Overdue ratio (14.5%), while **Public Sector Bank** (2.4km away) is marked **🟢 Eligible**.
8. **Application Routing (`/application-routing`)**: Click **"Route Application Here"**, confirm summary details, and click **"Confirm Routing"**.
9. **Dossier Tracking (`/my-applications`)**: View unique tracking ID **AS-1024** and live 5-step progress timeline.
10. **Financial Literacy Hub (`/learn`)**: Toggle between **EN** and **हिंदी** to read simple explanations of EMI, moratorium, and concessional lending.
11. **Admin Ecosystem Dashboard (`/admin`)**: Inspect real-time partner capacity oversight table, NPA thresholds, and pending routing logs.
