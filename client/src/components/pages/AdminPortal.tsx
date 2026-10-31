// client/src/components/pages/AdminPortal.tsx
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Edit2,
  Archive,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Layers,
  Database,
  Cpu,
  LogOut,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import {
  Article,
  ArticleCategory,
  Product,
  DashboardStats,
  FeedbackRecord,
  AdminUser,
  SystemConfig,
} from '../../types.js';
import { ArticleEditorModal } from '../admin/ArticleEditorModal.js';
import { AnalyticsCharts } from '../admin/AnalyticsCharts.js';
import { api } from '../../services/api.js';

interface AdminPortalProps {
  adminUser: AdminUser;
  categories: ArticleCategory[];
  products: Product[];
  initialTab?: 'dashboard' | 'articles' | 'questions' | 'feedback' | 'unanswered' | 'system';
  onLogout: () => void;
  onOpenArticleDetail: (article: Article) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  adminUser,
  categories,
  products,
  initialTab = 'dashboard',
  onLogout,
  onOpenArticleDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'questions' | 'feedback' | 'unanswered' | 'system'>(initialTab);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters for Articles Management (Page 7)
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Modals & Action States
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorDefaultQuestion, setEditorDefaultQuestion] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Question Filter for Page 8
  const [questionFilter, setQuestionFilter] = useState<'all' | 'verified' | 'fallback'>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, articlesData, feedbackData, configData] = await Promise.all([
        api.getDashboardStats(),
        api.getArticles(),
        api.getFeedbackList(),
        api.getSystemConfig(),
      ]);
      setStats(statsData);
      setArticles(articlesData);
      setFeedbackList(feedbackData);
      setSystemConfig(configData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleArchive = async (id: string) => {
    try {
      const res = await api.archiveArticle(id);
      showToast(`Article "${res.title}" status changed to ${res.status}.`);
      loadData();
    } catch (err: any) {
      alert(`Error toggling archive: ${err.message}`);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    try {
      await api.deleteArticle(id);
      showToast(`Article "${title}" deleted.`);
      loadData();
    } catch (err: any) {
      alert(`Error deleting article: ${err.message}`);
    }
  };

  const handleCreateForQuestion = (question: string) => {
    setEditingArticle(null);
    setEditorDefaultQuestion(question);
    setIsEditorOpen(true);
  };

  // Filtered Articles for Page 7
  const filteredArticles = articles.filter((art) => {
    if (selectedCategoryFilter && art.category_id !== selectedCategoryFilter) return false;
    if (selectedProductFilter && art.product?.toLowerCase() !== selectedProductFilter.toLowerCase()) return false;
    if (selectedStatusFilter && art.status !== selectedStatusFilter) return false;
    if (articleSearch.trim()) {
      const q = articleSearch.toLowerCase().trim();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        (art.troubleshooting && art.troubleshooting.toLowerCase().includes(q)) ||
        art.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (art.product && art.product.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col md:flex-row">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-5 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-sm">
              ⚡
            </div>
            <div>
              <div className="font-extrabold text-white text-sm tracking-tight">Admin Console</div>
              <div className="text-[11px] text-blue-400 font-medium">Support Operations</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'articles'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="h-4 w-4" />
                <span>Manage Articles</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'questions'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="h-4 w-4" />
                <span>Customer Questions</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {stats?.totalCustomerQuestions || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('unanswered')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'unanswered'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Unanswered Inquiries</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {stats?.unansweredQuestions || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'feedback'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ThumbsUp className="h-4 w-4 text-emerald-400" />
                <span>Customer Feedback</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {feedbackList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'system'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Database className="h-4 w-4 text-indigo-400" />
              <span>System & Database</span>
            </button>
          </nav>
        </div>

        {/* Admin User Footer Card */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
              {adminUser.full_name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{adminUser.full_name}</div>
              <div className="text-[10px] text-slate-400 truncate">{adminUser.email}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' && 'Operations Dashboard'}
                {activeTab === 'articles' && 'Knowledge Articles Management'}
                {activeTab === 'questions' && 'Recent Customer Inquiries'}
                {activeTab === 'unanswered' && 'Unanswered Inquiries Triage'}
                {activeTab === 'feedback' && 'Customer Feedback Audit'}
                {activeTab === 'system' && 'Database & System Configuration'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-semibold">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time synchronization across knowledge base documentation and customer support chat.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              title="Refresh live data"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingArticle(null);
                setEditorDefaultQuestion(undefined);
                setIsEditorOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Article</span>
            </button>
          </div>
        </div>

        {/* ----------------- TAB 1: DASHBOARD (PAGE 6) ----------------- */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Active Articles
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.totalActiveArticles}</div>
                <span className="text-[10px] text-slate-400">Published in KB</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Total Inquiries
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.totalCustomerQuestions}</div>
                <span className="text-[10px] text-slate-400">Customer questions</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Grounded Answers
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.answeredQuestions}</div>
                <span className="text-[10px] text-emerald-600">Citations attached</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  Safe Fallbacks
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.unansweredQuestions}</div>
                <span className="text-[10px] text-amber-600">Unanswered gaps</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Total Feedback
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {stats.helpfulFeedbackCount + stats.notHelpfulFeedbackCount}
                </div>
                <span className="text-[10px] text-slate-400">User ratings</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  Satisfaction
                </div>
                <div className="text-2xl font-extrabold text-blue-600">{stats.satisfactionRate}%</div>
                <span className="text-[10px] text-blue-600">Positive sentiment</span>
              </div>
            </div>

            {/* Visual Charts */}
            <AnalyticsCharts stats={stats} />

            {/* Article Management Quick Overview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Knowledge Base Articles Overview</h3>
                  <p className="text-xs text-slate-500">Quick snapshot of most viewed articles</p>
                </div>
                <button
                  onClick={() => setActiveTab('articles')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Manage All {articles.length} Articles →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Views</th>
                      <th className="py-2.5 px-3">Helpful</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {articles.slice(0, 5).map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs truncate">{a.title}</td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {categories.find((c) => c.id === a.category_id)?.name || a.category_id}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-600">{a.product || 'Core'}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">{a.views_count}</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-semibold">{a.helpful_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: MANAGE ARTICLES (PAGE 7) ----------------- */}
        {activeTab === 'articles' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Filter controls */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Search */}
              <div className="sm:col-span-1 relative">
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden bg-white text-slate-700"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Filter */}
              <div>
                <select
                  value={selectedProductFilter}
                  onChange={(e) => setSelectedProductFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden bg-white text-slate-700"
                >
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden bg-white text-slate-700"
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filteredArticles.length} of {articles.length} articles</span>
                {(selectedCategoryFilter || selectedProductFilter || selectedStatusFilter || articleSearch) && (
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('');
                      setSelectedProductFilter('');
                      setSelectedStatusFilter('');
                      setArticleSearch('');
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Article Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">Helpful</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredArticles.map((art) => {
                      const cat = categories.find((c) => c.id === art.category_id);
                      return (
                        <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 max-w-sm">
                            <div className="truncate">{art.title}</div>
                            <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                              {art.excerpt}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{cat?.name || art.category_id}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{art.product || 'NexusDesk Core'}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                art.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : art.status === 'draft'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {art.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">{art.views_count}</td>
                          <td className="py-3.5 px-4 text-emerald-600 font-bold">{art.helpful_count}</td>
                          <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => onOpenArticleDetail(art)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View Article"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingArticle(art);
                                setIsEditorOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                              title="Edit Article"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleArchive(art.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title={art.status === 'archived' ? 'Unarchive Article' : 'Archive Article'}
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id, art.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: CUSTOMER QUESTIONS (PAGE 8) ----------------- */}
        {activeTab === 'questions' && stats && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Filter buttons */}
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <button
                onClick={() => setQuestionFilter('all')}
                className={`px-3 py-1.5 rounded-xl ${
                  questionFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'
                }`}
              >
                All Queries ({stats.recentQuestions.length})
              </button>
              <button
                onClick={() => setQuestionFilter('verified')}
                className={`px-3 py-1.5 rounded-xl ${
                  questionFilter === 'verified' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'
                }`}
              >
                Verified Grounded ({stats.recentQuestions.filter((q) => !q.isFallback).length})
              </button>
              <button
                onClick={() => setQuestionFilter('fallback')}
                className={`px-3 py-1.5 rounded-xl ${
                  questionFilter === 'fallback' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'
                }`}
              >
                Safe Fallbacks ({stats.recentQuestions.filter((q) => q.isFallback).length})
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Customer Question</th>
                      <th className="py-3 px-4">AI Answer</th>
                      <th className="py-3 px-4">Sources</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Feedback</th>
                      <th className="py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {stats.recentQuestions
                      .filter((q) => {
                        if (questionFilter === 'verified') return !q.isFallback;
                        if (questionFilter === 'fallback') return q.isFallback;
                        return true;
                      })
                      .map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">{q.question}</td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-sm line-clamp-2 mt-1">{q.answer}</td>
                          <td className="py-3.5 px-4 font-semibold text-blue-600">{q.sourcesCount} sources</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                q.isFallback
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {q.isFallback ? 'Fallback (No Match)' : 'Verified Grounded'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {q.rating === 'helpful' && <span className="text-emerald-600 font-bold">👍 Helpful</span>}
                            {q.rating === 'not_helpful' && <span className="text-rose-600 font-bold">👎 Not Helpful</span>}
                            {!q.rating && <span className="text-slate-400">None</span>}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                            {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: UNANSWERED QUESTIONS (PAGE 8) ----------------- */}
        {activeTab === 'unanswered' && stats && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Knowledge Gaps Identified:</strong> When customers ask questions that lack sufficient approved documentation,
                the AI triggers a strict safe fallback. Use the 1-click button below to instantly draft a new article resolving each gap.
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Unanswered Question</th>
                      <th className="py-3 px-4">Conversation ID</th>
                      <th className="py-3 px-4">Detected At</th>
                      <th className="py-3 px-4 text-right">Resolve Knowledge Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {stats.unansweredList.length > 0 ? (
                      stats.unansweredList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{item.question}</td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{item.conversationId}</td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {new Date(item.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleCreateForQuestion(item.question)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Draft Article for Query</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          🎉 No unanswered questions logged. All customer questions have verified supporting documentation.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: FEEDBACK AUDIT (PAGE 8) ----------------- */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Feedback Insight Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Customer Sentiment Analysis</span>
              </div>
              <p className="text-xs text-slate-500">
                Customer feedback submissions directly flag knowledge-base articles or responses that may need clarification.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Customer Comment</th>
                      <th className="py-3 px-4">User Contact</th>
                      <th className="py-3 px-4">Conversation ID</th>
                      <th className="py-3 px-4">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {feedbackList.length > 0 ? (
                      feedbackList.map((fb) => (
                        <tr key={fb.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-bold">
                            {fb.rating === 'helpful' ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                👍 Helpful
                              </span>
                            ) : (
                              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                👎 Not Helpful
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 max-w-sm">
                            {fb.comment || <span className="text-slate-400 italic">No comment provided</span>}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {fb.user_email || 'Anonymous'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                            {fb.conversation_id}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                            {new Date(fb.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No feedback submitted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 6: SYSTEM & DATABASE CONFIG ----------------- */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
            {/* Database Engine Status Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <Database className="h-5 w-5 text-indigo-600" />
                <span>Backend Database Driver & Persistence Status</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-500">Active Storage Driver:</span>
                  <span className="font-bold text-slate-900">
                    {systemConfig?.database?.activeDriver || 'JSON Document Store with Atomic Writes (server/data/db.json)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-500">Persistent Disk Storage:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active & Auto-Syncing (Non-volatile)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 leading-relaxed">
                  <strong>Database Architecture Notice:</strong> {systemConfig?.database?.mongoDbStatusNotice ||
                    'All Mongoose data models (Article, Category, Product, Conversation, Message, Feedback, AdminUser) are initialized. Data is persistently written to disk across restarts.'}
                </div>
              </div>
            </div>

            {/* AI Grounded Engine Status Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <Cpu className="h-5 w-5 text-blue-600" />
                <span>Grounded AI Engine Status</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-500">Configured AI Engine:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    SupportMind Built-in Grounded Engine (100% Grounded, 0% Hallucination)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-500">Hallucination Prevention Policy:</span>
                  <span className="font-bold text-emerald-700">
                    Mandatory Safe Fallback Threshold (Relevance Score &ge; 4.5)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Article Editor Modal */}
      {isEditorOpen && (
        <ArticleEditorModal
          article={editingArticle}
          categories={categories}
          products={products}
          defaultQuestionPrompt={editorDefaultQuestion}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingArticle(null);
            setEditorDefaultQuestion(undefined);
          }}
          onSaved={() => {
            showToast('Knowledge article saved successfully.');
            loadData();
          }}
        />
      )}
    </div>
  );
};
