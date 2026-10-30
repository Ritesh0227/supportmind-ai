-- ==========================================================
-- SupportMind AI - PostgreSQL Schema & Supabase Migrations
-- Problem Statement ID: HACK-P380
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ARTICLE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.article_categories (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'HelpCircle',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id VARCHAR(100) NOT NULL REFERENCES public.article_categories(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    views_count INTEGER NOT NULL DEFAULT 0,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    not_helpful_count INTEGER NOT NULL DEFAULT 0,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
    id VARCHAR(100) PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Support Conversation',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id VARCHAR(100) PRIMARY KEY,
    conversation_id VARCHAR(100) NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]'::jsonb,
    is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
    latency_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id VARCHAR(100) PRIMARY KEY,
    message_id VARCHAR(100) NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    conversation_id VARCHAR(100) NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    rating VARCHAR(20) NOT NULL CHECK (rating IN ('helpful', 'not_helpful')),
    comment TEXT,
    user_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE SEARCH & RETRIEVAL
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON public.conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_feedback_message ON public.feedback(message_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Categories RLS: Public read-only
CREATE POLICY "Public categories are readable by everyone"
ON public.article_categories FOR SELECT USING (true);

-- Articles RLS: Published articles readable by anyone; modifications restricted to admin
CREATE POLICY "Public can view published articles"
ON public.articles FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can manage all articles"
ON public.articles FOR ALL
USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Conversations RLS: Public insert and read by session
CREATE POLICY "Anyone can create conversations"
ON public.conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view their conversation"
ON public.conversations FOR SELECT USING (true);

-- Messages RLS: Public insert and read
CREATE POLICY "Anyone can insert messages"
ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
ON public.messages FOR SELECT USING (true);

-- Feedback RLS: Anyone can submit feedback; only admins can list all
CREATE POLICY "Anyone can submit feedback"
ON public.feedback FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view feedback"
ON public.feedback FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- SEED 8 MANDATORY CATEGORIES
INSERT INTO public.article_categories (id, slug, name, description, icon, display_order)
VALUES
  ('cat-account-mgmt', 'account-management', 'Account Management', 'Manage your profile, password, security settings, and notifications.', 'UserCheck', 1),
  ('cat-billing-payments', 'billing-and-payments', 'Billing and Payments', 'Invoices, payment methods, transaction failures, and billing history.', 'CreditCard', 2),
  ('cat-orders', 'orders', 'Orders', 'Order tracking, order modifications, cancellations, and order status.', 'Package', 3),
  ('cat-shipping-delivery', 'shipping-and-delivery', 'Shipping and Delivery', 'Shipping timeframes, carrier tracking, lost packages, and international delivery.', 'Truck', 4),
  ('cat-returns-refunds', 'returns-and-refunds', 'Returns and Refunds', 'Return eligibility, return labels, refund processing timeframes, and policies.', 'RefreshCw', 5),
  ('cat-products', 'products', 'Products', 'Product specifications, compatibility, manuals, and warranty claims.', 'Layers', 6),
  ('cat-technical-support', 'technical-support', 'Technical Support', 'Troubleshooting website errors, browser issues, API integration, and performance.', 'Terminal', 7),
  ('cat-privacy-security', 'privacy-and-security', 'Privacy and Security', 'Data protection policies, GDPR/CCPA rights, data exports, and account deletion.', 'ShieldCheck', 8)
ON CONFLICT (id) DO NOTHING;
