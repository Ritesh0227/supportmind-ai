// client/src/components/layout/Footer.tsx
import React from 'react';
import { Bot, Shield, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Bot className="h-4 w-4" />
              </div>
              <span className="font-bold text-base tracking-tight">SupportMind AI</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                HACK-P380
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Enterprise full-stack AI customer support knowledge system designed for college hackathons and portfolio presentations. Eliminates repetitive support queries with strict grounded retrieval.
            </p>
            <div className="flex items-center space-x-4 pt-1 text-slate-400">
              <span className="inline-flex items-center space-x-1">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>GDPR & CCPA Compliant</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Systems Operational</span>
              </span>
            </div>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Tech Stack</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>React 18 & TypeScript</li>
              <li>Tailwind CSS Design System</li>
              <li>PostgreSQL & Supabase Auth</li>
              <li>Server-Side Grounded RAG</li>
              <li>Multi-Provider: OpenAI / Gemini / Ollama</li>
            </ul>
          </div>

          {/* Hackathon Specs */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Submission Info</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Problem ID: HACK-P380</li>
              <li>Category: Customer Support</li>
              <li>24+ Seed Support Articles</li>
              <li>10+ Automated Test Inquiries</li>
              <li>Evaluation & Feedback Matrix</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3">
          <p>© 2026 SupportMind AI. Built for the Student Hackathon Challenge.</p>
          <div className="flex items-center space-x-2">
            <span>Engineering with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>and Grounded Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
