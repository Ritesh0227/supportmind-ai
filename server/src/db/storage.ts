// server/src/db/storage.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Article, ArticleCategory, Conversation, Feedback, Message, Profile, Product } from '../types.js';
import { SEED_CATEGORIES } from '../seed/categories.js';
import { SEED_PRODUCTS } from '../seed/products.js';
import { SEED_ARTICLES } from '../seed/articles.js';
import { hashPassword, comparePassword } from '../utils/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const ADMIN_DEFAULT_CRED = hashPassword('admin123', 'supportmind_admin_salt_2026');

interface DatabaseSchema {
  profiles: Profile[];
  categories: ArticleCategory[];
  products: Product[];
  articles: Article[];
  conversations: Conversation[];
  messages: Message[];
  feedback: Feedback[];
}

const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'user-admin-1',
    email: 'admin@supportmind.ai',
    full_name: 'Lead Support Administrator',
    role: 'admin',
    password_hash: ADMIN_DEFAULT_CRED.hash,
    password_salt: ADMIN_DEFAULT_CRED.salt,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-customer-demo',
    email: 'alex.customer@example.com',
    full_name: 'Alex Johnson',
    role: 'customer',
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-01-05T00:00:00Z',
  },
];

class LocalDatabase {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);

        // Merge and ensure profiles have password_hash and password_salt
        const loadedProfiles: Profile[] = (parsed.profiles || DEFAULT_PROFILES).map((p: Profile) => {
          if (p.role === 'admin' && !p.password_hash) {
            return {
              ...p,
              password_hash: ADMIN_DEFAULT_CRED.hash,
              password_salt: ADMIN_DEFAULT_CRED.salt,
            };
          }
          return p;
        });

        // Merge and ensure products and article fields (product & troubleshooting) exist
        const loadedArticles: Article[] = parsed.articles || SEED_ARTICLES;
        // Backfill product and troubleshooting from SEED_ARTICLES if missing
        const seedMap = new Map<string, Article>(SEED_ARTICLES.map((a) => [a.id, a]));
        const enrichedArticles = loadedArticles.map((art) => {
          const seed = seedMap.get(art.id);
          return {
            ...art,
            product: art.product || seed?.product || 'NexusDesk Core',
            troubleshooting: art.troubleshooting || seed?.troubleshooting || '',
          };
        });

        const initial: DatabaseSchema = {
          profiles: loadedProfiles,
          categories: parsed.categories || SEED_CATEGORIES,
          products: parsed.products || SEED_PRODUCTS,
          articles: enrichedArticles,
          conversations: parsed.conversations || [],
          messages: parsed.messages || [],
          feedback: parsed.feedback || [],
        };
        this.write(initial);
        return initial;
      } catch (err) {
        console.warn('[DB] Corrupted db.json, re-initializing with seed data...', err);
      }
    }

    const initialData: DatabaseSchema = {
      profiles: DEFAULT_PROFILES,
      categories: SEED_CATEGORIES,
      products: SEED_PRODUCTS,
      articles: SEED_ARTICLES,
      conversations: [],
      messages: [],
      feedback: [],
    };
    this.write(initialData);
    return initialData;
  }

  private write(data: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[DB] Failed to persist data to disk:', err);
    }
  }

  private scheduleSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.write(this.data);
      this.saveTimeout = null;
    }, 100);
  }

  public forceSaveNow() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    this.write(this.data);
  }

  // --- Profiles & Auth ---
  getProfiles() {
    return [...this.data.profiles];
  }

  getProfileByEmail(email: string) {
    return this.data.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()) || null;
  }

  verifyAdmin(email: string, password: string): Profile | null {
    const admin = this.data.profiles.find(
      (p) => p.email.toLowerCase() === email.toLowerCase() && p.role === 'admin'
    );
    if (!admin) return null;

    // Verify against database stored password_hash using timing-safe comparison
    if (admin.password_hash && admin.password_salt) {
      const isMatch = comparePassword(password, admin.password_hash, admin.password_salt);
      if (isMatch) {
        const { password_hash, password_salt, ...safeProfile } = admin;
        return safeProfile as Profile;
      }
    }

    // Support secondary demo credentials (Admin@SupportMind2026) or environment override
    if (password === 'Admin@SupportMind2026' || (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD)) {
      const { password_hash, password_salt, ...safeProfile } = admin;
      return safeProfile as Profile;
    }

    return null;
  }

  // --- Categories ---
  getCategories() {
    return [...this.data.categories].sort((a, b) => a.display_order - b.display_order);
  }

  getCategoryBySlug(slug: string) {
    return this.data.categories.find((c) => c.slug === slug || c.id === slug) || null;
  }

  getCategoryById(id: string) {
    return this.data.categories.find((c) => c.id === id) || null;
  }

  // --- Products ---
  getProducts() {
    return [...this.data.products];
  }

  getProductBySlug(slug: string) {
    return this.data.products.find((p) => p.slug === slug || p.id === slug) || null;
  }

  getProductById(id: string) {
    return this.data.products.find((p) => p.id === id) || null;
  }

  // --- Articles ---
  getArticles(filter?: { category_id?: string; product?: string; status?: string; search?: string }) {
    let result = [...this.data.articles];

    if (filter?.status) {
      result = result.filter((a) => a.status === filter.status);
    }

    if (filter?.category_id) {
      result = result.filter((a) => a.category_id === filter.category_id);
    }

    if (filter?.product) {
      const prodQuery = filter.product.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.product?.toLowerCase() === prodQuery ||
          a.product?.toLowerCase().includes(prodQuery)
      );
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          (a.troubleshooting && a.troubleshooting.toLowerCase().includes(q)) ||
          a.keywords.some((k) => k.toLowerCase().includes(q)) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          (a.product && a.product.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getArticleById(id: string) {
    return this.data.articles.find((a) => a.id === id) || null;
  }

  getArticleBySlug(slug: string) {
    return this.data.articles.find((a) => a.slug === slug || a.id === slug) || null;
  }

  getRelatedArticles(articleId: string, limit = 3): Article[] {
    const current = this.data.articles.find((a) => a.id === articleId || a.slug === articleId);
    if (!current) return [];

    const others = this.data.articles.filter(
      (a) => a.id !== current.id && a.status === 'published'
    );

    const scored = others.map((other) => {
      let score = 0;
      if (other.category_id === current.category_id) score += 3;
      if (other.product && current.product && other.product === current.product) score += 2;
      const sharedKw = other.keywords.filter((k) => current.keywords.includes(k));
      score += sharedKw.length;
      return { article: other, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.article);
  }

  createArticle(article: Omit<Article, 'created_at' | 'updated_at' | 'views_count' | 'helpful_count' | 'not_helpful_count'>): Article {
    const now = new Date().toISOString();
    const newArticle: Article = {
      ...article,
      product: article.product || 'NexusDesk Core',
      troubleshooting: article.troubleshooting || '',
      views_count: 0,
      helpful_count: 0,
      not_helpful_count: 0,
      created_at: now,
      updated_at: now,
    };
    this.data.articles.unshift(newArticle);
    this.scheduleSave();
    return newArticle;
  }

  updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'created_at'>>): Article | null {
    const index = this.data.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = this.data.articles[index];
    const updated: Article = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.articles[index] = updated;
    this.scheduleSave();
    return updated;
  }

  deleteArticle(id: string): boolean {
    const index = this.data.articles.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.data.articles.splice(index, 1);
    this.scheduleSave();
    return true;
  }

  incrementArticleViews(id: string) {
    const article = this.data.articles.find((a) => a.id === id || a.slug === id);
    if (article) {
      article.views_count += 1;
      this.scheduleSave();
    }
  }

  recordArticleVote(id: string, isHelpful: boolean) {
    const article = this.data.articles.find((a) => a.id === id || a.slug === id);
    if (article) {
      if (isHelpful) {
        article.helpful_count += 1;
      } else {
        article.not_helpful_count += 1;
      }
      this.scheduleSave();
    }
  }

  // --- Conversations & Messages ---
  getConversation(id: string) {
    return this.data.conversations.find((c) => c.id === id) || null;
  }

  createConversation(sessionId: string, title?: string, userId?: string | null): Conversation {
    const now = new Date().toISOString();
    const conv: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      session_id: sessionId,
      user_id: userId || null,
      title: title || 'New Support Conversation',
      status: 'active',
      created_at: now,
      updated_at: now,
    };
    this.data.conversations.unshift(conv);
    this.scheduleSave();
    return conv;
  }

  getMessages(conversationId: string) {
    return this.data.messages
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  createMessage(msg: Omit<Message, 'id' | 'created_at'>): Message {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.data.messages.push(newMsg);
    this.scheduleSave();
    return newMsg;
  }

  // --- Feedback ---
  createFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>): Feedback {
    const newFeedback: Feedback = {
      ...feedback,
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.data.feedback.unshift(newFeedback);
    this.scheduleSave();
    return newFeedback;
  }

  getFeedbackList() {
    return [...this.data.feedback].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // --- Analytics & Statistics ---
  getDashboardStats() {
    const activeArticles = this.data.articles.filter((a) => a.status === 'published');
    const customerQuestions = this.data.messages.filter((m) => m.sender === 'user');
    const assistantAnswers = this.data.messages.filter((m) => m.sender === 'assistant');

    const unansweredQuestions = assistantAnswers.filter((m) => m.is_fallback === true).length;
    const answeredQuestions = assistantAnswers.filter((m) => !m.is_fallback).length;

    const helpfulCount = this.data.feedback.filter((f) => f.rating === 'helpful').length;
    const notHelpfulCount = this.data.feedback.filter((f) => f.rating === 'not_helpful').length;
    const totalFeedback = helpfulCount + notHelpfulCount;
    const satisfactionRate = totalFeedback > 0 ? Math.round((helpfulCount / totalFeedback) * 100) : 100;

    // Articles grouped by category
    const articlesByCategory = this.data.categories.map((c) => {
      const count = this.data.articles.filter((a) => a.category_id === c.id && a.status === 'published').length;
      return { category: c.name, count };
    });

    // Questions over time
    const dateMap: { [date: string]: number } = {};
    customerQuestions.forEach((q) => {
      const day = q.created_at.split('T')[0];
      dateMap[day] = (dateMap[day] || 0) + 1;
    });

    const dates = Object.keys(dateMap).sort();
    const questionsOverTime = dates.map((d) => ({ date: d, count: dateMap[d] }));

    // Recent questions table with full context
    const recentQuestions = customerQuestions.slice(0, 20).map((q) => {
      const allMsgs = this.data.messages.filter((m) => m.conversation_id === q.conversation_id);
      const qIndex = allMsgs.findIndex((m) => m.id === q.id);
      const answer = qIndex !== -1 && allMsgs[qIndex + 1] ? allMsgs[qIndex + 1] : null;
      const fb = answer ? this.data.feedback.find((f) => f.message_id === answer.id) : null;

      return {
        id: q.id,
        conversationId: q.conversation_id,
        question: q.content,
        answer: answer ? answer.content : 'Pending response...',
        sourcesCount: answer?.sources?.length || 0,
        isFallback: answer?.is_fallback || false,
        rating: fb?.rating,
        createdAt: q.created_at,
      };
    });

    // Unanswered list (questions where AI triggered fallback)
    const unansweredList = customerQuestions
      .filter((q) => {
        const allMsgs = this.data.messages.filter((m) => m.conversation_id === q.conversation_id);
        const qIndex = allMsgs.findIndex((m) => m.id === q.id);
        const answer = qIndex !== -1 && allMsgs[qIndex + 1] ? allMsgs[qIndex + 1] : null;
        return answer?.is_fallback === true;
      })
      .slice(0, 15)
      .map((q) => ({
        id: q.id,
        conversationId: q.conversation_id,
        question: q.content,
        createdAt: q.created_at,
      }));

    return {
      totalActiveArticles: activeArticles.length,
      totalCustomerQuestions: customerQuestions.length,
      answeredQuestions,
      unansweredQuestions,
      helpfulFeedbackCount: helpfulCount,
      notHelpfulFeedbackCount: notHelpfulCount,
      satisfactionRate,
      articlesByCategory,
      questionsOverTime,
      recentQuestions,
      unansweredList,
    };
  }
}

export const localDb = new LocalDatabase();
