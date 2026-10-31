// server/src/ai/ragEngine.ts
import { Article, SourceCitation } from '../types.js';
import { db } from '../db/index.js';

export const MANDATORY_FALLBACK_TEXT =
  "I couldn't find a reliable answer in our knowledge base. Please contact our support team for further assistance.";

export interface ScoredArticle {
  article: Article;
  score: number;
  matchedSnippets: string[];
}

export class RagEngine {
  private static STOP_WORDS = new Set([
    'what', 'where', 'when', 'which', 'who', 'whom', 'whose', 'why', 'how',
    'this', 'that', 'these', 'those', 'have', 'has', 'had', 'having', 'does',
    'did', 'will', 'would', 'shall', 'should', 'could', 'can', 'may', 'might',
    'about', 'your', 'yours', 'ours', 'their', 'theirs', 'company', 'policy',
    'policies', 'please', 'tell', 'inside', 'outside', 'with', 'from', 'into',
    'some', 'also', 'just', 'more', 'than', 'them', 'then', 'there', 'here',
    'been', 'being', 'were', 'want', 'need', 'like'
  ]);

  /**
   * Tokenize and normalize query text for keyword matching
   */
  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  /**
   * Retrieve and rank approved articles relevant to the query
   */
  public static async retrieveRelevantArticles(query: string, maxResults = 3): Promise<ScoredArticle[]> {
    // Only published articles are eligible for customer AI grounding
    const articles = await db.getArticles({ status: 'published' });
    const allTokens = this.tokenize(query);
    const contentTokens = allTokens.filter((t) => !this.STOP_WORDS.has(t));
    const queryLower = query.toLowerCase().trim();

    // If query has no substantive keywords (e.g., only stop words), return no articles
    if (contentTokens.length === 0) return [];

    const scored: ScoredArticle[] = [];

    for (const article of articles) {
      let score = 0;
      let matchedDistinctTokens = 0;
      const matchedSnippets: string[] = [];

      const titleLower = article.title.toLowerCase();
      const excerptLower = article.excerpt.toLowerCase();
      const contentLower = article.content.toLowerCase();

      // Check distinct content token coverage across title, excerpt, content, troubleshooting, keywords, and product
      for (const token of contentTokens) {
        if (
          titleLower.includes(token) ||
          excerptLower.includes(token) ||
          contentLower.includes(token) ||
          (article.troubleshooting && article.troubleshooting.toLowerCase().includes(token)) ||
          article.keywords.some((k) => k.toLowerCase().includes(token)) ||
          (article.product && article.product.toLowerCase().includes(token))
        ) {
          matchedDistinctTokens++;
        }
      }

      // If less than 25% of query content tokens appear in the article, skip to avoid spurious matches
      const tokenCoverage = matchedDistinctTokens / contentTokens.length;
      if (tokenCoverage < 0.25 && !titleLower.includes(queryLower)) {
        continue;
      }

      // 1. Exact phrase matches (Highest weight)
      if (titleLower.includes(queryLower)) {
        score += 10.0;
      }
      if (excerptLower.includes(queryLower)) {
        score += 5.0;
      }

      // 2. Keyword & Tag matches
      for (const kw of article.keywords) {
        const kwLower = kw.toLowerCase();
        if (queryLower.includes(kwLower)) {
          score += 4.5;
        } else {
          for (const token of contentTokens) {
            if (kwLower === token || kwLower.split(/\s+/).includes(token)) {
              score += 2.5;
            }
          }
        }
      }

      for (const tag of article.tags) {
        const tagLower = tag.toLowerCase();
        if (queryLower.includes(tagLower)) score += 2.0;
      }

      // 3. Content paragraph scoring & snippet extraction
      const paragraphs = article.content.split(/\n\n+/);
      for (const para of paragraphs) {
        const paraLower = para.toLowerCase();
        let paraMatches = 0;
        for (const token of contentTokens) {
          if (paraLower.includes(token)) paraMatches++;
        }

        if (paraMatches > 0) {
          const paragraphScore = paraMatches * 1.0;
          score += paragraphScore;
          if (matchedSnippets.length < 2 && para.trim().length > 30) {
            matchedSnippets.push(para.trim().replace(/^##+\s*/, ''));
          }
        }
      }

      // Relevance threshold
      if (score >= 4.5 && tokenCoverage >= 0.25) {
        scored.push({
          article,
          score,
          matchedSnippets: matchedSnippets.length > 0 ? matchedSnippets : [article.excerpt],
        });
      }
    }

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxResults);
  }

  /**
   * Formats scored articles into citations
   */
  public static toCitations(scoredArticles: ScoredArticle[]): SourceCitation[] {
    return scoredArticles.map((item) => ({
      articleId: item.article.id,
      title: item.article.title,
      slug: item.article.slug,
      category: item.article.category_id,
      product: item.article.product,
      excerpt: item.article.excerpt,
      relevanceScore: Math.round(item.score * 10) / 10,
    }));
  }
}
