// client/src/components/layout/Navbar.tsx
import React from 'react';
import {
  Bot,
  Sparkles,
  LayoutDashboard,
  HelpCircle,
  CheckCircle2,
  Lock,
  LogOut,
  BookOpen,
  MessageSquare,
  Home,
  User,
} from 'lucide-react';
import { AdminUser, AppView } from '../../types.js';

interface NavbarProps {
  activePage: AppView;
  adminUser: AdminUser | null;
  onNavigate: (page: AppView) => void;
  onOpenTestSuite: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  adminUser,
  onNavigate,
  onOpenTestSuite,
  onLogout,
}) => {
  const isAdminView = activePage.startsWith('admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                SupportMind<span className="text-blue-600">.ai</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                HACK-P380
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">AI Customer Support Knowledge System</p>
          </div>
        </div>

        {/* Center Links (Customer View Navigation) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-bold text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-colors ${
              activePage === 'home'
                ? 'bg-blue-50 text-blue-700'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('knowledge-base')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-colors ${
              activePage === 'knowledge-base' || activePage === 'article-detail'
                ? 'bg-blue-50 text-blue-700'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Knowledge Base</span>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-colors ${
              activePage === 'chat'
                ? 'bg-blue-50 text-blue-700'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Support Chat</span>
          </button>

          {/* Automated Evaluation Benchmark Suite shortcut */}
          <button
            onClick={onOpenTestSuite}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
            title="Automated 10-Question Benchmark Suite"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Evaluation Suite</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Ask AI Button */}
          <button
            onClick={() => onNavigate('chat')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/20 transition-all hover:scale-102"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
            <span className="sm:hidden">Chat</span>
          </button>

          {/* Admin Navigation Button */}
          <div className="border-l border-slate-200 pl-2 sm:pl-3 ml-1">
            {adminUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors border ${
                    isAdminView
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Admin Console</span>
                  <span className="sm:hidden">Admin</span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign out of Administrator Console"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('admin-login')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors border ${
                  activePage === 'admin-login'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span className="hidden sm:inline">Admin Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
