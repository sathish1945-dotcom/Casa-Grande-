# Elvira Crest Luxury Realty — Premium Real Estate & AI Discovery Platform

> **An independent, production-grade architectural real estate website, AI property discovery engine, and sales automation platform tailored for Tamil Nadu developers (Chennai, Coimbatore, Bengaluru).**

Inspired by the UX and regional stature of premier builders like [Casagrand](https://www.casagrand.co.in/), **Elvira Crest** demonstrates how modern luxury residential developers can combine elegant editorial design with server-grounded AI recommendations, seamless site-visit scheduling, and automated CRM pipeline capture.

---

## 1. Key Architectural Features

- **Luxury Architectural Aesthetic**: Deep forest green (`#0D2818`), warm ivory (`#FAF8F5`), charcoal, and muted champagne gold (`#C5A880`) paired with classical typography and high-res architectural imagery.
- **HomeFinder AI™ Property Assistant**:
  - Grounded natural-language property matching using Google Gemini 2.5 Flash (`@google/genai`).
  - Strict factual grounding on verified RERA property records.
  - Transparent fallback mode operating deterministically when offline or without an API key.
  - Human advisor handoff via official WhatsApp API click-to-chat.
- **Multi-Dimensional Discovery**:
  - Filter by City (Chennai, Coimbatore, Bengaluru), Locality, BHK (2, 3, 4, 5 BHK), Budget cap, Typology (Sky Villa, Penthouse, Apartment, Row Villa), and Construction Stage.
  - Sort by price, possession date, or developer feature status.
- **Detailed Project Dossier & Floor Plans**:
  - High-definition architectural galleries.
  - Interactive 2D floor plans with RERA carpet area, super built-up area, and balcony specs.
  - Tamil Nadu statutory acquisition calculator (7% Stamp Duty, 2% Registration fee).
  - Nearby commute intelligence (Metro, Airport, IT Corridors, Hospitals).
  - Construction milestone tracking bar.
  - Instant brochure generation & download.
- **Accompanied Site-Visit Booking Engine**:
  - Date and time-slot reservation with complimentary chauffeur transit option.
  - Generates verified booking reference IDs (`SV-XXXXXX`).
  - Strict RERA consent and honeypot spam protection.
- **Protected Sales Operations CRM**:
  - Authenticated staff dashboard (`admin123` demo access).
  - Real-time pipeline KPI metrics (Total Leads, Visits Scheduled, Pipeline Value).
  - Lead qualification intent scoring (1–100 scale).
  - Lead status transition management (New -> Contacted -> Site Visit -> Qualified -> Closed).
  - One-click **CSV export** for sales teams.
  - **n8n Webhook Bridge**: Test and stream lead payloads to external automation engines.
  - WhatsApp Business Cloud Platform template simulator.
- **Financial Planning Console**:
  - Interactive mortgage EMI calculator with custom interest rates and tenures.
  - Statutory acquisition cost breakdown.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React Icons
- **Backend / API**: Express 4 running full-stack with Vite middleware in development
- **AI Intelligence**: `@google/genai` (Gemini 2.5 Flash) with strict JSON response schemas and system grounding
- **Database**: Supabase PostgreSQL schema with Row-Level Security (RLS) migrations and sample seeds provided in `/supabase`
- **Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`) via `tsx`
- **Automation Ready**: n8n Webhook integration & Meta WhatsApp Business Cloud API

---

## 3. Repository Structure

```text
├── .env.example                    # Environment variable template
├── index.html                      # SEO metadata, OpenGraph tags, Google Fonts
├── metadata.json                   # AI Studio applet capabilities
├── package.json                    # Full-stack scripts & dependencies
├── server.ts                       # Express server (AI API, leads, site visits, n8n webhook)
├── public/
│   ├── robots.txt                  # Search engine crawler instructions
│   └── sitemap.xml                 # XML Sitemap for search engines
├── src/
│   ├── App.tsx                     # Main application layout and coordinator
│   ├── main.tsx                    # React DOM entry point
│   ├── index.css                   # Tailwind v4 styles
│   ├── components/
│   │   ├── Navbar.tsx              # Brand header, city selector, helpline, CRM portal
│   │   ├── Hero.tsx                # Architectural visual, search console, trust metrics
│   │   ├── ProjectCard.tsx         # RERA badges, price breakdown, quick actions
│   │   ├── ProjectFilter.tsx       # City tabs, BHK pills, budget slider, sort selector
│   │   ├── ProjectDetailsModal.tsx # Configurations, 2D floor plans, commute times
│   │   ├── HomeFinderAI.tsx        # Conversational assistant with property cards
│   │   ├── SiteVisitModal.tsx      # Slot reservation, chauffeur pickup, consent
│   │   ├── SalesDashboard.tsx      # Protected staff CRM, pipeline KPIs, CSV export
│   │   ├── AmenitiesShowcase.tsx   # 30,000 sq.ft clubhouses, infinity pools, zen gardens
│   │   ├── WhyChooseUs.tsx         # 22+ yrs legacy, zero shared walls, 11-ft ceilings
│   │   ├── EmiCalculatorSection.tsx# Mortgage EMI & TN stamp duty calculator
│   │   ├── BrochureModal.tsx       # Lead qualification & instant brochure generation
│   │   └── Footer.tsx              # Regional office addresses, RERA & privacy modal
│   └── lib/
│       ├── types.ts                # TypeScript interfaces for real estate models
│       ├── calculator.ts           # EMI, TN stamp duty, and Indian currency formatters
│       ├── filter-utils.ts         # Pure filter & sort logic
│       ├── lead-store.ts           # Persistent lead store, scoring, CSV generator
│       ├── ai-assistant.ts         # Client/server HomeFinder AI integration
│       └── data/
│           └── properties.ts       # Verified Tamil Nadu project inventory
├── supabase/
│   ├── migrations/
│   │   └── 20261021_initial_schema.sql # Complete PostgreSQL schema with RLS
│   └── seed.sql                    # Initial project and lead seed data
└── tests/
    ├── calculator.test.ts          # Unit tests for EMI & stamp duty calculations
    ├── property-filter.test.ts     # Unit tests for search & filtering logic
    └── ai-matcher.test.ts          # Unit tests for HomeFinder AI natural language parsing
```

---

## 4. Local Development Setup

### Prerequisites
- Node.js (v18 or v20+)
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/premium-real-estate-ai-demo.git
cd premium-real-estate-ai-demo

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Running Locally
```bash
# Start the full-stack server (runs Express API + Vite frontend on port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Unit Tests
All financial math, filtering logic, and AI intent matching are decoupled from the UI and unit-tested:
```bash
npm test
```

---

## 5. Connecting Supabase (Optional)

1. Create a new project in [Supabase](https://supabase.com/).
2. In the Supabase SQL Editor, run the contents of:
   - `supabase/migrations/20261021_initial_schema.sql`
   - `supabase/seed.sql`
3. Copy your project URL and service keys into `.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="eyJhbGciOi..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
   ```

---

## 6. Connecting n8n Workflow Automation

1. Create a Webhook trigger node in your [n8n](https://n8n.io/) instance listening on `POST`.
2. Add your webhook URL in `.env`:
   ```env
   N8N_WEBHOOK_URL="https://n8n.yourdomain.com/webhook/realty-leads"
   ```
3. Open the **Staff Portal** on the website, go to the **n8n & WhatsApp Integrations** tab, and click **Send Test Ping** to verify connectivity.

---

## 7. Deploying to Vercel or Cloud Run

### Option A: Vercel
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Elvira Crest luxury real estate platform"
   git remote add origin https://github.com/your-username/premium-real-estate-ai-demo.git
   git push -u origin main
   ```
2. Import the project in Vercel.
3. Configure environment variables (`GEMINI_API_KEY`, `N8N_WEBHOOK_URL`, etc.).
4. Deploy!

### Option B: Cloud Run / Docker / Node Host
Run `npm run build` and start with `npm start` (which runs `node server.ts`).

---

## 8. Compliance & Disclaimer

This website is a demonstration project intended to showcase modern web architecture, AI-powered property discovery, and workflow automation for real estate developers in South India. All project names, renderings, and floor plans are sample assets for demonstration purposes only.
