// client/src/components/layout/Hero.tsx
import React from 'react';
import { Search, Sparkles, ShieldCheck, Check, BookOpen } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSuggestedClick: (query: string) => void;
  onOpenChatWithQuery: (query: string) => void;
}

const POPULAR_QUERIES = [
  'How do I reset my password?',
  'Where can I find my invoice?',
  'How do I track my order?',
  'Can I cancel my order?',
  'How do I request a return?',
  'Why was my payment declined?',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSuggestedClick,
  onOpenChatWithQuery,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200/60">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-r from-blue-100/40 via-violet-100/40 to-indigo-100/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse-subtle" />
          <span>Grounded AI Knowledge Engine & Self-Service Portal</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none mb-4">
          How can we help you today?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Access verified company documentation, step-by-step troubleshooting, or ask our intelligent AI assistant for grounded answers with transparent citations.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <div className="pl-4 sm:pl-5 text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search support articles, billing, shipping policies..."
              className="w-full py-4 px-3 sm:px-4 text-sm sm:text-base text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="pr-3 text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear
              </button>
            )}
            <div className="pr-2 sm:pr-3">
              <button
                onClick={() => onOpenChatWithQuery(searchQuery || 'How do I contact customer support?')}
                className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Query Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-8">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center">
            <BookOpen className="h-3 w-3 mr-1" /> Common topics:
          </span>
          {POPULAR_QUERIES.map((query) => (
            <button
              key={query}
              onClick={() => onSuggestedClick(query)}
              className="text-xs px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all font-medium shadow-2xs"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 max-w-2xl mx-auto text-xs text-slate-500 font-medium">
          <div className="flex items-center justify-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Approved Knowledge Only</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Check className="h-4 w-4 text-blue-600" />
            <span>Direct Article Citations</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-violet-600" />
            <span>Anti-Hallucination Safe Fallback</span>
          </div>
        </div>
      </div>
    </section>
  );
};
