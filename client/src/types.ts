// client/src/types.ts

export interface ArticleCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  articleCount?: number;
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

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  sources?: SourceCitation[];
  isFallback?: boolean;
  latencyMs?: number;
  providerUsed?: string;
  rating?: 'helpful' | 'not_helpful';
  createdAt: string;
}

export interface FeedbackRecord {
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

export interface TestQuestion {
  id: string;
  question: string;
  expectedCategory: string;
  expectedArticleSlug: string;
  keyVerificationPoints: string[];
}

export interface TestRunResult {
  totalQuestions: number;
  passedCount: number;
  failedCount: number;
  accuracyPercentage: number;
  evaluatedAt: string;
  results: Array<{
    id: string;
    question: string;
    expectedCategory: string;
    expectedArticleSlug: string;
    actualAnswer: string;
    sources: SourceCitation[];
    isFallback: boolean;
    latencyMs: number;
    providerUsed: string;
    passed: boolean;
    reason: string;
  }>;
}

export interface SystemConfig {
  activeProvider: string;
  databaseMode: string;
  supabaseConnected: boolean;
  providers: {
    [key: string]: {
      name: string;
      description: string;
      available: boolean;
      url?: string;
    };
  };
}
