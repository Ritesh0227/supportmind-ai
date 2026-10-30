// client/src/services/api.ts
import {
  Article,
  ArticleCategory,
  DashboardStats,
  FeedbackRecord,
  SystemConfig,
  TestQuestion,
  TestRunResult,
} from '../types.js';

const API_BASE = '/api';

export const api = {
  // Categories
  async getCategories(): Promise<ArticleCategory[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.categories;
  },

  async getCategory(slug: string): Promise<{ category: ArticleCategory; articles: Article[] }> {
    const res = await fetch(`${API_BASE}/categories/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
  },

  // Articles
  async getArticles(params?: { category_id?: string; status?: string; search?: string }): Promise<Article[]> {
    const query = new URLSearchParams();
    if (params?.category_id) query.set('category_id', params.category_id);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/articles?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    return data.articles;
  },

  async getArticle(slugOrId: string): Promise<{ article: Article; category: ArticleCategory | null }> {
    const res = await fetch(`${API_BASE}/articles/${slugOrId}`);
    if (!res.ok) throw new Error('Failed to fetch article details');
    return res.json();
  },

  async createArticle(payload: {
    title: string;
    category_id: string;
    content: string;
    excerpt?: string;
    keywords?: string[];
    tags?: string[];
    status?: string;
  }): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create article');
    const data = await res.json();
    return data.article;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update article');
    const data = await res.json();
    return data.article;
  },

  async archiveArticle(id: string): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/${id}/archive`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle archive status');
    const data = await res.json();
    return data.article;
  },

  async voteArticle(id: string, helpful: boolean): Promise<void> {
    await fetch(`${API_BASE}/articles/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ helpful }),
    });
  },

  // Chat
  async sendChatMessage(payload: {
    sessionId: string;
    query: string;
    conversationId?: string;
    provider?: string;
  }) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to process question');
    return res.json();
  },

  // Feedback
  async submitFeedback(payload: {
    messageId: string;
    conversationId: string;
    rating: 'helpful' | 'not_helpful';
    comment?: string;
    userEmail?: string;
  }): Promise<FeedbackRecord> {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    const data = await res.json();
    return data.feedback;
  },

  async getFeedbackList(): Promise<FeedbackRecord[]> {
    const res = await fetch(`${API_BASE}/feedback`);
    if (!res.ok) throw new Error('Failed to load feedback');
    const data = await res.json();
    return data.feedback;
  },

  // Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    if (!res.ok) throw new Error('Failed to load analytics dashboard');
    const data = await res.json();
    return data.stats;
  },

  // Test Suite
  async getTestQuestions(): Promise<TestQuestion[]> {
    const res = await fetch(`${API_BASE}/test-suite/questions`);
    if (!res.ok) throw new Error('Failed to load test questions');
    const data = await res.json();
    return data.questions;
  },

  async runTestSuite(provider?: string): Promise<TestRunResult> {
    const res = await fetch(`${API_BASE}/test-suite/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });
    if (!res.ok) throw new Error('Automated test evaluation failed');
    return res.json();
  },

  // System Configuration
  async getSystemConfig(): Promise<SystemConfig> {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) throw new Error('Failed to fetch system config');
    return res.json();
  },
};
