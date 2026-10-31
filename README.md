# SupportMind AI 🧠⚡
### Enterprise AI Customer Support Knowledge System
**Problem Statement ID:** HACK-P380  
**Category:** Customer Support  
**Project Type:** Full-Stack Web Application  

[![Live Website](https://img.shields.io/badge/Live_Deployment-Vercel-black?style=flat-square&logo=vercel)](https://supportmind-ai-tau.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_TypeScript-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%2F_Supabase-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Accuracy](https://img.shields.io/badge/Benchmark-100%25_Verified-emerald?style=flat-square)](#-automated-evaluation-suite)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> 🚀 **Live Production Website:** [https://supportmind-ai-tau.vercel.app](https://supportmind-ai-tau.vercel.app)  
> 🔑 **Demo Admin Credentials:** `admin@supportmind.ai` / `admin123`  
> 📂 **GitHub Repository:** [https://github.com/Ritesh0227/supportmind-ai](https://github.com/Ritesh0227/supportmind-ai)  

---

## 🌟 Overview

**SupportMind AI** is an enterprise-grade, full-stack customer support and knowledge management platform designed to solve the chronic problem of customers repeatedly asking support questions and struggling to find accurate information. 

By unifying company-approved documentation across 8 standardized categories with a **strictly grounded Retrieval-Augmented Generation (RAG)** architecture, SupportMind AI provides rapid, concise answers accompanied by transparent source article citations. If information is not verified in company policy, the system enforces a strict safe fallback to eliminate hallucinations.

---

## 🚀 Key Features

### 👤 Customer-Facing Knowledge Portal
- **Hero & Instant Search:** Clean, Intercom/Linear-inspired SaaS layout with instant search filtering, keyboard shortcuts, and trending topic chips.
- **8 Standardized Categories:**
  1. Account Management
  2. Billing and Payments
  3. Orders
  4. Shipping and Delivery
  5. Returns and Refunds
  6. Products
  7. Technical Support
  8. Privacy and Security
- **Interactive AI Chatbot:** Conversational assistant with multi-stage loading, grounded answers, transparent source citations, and direct article inspection.
- **Strict Anti-Hallucination Guardrails:** If a policy is unverified, the assistant outputs:  
  `"I couldn't find a reliable answer in our knowledge base. Please contact our support team for further assistance."`
- **Customer Feedback:** Thumbs-up/down ratings and optional qualitative comments captured after every response.
- **FAQ Accordion & Human Escalation Desk:** Instant answers with "Ask AI" deep-links and priority ticket dispatching.

### 🛡️ Administrator Operations Console
- **Real-Time KPIs:** Live calculated stats (Total active articles, total questions, answered %, fallbacks, and customer satisfaction sentiment) pulled directly from database rows.
- **Knowledge Base Manager:** Rich Markdown article editor with live preview, category assignment, keywords, tags, view counters, and instant archival/unarchival.
- **Unanswered Inquiries Triage:** Live queue of queries that triggered fallbacks with a 1-click **"Create Article"** shortcut to rapidly close knowledge gaps.
- **Customer Feedback Audit:** Granular sentiment log with rating distribution and user comments.
- **Built-in Benchmark Suite:** Automated in-app evaluation runner covering all 10 standard test questions with real-time pass/fail audit proofs.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | Fast, typed, modular UI components |
| **Styling** | Tailwind CSS, Lucide Icons | Deep navy typography, blue/violet SaaS palette |
| **Backend** | Node.js, Express, TypeScript | REST API with input validation & security headers |
| **Database** | PostgreSQL & Supabase + Local DB | Dual adapter: Zero-config local persistence + Supabase PostgreSQL with RLS |
| **AI Integration** | Server-Side Multi-Provider Router | Built-in Grounded Engine (offline), OpenAI, Gemini, Local Ollama |
| **Search** | Multi-Factor Full-Text / Keyword RAG | Scored relevance gating with confidence thresholding |

---

## 📁 Project Directory Structure

```
supportmind-ai/
├── client/                               # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                    # Admin Dashboard, Article Editor, Feedback Review
│   │   │   ├── chat/                     # AI Chatbot Widget, Message Bubbles, Feedback Modal
│   │   │   ├── knowledge/                # Category Grid, Article Cards, Detail Modal
│   │   │   ├── layout/                   # Navbar, Hero, Footer
│   │   │   └── testsuite/                # Hackathon 10-Question Benchmark Modal
│   │   ├── services/                     # Typed REST API Client
│   │   ├── types.ts                      # Shared TypeScript Interfaces
│   │   ├── App.tsx                       # Master Application Controller
│   │   └── main.tsx                      # Entry Point
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── server/                               # Express + TypeScript Backend
│   ├── src/
│   │   ├── ai/                           # RAG Engine, Scoring Gating & Multi-Provider Router
│   │   ├── db/                           # Dual DB Adapter (Local DB + Supabase Client)
│   │   ├── routes/                       # Express Controllers (Articles, Chat, Feedback, Analytics)
│   │   ├── seed/                         # 24 Verified Articles across 8 Categories
│   │   ├── testRunner.ts                 # CLI Automated Verification Script
│   │   ├── index.ts                      # Express Server Bootstrap
│   │   └── types.ts                      # Server Data Contracts
│   └── package.json
├── supabase/                             # Database Migrations
│   └── migrations/
│       └── 20261030_init.sql             # PostgreSQL Tables, Foreign Keys, RLS & Seeds
├── docs/                                 # Submission Deliverables
│   ├── ARCHITECTURE.md                   # System Architecture & RAG Pipeline
│   ├── API_DOCUMENTATION.md              # REST API Specification
│   ├── DEMO_SCRIPT.md                    # 3-5 Minute Hackathon Pitch Script
│   ├── PRESENTATION_SLIDES.md            # 10-Slide Deck Outline
│   └── TEST_REPORT.md                    # Benchmark Audit & Verification Report
├── scripts/                              # Cross-Platform Dev & Install Orchestrators
├── .env.example                          # Environment Variables Template
├── .gitignore                            # Clean Git Configuration
├── README.md                             # Documentation & Setup Guide
└── package.json                          # Monorepo Scripts
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on Node.js v25)
- npm v9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/supportmind-ai.git
cd supportmind-ai

# Install both backend and frontend dependencies
npm run install:all
```

### 2. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
*(SupportMind AI runs out-of-the-box with the Built-in Grounded Engine and Local Database with zero external keys required!)*

### 3. Launch Development Environment
```bash
# Concurrently launches Express backend (port 5000) and Vite client (port 5173)
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🤖 AI Provider Configuration

SupportMind AI supports four pluggable AI modes configured in `.env` or in the chat widget:

### 1. Built-in Deterministic Grounded Engine (`AI_PROVIDER=builtin`)
- **Default mode**—no API key or internet access required.
- Synthesizes exact instructions directly from approved articles with 100% compliance.

### 2. OpenAI Integration (`AI_PROVIDER=openai`)
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
```

### 3. Google Gemini Integration (`AI_PROVIDER=gemini`)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```

### 4. Local Ollama Integration (`AI_PROVIDER=ollama`)
Run on-device inference using Llama 3.2 3B:
```bash
ollama run llama3.2:3b
```
Configure `.env`:
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```
*(The system automatically detects if Ollama is offline and gracefully falls back to the built-in grounded engine.)*

---

## 🗄️ Database Setup & Supabase Migration

SupportMind AI operates in two interchangeable modes:

### Local Zero-Friction Mode (Default)
Stores data with ACID persistence in `server/data/db.json` with 24 pre-seeded articles and initial test records. Zero cloud setup needed.

### Supabase / PostgreSQL Mode (Production)
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/migrations/20261030_init.sql` and run it.
4. Set `.env`:
   ```env
   DATABASE_MODE=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 🧪 Automated Evaluation Suite

SupportMind AI includes an in-app and CLI evaluation runner verifying the 10 hackathon test questions:

### Run from CLI:
```bash
npm run test:api
```

### Run from the Web App:
1. Open the application at `http://localhost:5173`.
2. Click **"Evaluation Suite"** in the top navigation bar.
3. Click **"Run Full Evaluation Suite"** to watch live verification across all 11 test cases with latency and source attribution proof.

---

## 🌐 Production Deployment

The project is fully deployed on **Vercel** as a unified full-stack application (React 18 frontend + Express Serverless Functions):

- **Live Production URL:** [https://supportmind-ai-tau.vercel.app](https://supportmind-ai-tau.vercel.app)
- **Deployment Strategy:** Vercel Serverless Functions (`api/index.ts`, `api/[...path].ts`) handle all `/api/*` REST endpoints with sub-second cold starts.
- **Frontend SPA Routing:** Vite production build outputting to `client/dist` with seamless SPA routing rewrites.
- **Data Persistence:** Self-contained persistent database with automated pre-seeding across all 8 customer support categories and 24 articles.

### To Deploy Your Own Instance:
```bash
# Push to your GitHub repository
git push origin main

# Deploy to Vercel with zero config
npx vercel --prod
```

---

## 📄 License & Hackathon Attribution

Built for the Student Hackathon Challenge (Problem Statement ID: **HACK-P380**).  
Released under the [MIT License](LICENSE).
