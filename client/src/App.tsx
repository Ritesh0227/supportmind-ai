// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.js';
import { Hero } from './components/layout/Hero.js';
import { Footer } from './components/layout/Footer.js';
import { CategoryGrid } from './components/knowledge/CategoryGrid.js';
import { ArticleList } from './components/knowledge/ArticleList.js';
import { ArticleDetailModal } from './components/knowledge/ArticleDetailModal.js';
import { FaqSection } from './components/knowledge/FaqSection.js';
import { ContactSection } from './components/knowledge/ContactSection.js';
import { ChatWidget } from './components/chat/ChatWidget.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { TestSuiteModal } from './components/testsuite/TestSuiteModal.js';
import { Article, ArticleCategory } from './types.js';
import { api } from './services/api.js';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial data load
  const loadKnowledgeBase = async () => {
    try {
      const [cats, arts] = await Promise.all([
        api.getCategories(),
        api.getArticles({ status: 'published' }),
      ]);
      setCategories(cats);
      setArticles(arts);
    } catch (err) {
      console.error('Failed to load initial knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  // Filter articles based on selected category or search query
  const filteredArticles = articles.filter((art) => {
    if (selectedCategoryId && art.category_id !== selectedCategoryId) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        art.keywords.some((k) => k.toLowerCase().includes(q)) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenChatWithQuery = (query: string) => {
    setChatInitialQuery(query);
    setIsChatOpen(true);
  };

  const handleOpenSourceArticle = async (slug: string) => {
    try {
      const { article } = await api.getArticle(slug);
      setSelectedArticle(article);
    } catch {
      // Fallback: look up in local state
      const found = articles.find((a) => a.slug === slug);
      if (found) setSelectedArticle(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenChat={() => {
          setChatInitialQuery(undefined);
          setIsChatOpen(true);
        }}
        onOpenTestSuite={() => setIsTestSuiteOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'customer' ? (
          <>
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSuggestedClick={(q) => {
                setSearchQuery(q);
                handleOpenChatWithQuery(q);
              }}
              onOpenChatWithQuery={handleOpenChatWithQuery}
            />

            {/* 8 Categories Grid */}
            <CategoryGrid
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                const el = document.getElementById('articles');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Verified Support Articles List */}
            <ArticleList
              articles={filteredArticles}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              searchQuery={searchQuery}
              onSelectArticle={(art) => setSelectedArticle(art)}
              onClearFilters={() => {
                setSelectedCategoryId(null);
                setSearchQuery('');
              }}
              onOpenChatWithQuery={handleOpenChatWithQuery}
            />

            {/* FAQs Section */}
            <FaqSection onAskAi={handleOpenChatWithQuery} />

            {/* Contact Support Escalation Section */}
            <ContactSection />
          </>
        ) : (
          /* Admin Dashboard Portal */
          <AdminDashboard
            categories={categories}
            onOpenArticleDetail={(art) => setSelectedArticle(art)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          categories={categories}
          onClose={() => setSelectedArticle(null)}
          onVoteRecorded={() => {
            loadKnowledgeBase();
          }}
        />
      )}

      {/* Hackathon Automated Evaluation Benchmark Modal */}
      {isTestSuiteOpen && (
        <TestSuiteModal
          onClose={() => setIsTestSuiteOpen(false)}
          onTestInChat={(q) => handleOpenChatWithQuery(q)}
        />
      )}

      {/* Interactive AI Chatbot Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
        initialQuery={chatInitialQuery}
        onOpenSourceArticle={handleOpenSourceArticle}
      />
    </div>
  );
};

export default App;
