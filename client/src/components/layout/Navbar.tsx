// client/src/components/layout/Navbar.tsx
import React from 'react';
import { Bot, Sparkles, LayoutDashboard, HelpCircle, CheckCircle2, Shield } from 'lucide-react';

interface NavbarProps {
  currentView: 'customer' | 'admin';
  onViewChange: (view: 'customer' | 'admin') => void;
  onOpenChat: () => void;
  onOpenTestSuite: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenChat,
  onOpenTestSuite,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('customer')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                SupportMind<span className="text-blue-600">.ai</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                HACK-P380
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">AI Customer Support Knowledge System</p>
          </div>
        </div>

        {/* Center Links (Customer View) */}
        {currentView === 'customer' && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <a href="#categories" className="hover:text-blue-600 transition-colors">Categories</a>
            <a href="#articles" className="hover:text-blue-600 transition-colors">Browse Articles</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQs</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Test Suite Button (Hackathon Highlight) */}
          <button
            onClick={onOpenTestSuite}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm"
            title="Run Hackathon 10 Test Questions Evaluation"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Evaluation Suite</span>
            <span className="sm:hidden">Tests</span>
          </button>

          {/* Ask AI button */}
          <button
            onClick={onOpenChat}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 shadow-sm shadow-blue-500/25 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ask AI Assistant</span>
          </button>

          {/* Portal Switcher Toggle */}
          <div className="border-l border-slate-200 pl-2 sm:pl-3 ml-1">
            <button
              onClick={() => onViewChange(currentView === 'customer' ? 'admin' : 'customer')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {currentView === 'admin' ? (
                <>
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Customer View</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
