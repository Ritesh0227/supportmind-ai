// client/src/components/pages/HomePage.tsx
import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Eye,
  ThumbsUp,
  TrendingUp,
  FileText,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Article, ArticleCategory } from '../../types.js';
import { FaqSection } from '../knowledge/FaqSection.js';
import { ContactSection } from '../knowledge/ContactSection.js';

interface HomePageProps {
  categories: ArticleCategory[];
  articles: Article[];
  onNavigateToKnowledgeBase: (categoryId?: string, search?: string) => void;
  onNavigateToArticle: (article: Article) => void;
  onNavigateToChat: (query?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  articles,
  onNavigateToKnowledgeBase,
  onNavigateToArticle,
  onNavigateToChat,
}) => {
  const [searchInput, setSearchInput] = useState('');

  // Top trending / frequently accessed articles
  const popularArticles = [...articles]
    .filter((a) => a.status === 'published')
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigateToKnowledgeBase(undefined, searchInput.trim());
    } else {
      onNavigateToKnowledgeBase();
    }
  };

  const sampleQuestions = [
    'How do I reset my password?',
    'Where can I find my invoice?',
    'How do I track my order?',
    'Why was my payment declined?',
    'How do I request a return?',
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-xs animate-in fade-in duration-300">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Problem ID: HACK-P380 • Grounded Knowledge Retrieval</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Enterprise AI Customer Support <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Knowledge System
            </span>
          </h1>

          {/* Subheading / Description */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Instant, verified support answers grounded strictly in approved company documentation.
            Explore 24+ help articles, track orders, resolve billing, or chat with our grounded AI assistant
            with transparent source citations.
          </p>

          {/* Search Form */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search approved articles, troubleshooting steps, or topics..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-lg shadow-blue-900/5 focus:border-blue-600 focus:outline-hidden text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium transition-all"
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
              >
                <span>Search</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Prompt Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400 font-semibold mr-1">Popular Questions:</span>
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToChat(q)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-blue-50 border border-slate-200/80 text-slate-600 hover:text-blue-600 transition-all hover:border-blue-200 shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Key Guardrail Highlights */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs text-left">
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold text-slate-900">100% Grounded</span>
              </div>
              <p className="text-[11px] text-slate-500">Zero unsupported facts. Strict citation gating.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs text-left">
              <div className="flex items-center space-x-2 text-emerald-600 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold text-slate-900">Verified Citations</span>
              </div>
              <p className="text-[11px] text-slate-500">Every response references approved articles.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs text-left">
              <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-bold text-slate-900">Safe Fallback</span>
              </div>
              <p className="text-[11px] text-slate-500">Clear escalation when info is unavailable.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs text-left">
              <div className="flex items-center space-x-2 text-violet-600 mb-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-bold text-slate-900">Live Feedback</span>
              </div>
              <p className="text-[11px] text-slate-500">Instant thumbs-up/down & audit comments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Support Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Standard Support Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse by Support Domain
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Approved knowledge articles categorized across 8 enterprise support departments.
            </p>
          </div>

          <button
            onClick={() => onNavigateToKnowledgeBase()}
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group whitespace-nowrap"
          >
            <span>View All Knowledge Articles</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = articles.filter((a) => a.category_id === cat.id && a.status === 'published').length;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigateToKnowledgeBase(cat.id)}
                className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                      {count} {count === 1 ? 'Article' : 'Articles'}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                  <span>Explore category</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Accessed Help Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trending & Frequently Accessed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Customer Solutions
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Verified answers with diagnostic steps frequently searched by customers.
            </p>
          </div>

          <button
            onClick={() => onNavigateToChat()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open AI Support Chat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularArticles.map((art) => {
            const cat = categories.find((c) => c.id === art.category_id);
            return (
              <div
                key={art.id}
                onClick={() => onNavigateToArticle(art)}
                className="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {cat?.name || 'Knowledge Article'}
                    </span>
                    {art.product && (
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {art.product}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center space-x-1">
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      <span>{art.views_count} views</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{art.helpful_count}</span>
                    </span>
                  </div>
                  <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Read →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ask Support / Open Chat Call-to-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.25),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Grounded Conversational Assistant</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Can't find what you need? <br />
              Ask our Grounded AI Assistant.
            </h2>

            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Ask natural-language questions and receive concise, step-by-step solutions backed by
              verifiable article citations. If information is not in our knowledge base, we'll
              transparently connect you with human customer support.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateToChat()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open AI Support Chat</span>
              </button>

              <button
                onClick={() => onNavigateToKnowledgeBase()}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Browse All 24 Articles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <FaqSection onAskAi={(q) => onNavigateToChat(q)} />

      {/* Contact Support Escalation Desk */}
      <ContactSection />
    </div>
  );
};
