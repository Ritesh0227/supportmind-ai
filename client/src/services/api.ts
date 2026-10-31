// client/src/services/api.ts
import {
  Article,
  ArticleCategory,
  DashboardStats,
  FeedbackRecord,
  SystemConfig,
  TestQuestion,
  TestRunResult,
  Product,
  AdminUser,
} from '../types.js';

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('supportmind_admin_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async adminLogin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Authentication failed');
    }
    return data;
  },

  async adminLogout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch {
      // Ignored
    }
  },

  async getAdminProfile(): Promise<{ user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('supportmind_admin_token') || ''}`,
      },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

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

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products;
  },

  // Articles
  async getArticles(params?: {
    category_id?: string;
    product?: string;
    status?: string;
    search?: string;
  }): Promise<Article[]> {
    const query = new URLSearchParams();
    if (params?.category_id) query.set('category_id', params.category_id);
    if (params?.product) query.set('product', params.product);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/articles?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    return data.articles;
  },

  async getArticle(slugOrId: string): Promise<{
    article: Article;
    category: ArticleCategory | null;
    relatedArticles: Article[];
  }> {
    const res = await fetch(`${API_BASE}/articles/${slugOrId}`);
    if (!res.ok) throw new Error('Failed to fetch article details');
    return res.json();
  },

  async createArticle(payload: {
    title: string;
    category_id: string;
    product?: string;
    content: string;
    excerpt?: string;
    troubleshooting?: string;
    keywords?: string[];
    tags?: string[];
    status?: string;
  }): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to create article');
    }
    const data = await res.json();
    return data.article;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to update article');
    }
    const data = await res.json();
    return data.article;
  },

  async deleteArticle(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to delete article');
    }
  },

  async archiveArticle(id: string): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/${id}/archive`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to toggle archive status');
    }
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
