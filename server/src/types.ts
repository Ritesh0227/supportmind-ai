// server/src/types.ts

export type UserRole = 'admin' | 'customer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ArticleCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  content: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  status: ArticleStatus;
  views_count: number;
  helpful_count: number;
  not_helpful_count: number;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  session_id: string;
  user_id?: string | null;
  title: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface SourceCitation {
  articleId: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  relevanceScore: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  sources?: SourceCitation[];
  is_fallback?: boolean;
  latency_ms?: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  message_id: string;
  conversation_id: string;
  rating: 'helpful' | 'not_helpful';
  comment?: string | null;
  user_email?: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalActiveArticles: number;
  totalCustomerQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  helpfulFeedbackCount: number;
  notHelpfulFeedbackCount: number;
  satisfactionRate: number;
  articlesByCategory: { category: string; count: number }[];
  questionsOverTime: { date: string; count: number }[];
  recentQuestions: Array<{
    id: string;
    conversationId: string;
    question: string;
    answer: string;
    sourcesCount: number;
    isFallback: boolean;
    rating?: 'helpful' | 'not_helpful';
    createdAt: string;
  }>;
  unansweredList: Array<{
    id: string;
    conversationId: string;
    question: string;
    createdAt: string;
  }>;
}

export interface TestQuestionExpected {
  id: string;
  question: string;
  expectedCategory: string;
  expectedArticleSlug: string;
  keyVerificationPoints: string[];
}
