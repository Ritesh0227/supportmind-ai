// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { HomePage } from './components/pages/HomePage.js';
import { KnowledgeBasePage } from './components/pages/KnowledgeBasePage.js';
import { ArticleDetailPage } from './components/pages/ArticleDetailPage.js';
import { ChatPage } from './components/pages/ChatPage.js';
import { AdminLoginPage } from './components/pages/AdminLoginPage.js';
import { AdminPortal } from './components/pages/AdminPortal.js';
import { ChatWidget } from './components/chat/ChatWidget.js';
import { TestSuiteModal } from './components/testsuite/TestSuiteModal.js';
import { Article, ArticleCategory, Product, AdminUser, AppView } from './types.js';
import { api } from './services/api.js';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<AppView>('home');
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Filters for Knowledge Base
  const [kbInitialCategory, setKbInitialCategory] = useState<string | null>(null);
  const [kbInitialSearch, setKbInitialSearch] = useState<string>('');

  // Chat query
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('supportmind_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null);

  // Load knowledge base data with auto-retry for cloud cold starts
  const loadData = async (isRetry = false) => {
    if (!isRetry) setLoading(true);
    try {
      const [cats, prods, arts] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getArticles({ status: 'published' }),
      ]);
      setCategories(cats);
      setProducts(prods);
      setArticles(arts);
      setConnectionNotice(null);
    } catch (err: any) {
      console.warn('Backend connection notice (server may be waking up):', err);
      setConnectionNotice('Cloud backend is connecting (free-tier servers may take a few moments to spin up)...');
      // Auto retry after 5s if still empty
      if (!isRetry) {
        setTimeout(() => {
          loadData(true);
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Validate admin token on mount
    const token = localStorage.getItem('supportmind_admin_token');
    if (token) {
      api.getAdminProfile()
        .then((res) => {
          setAdminUser(res.user);
          localStorage.setItem('supportmind_admin_user', JSON.stringify(res.user));
        })
        .catch(() => {
          localStorage.removeItem('supportmind_admin_token');
          localStorage.removeItem('supportmind_admin_user');
          setAdminUser(null);
        });
    }
  }, []);

  // Navigation handlers
  const handleNavigateToHome = () => {
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToKnowledgeBase = (categoryId?: string, search?: string) => {
    setKbInitialCategory(categoryId || null);
    setKbInitialSearch(search || '');
    setActivePage('knowledge-base');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToArticle = (article: Article) => {
    setSelectedArticle(article);
    setActivePage('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSourceArticle = async (slugOrId: string) => {
    try {
      const { article } = await api.getArticle(slugOrId);
      handleNavigateToArticle(article);
    } catch {
      const found = articles.find((a) => a.slug === slugOrId || a.id === slugOrId);
      if (found) handleNavigateToArticle(found);
    }
  };

  const handleNavigateToChat = (query?: string) => {
    setChatInitialQuery(query);
    setActivePage('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: AppView) => {
    if (page.startsWith('admin')) {
      if (!adminUser) {
        setActivePage('admin-login');
      } else {
        setActivePage(page);
      }
    } else {
      setActivePage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (user: AdminUser) => {
    setAdminUser(user);
    setActivePage('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    api.adminLogout();
    localStorage.removeItem('supportmind_admin_token');
    localStorage.removeItem('supportmind_admin_user');
    setAdminUser(null);
    setActivePage('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white font-sans antialiased text-slate-900">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        adminUser={adminUser}
        onNavigate={handleNavigate}
        onOpenTestSuite={() => setIsTestSuiteOpen(true)}
        onLogout={handleAdminLogout}
      />

      {/* Cloud Backend Reconnecting / Cold-Start Banner */}
      {connectionNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{connectionNotice}</span>
          </div>
          <button
            onClick={() => loadData(true)}
            className="px-2.5 py-0.5 rounded bg-amber-200 hover:bg-amber-300 font-semibold text-amber-900 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main View Switcher */}
      <main className="flex-1">
        {/* Page 1: Home Page */}
        {activePage === 'home' && (
          <HomePage
            categories={categories}
            articles={articles}
            onNavigateToKnowledgeBase={handleNavigateToKnowledgeBase}
            onNavigateToArticle={handleNavigateToArticle}
            onNavigateToChat={handleNavigateToChat}
          />
        )}

        {/* Page 2: Knowledge Base */}
        {activePage === 'knowledge-base' && (
          <KnowledgeBasePage
            articles={articles}
            categories={categories}
            products={products}
            initialCategoryId={kbInitialCategory}
            initialSearchQuery={kbInitialSearch}
            onSelectArticle={handleNavigateToArticle}
            onAskAi={handleNavigateToChat}
          />
        )}

        {/* Page 3: Article Details */}
        {activePage === 'article-detail' && selectedArticle && (
          <ArticleDetailPage
            article={selectedArticle}
            categories={categories}
            onBackToKnowledgeBase={() => setActivePage('knowledge-base')}
            onSelectRelatedArticle={handleNavigateToArticle}
            onAskAi={handleNavigateToChat}
          />
        )}

        {/* Page 4: AI Customer Support Chat */}
        {activePage === 'chat' && (
          <ChatPage
            initialQuery={chatInitialQuery}
            onOpenSourceArticle={handleOpenSourceArticle}
          />
        )}

        {/* Page 5: Admin Login */}
        {activePage === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={handleAdminLogin}
            onCancelToHome={handleNavigateToHome}
          />
        )}

        {/* Pages 6, 7, 8: Admin Console (Dashboard, Manage Articles, Customer Questions & Feedback) */}
        {activePage.startsWith('admin') && activePage !== 'admin-login' && (
          adminUser ? (
            <AdminPortal
              adminUser={adminUser}
              categories={categories}
              products={products}
              initialTab={
                activePage === 'admin-articles'
                  ? 'articles'
                  : activePage === 'admin-questions'
                  ? 'questions'
                  : activePage === 'admin-feedback'
                  ? 'feedback'
                  : 'dashboard'
              }
              onLogout={handleAdminLogout}
              onOpenArticleDetail={handleNavigateToArticle}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={handleAdminLogin}
              onCancelToHome={handleNavigateToHome}
              redirectNotice="Administrator authentication required to access this area."
            />
          )
        )}
      </main>

      {/* Footer (Rendered on customer-facing pages) */}
      {!activePage.startsWith('admin') && <Footer />}

      {/* Floating Chat Quick-Access Widget (Can be toggled from any customer page) */}
      {!activePage.startsWith('admin') && activePage !== 'chat' && (
        <ChatWidget
          isOpen={isChatWidgetOpen}
          onClose={() => setIsChatWidgetOpen(false)}
          onOpen={() => setIsChatWidgetOpen(true)}
          initialQuery={chatInitialQuery}
          onOpenSourceArticle={handleOpenSourceArticle}
        />
      )}

      {/* Hackathon Automated Evaluation Benchmark Suite Modal */}
      {isTestSuiteOpen && (
        <TestSuiteModal
          onClose={() => setIsTestSuiteOpen(false)}
          onTestInChat={(q) => handleNavigateToChat(q)}
        />
      )}
    </div>
  );
};

export default App;
