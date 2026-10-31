// client/src/components/pages/AdminLoginPage.tsx
import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AdminUser } from '../../types.js';
import { api } from '../../services/api.js';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onCancelToHome: () => void;
  redirectNotice?: string;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onCancelToHome,
  redirectNotice,
}) => {
  const [email, setEmail] = useState('admin@supportmind.ai');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your administrator email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMessage('Please provide a valid administrator email address format (e.g., admin@supportmind.ai).');
      return;
    }

    setLoading(true);

    try {
      const response = await api.adminLogin(email.trim(), password);
      // Save session token and user profile in localStorage
      localStorage.setItem('supportmind_admin_token', response.token);
      localStorage.setItem('supportmind_admin_user', JSON.stringify(response.user));
      // Notify parent to redirect directly to admin dashboard
      onLoginSuccess(response.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@supportmind.ai');
    setPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 animate-in fade-in duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrator Sign In
          </h2>
          <p className="text-xs text-slate-500">
            Secure access to maintain approved knowledge documentation, triage unanswered questions, and review customer sentiment.
          </p>
        </div>

        {/* Protection / Redirect Notice if accessed without logging in */}
        {redirectNotice && !errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2 animate-in fade-in">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="flex-1 font-medium">{redirectNotice}</div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@supportmind.ai"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-sm text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Default: admin123</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-sm text-slate-900 font-medium placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Filler Card for Hackathon Judges */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Working Demo Admin Credentials</span>
            </span>
            <button
              onClick={handleFillDemoCredentials}
              className="text-blue-700 hover:text-blue-900 font-bold underline text-[11px]"
            >
              Autofill Credentials
            </button>
          </div>
          <p className="text-[11px] text-blue-800/80 leading-relaxed">
            Email: <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono font-bold">admin@supportmind.ai</code> <br />
            Password: <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono font-bold">admin123</code> (or <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono font-bold">Admin@SupportMind2026</code>)
          </p>
        </div>

        {/* Back to Home Link */}
        <div className="text-center pt-2">
          <button
            onClick={onCancelToHome}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
          >
            ← Return to Customer Knowledge Portal
          </button>
        </div>
      </div>
    </div>
  );
};
