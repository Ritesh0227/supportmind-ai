// server/src/db/mongoModels.ts
/**
 * MongoDB Mongoose Schema and Model definitions for HACK-P380.
 * Defines enterprise data schemas for:
 * 1. Article (approved knowledge base)
 * 2. Category (support domains)
 * 3. Product (fictional SaaS suite)
 * 4. CustomerQuestion / Conversation (chat sessions)
 * 5. Message / ChatInteraction (grounded answers and source citations)
 * 6. Feedback (thumbs up/down and qualitative audit comments)
 * 7. AdminUser (administrator accounts and access control)
 */

export interface ArticleDoc {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  product: string;
  content: string;
  excerpt: string;
  troubleshooting?: string;
  keywords: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  views_count: number;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryDoc {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export interface ProductDoc {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ConversationDoc {
  id: string;
  session_id: string;
  user_id?: string | null;
  title: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface SourceCitationDoc {
  articleId: string;
  title: string;
  slug: string;
  category: string;
  product?: string;
  excerpt: string;
  relevanceScore: number;
}

export interface MessageDoc {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  sources?: SourceCitationDoc[];
  is_fallback?: boolean;
  latency_ms?: number;
  created_at: string;
}

export interface FeedbackDoc {
  id: string;
  message_id: string;
  conversation_id: string;
  rating: 'helpful' | 'not_helpful';
  comment?: string | null;
  user_email?: string | null;
  created_at: string;
}

export interface AdminUserDoc {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'admin';
  created_at: string;
}

// Declarative MongoDB Schemas (Specification for Mongoose / MongoDB Collections)
export const MongoSchemas = {
  ArticleSchema: {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    category_id: { type: String, required: true, index: true },
    product: { type: String, required: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    troubleshooting: { type: String, default: '' },
    keywords: [{ type: String }],
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published', index: true },
    views_count: { type: Number, default: 0 },
    helpful_count: { type: Number, default: 0 },
    not_helpful_count: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  CategorySchema: {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'HelpCircle' },
    display_order: { type: Number, default: 0 },
  },
  ProductSchema: {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Box' },
  },
  ConversationSchema: {
    session_id: { type: String, required: true, index: true },
    user_id: { type: String, default: null },
    title: { type: String, default: 'Customer Support Conversation' },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
  },
  MessageSchema: {
    conversation_id: { type: String, required: true, index: true },
    sender: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    sources: [{
      articleId: String,
      title: String,
      slug: String,
      category: String,
      product: String,
      excerpt: String,
      relevanceScore: Number,
    }],
    is_fallback: { type: Boolean, default: false },
    latency_ms: { type: Number, default: 0 },
  },
  FeedbackSchema: {
    message_id: { type: String, required: true, index: true },
    conversation_id: { type: String, required: true },
    rating: { type: String, enum: ['helpful', 'not_helpful'], required: true },
    comment: { type: String, default: null },
    user_email: { type: String, default: null },
  },
  AdminUserSchema: {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
};
