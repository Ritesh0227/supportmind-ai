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

// Resolve API base URL:
// 1. Explicit environment variable (VITE_API_URL) for cloud deployment (e.g. Render backend)
// 2. Fallback to '/api' (proxied via Vite dev server or Netlify redirects)
const resolveApiBase = (): string => {
  const envUrl = ((import.meta as any).env?.VITE_API_URL as string)?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return '/api';
};

export const API_BASE = resolveApiBase();

/**
 * Safe fetch helper that handles HTML 404/redirect responses gracefully
 */
async function safeJsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`API returned invalid response (status ${res.status}). Server may be waking up.`);
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP error ${res.status}`);
  }
  return data as T;
}

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
    return safeJsonFetch<{ token: string; user: AdminUser }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  async adminLogout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch {
      // Ignored
    }
  },

  async getAdminProfile(): Promise<{ user: AdminUser }> {
    return safeJsonFetch<{ user: AdminUser }>(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('supportmind_admin_token') || ''}`,
      },
    });
  },

  // Categories
  async getCategories(): Promise<ArticleCategory[]> {
    const data = await safeJsonFetch<{ categories: ArticleCategory[] }>(`${API_BASE}/categories`);
    return data.categories || [];
  },

  async getCategory(slug: string): Promise<{ category: ArticleCategory; articles: Article[] }> {
    return safeJsonFetch<{ category: ArticleCategory; articles: Article[] }>(`${API_BASE}/categories/${slug}`);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const data = await safeJsonFetch<{ products: Product[] }>(`${API_BASE}/products`);
    return data.products || [];
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

    const data = await safeJsonFetch<{ articles: Article[] }>(`${API_BASE}/articles?${query.toString()}`);
    return data.articles || [];
  },

  async getArticle(slugOrId: string): Promise<{
    article: Article;
    category: ArticleCategory | null;
    relatedArticles: Article[];
  }> {
    return safeJsonFetch<{
      article: Article;
      category: ArticleCategory | null;
      relatedArticles: Article[];
    }>(`${API_BASE}/articles/${slugOrId}`);
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
    return safeJsonFetch<any>(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  // Feedback
  async submitFeedback(payload: {
    messageId: string;
    conversationId: string;
    rating: 'helpful' | 'not_helpful';
    comment?: string;
    userEmail?: string;
  }): Promise<FeedbackRecord> {
    const data = await safeJsonFetch<{ feedback: FeedbackRecord }>(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return data.feedback;
  },

  async getFeedbackList(): Promise<FeedbackRecord[]> {
    const data = await safeJsonFetch<{ feedback: FeedbackRecord[] }>(`${API_BASE}/feedback`);
    return data.feedback || [];
  },

  // Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    const data = await safeJsonFetch<{ stats: DashboardStats }>(`${API_BASE}/analytics/dashboard`);
    return data.stats;
  },

  // Test Suite
  async getTestQuestions(): Promise<TestQuestion[]> {
    const data = await safeJsonFetch<{ questions: TestQuestion[] }>(`${API_BASE}/test-suite/questions`);
    return data.questions || [];
  },

  async runTestSuite(provider?: string): Promise<TestRunResult> {
    return safeJsonFetch<TestRunResult>(`${API_BASE}/test-suite/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });
  },

  // System Configuration
  async getSystemConfig(): Promise<SystemConfig> {
    return safeJsonFetch<SystemConfig>(`${API_BASE}/config`);
  },
};
