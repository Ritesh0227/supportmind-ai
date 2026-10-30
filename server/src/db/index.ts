// server/src/db/index.ts
import { localDb } from './storage.js';
import { supabase } from './supabaseClient.js';
import { Article, ArticleCategory, Conversation, Feedback, Message, Profile, DashboardStats } from '../types.js';

class DatabaseService {
  private useSupabase: boolean;

  constructor() {
    this.useSupabase = process.env.DATABASE_MODE === 'supabase' && supabase !== null;
  }

  // --- Categories ---
  async getCategories(): Promise<ArticleCategory[]> {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('article_categories').select('*').order('display_order');
      if (!error && data) return data as ArticleCategory[];
    }
    return localDb.getCategories();
  }

  async getCategoryBySlug(slug: string): Promise<ArticleCategory | null> {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('article_categories').select('*').eq('slug', slug).single();
      if (!error && data) return data as ArticleCategory;
    }
    return localDb.getCategoryBySlug(slug);
  }

  // --- Articles ---
  async getArticles(filter?: { category_id?: string; status?: string; search?: string }): Promise<Article[]> {
    if (this.useSupabase && supabase) {
      let query = supabase.from('articles').select('*');
      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.category_id) query = query.eq('category_id', filter.category_id);
      if (filter?.search) query = query.ilike('title', `%${filter.search}%`);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) return data as Article[];
    }
    return localDb.getArticles(filter);
  }

  async getArticleById(id: string): Promise<Article | null> {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (!error && data) return data as Article;
    }
    return localDb.getArticleById(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
      if (!error && data) return data as Article;
    }
    return localDb.getArticleBySlug(slug);
  }

  async createArticle(articleData: Omit<Article, 'created_at' | 'updated_at' | 'views_count' | 'helpful_count' | 'not_helpful_count'>): Promise<Article> {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('articles').insert([articleData]).select().single();
      if (!error && data) return data as Article;
    }
    return localDb.createArticle(articleData);
  }

  async updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'created_at'>>): Promise<Article | null> {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Article;
    }
    return localDb.updateArticle(id, updates);
  }

  async incrementArticleViews(id: string): Promise<void> {
    localDb.incrementArticleViews(id);
  }

  async recordArticleVote(id: string, isHelpful: boolean): Promise<void> {
    localDb.recordArticleVote(id, isHelpful);
  }

  // --- Conversations & Messages ---
  async getOrCreateConversation(sessionId: string, title?: string, userId?: string | null): Promise<Conversation> {
    return localDb.createConversation(sessionId, title, userId);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return localDb.getMessages(conversationId);
  }

  async createMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    return localDb.createMessage(msg);
  }

  // --- Feedback ---
  async createFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<Feedback> {
    return localDb.createFeedback(feedback);
  }

  async getFeedbackList(): Promise<Feedback[]> {
    return localDb.getFeedbackList();
  }

  // --- Analytics Dashboard ---
  async getDashboardStats(): Promise<DashboardStats> {
    return localDb.getDashboardStats();
  }
}

export const db = new DatabaseService();
