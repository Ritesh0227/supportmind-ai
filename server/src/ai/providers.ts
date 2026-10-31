// server/src/ai/providers.ts
import { RagEngine, ScoredArticle, MANDATORY_FALLBACK_TEXT } from './ragEngine.js';
import { SourceCitation } from '../types.js';

export interface AiGenerationResult {
  answer: string;
  sources: SourceCitation[];
  isFallback: boolean;
  providerUsed: string;
  latencyMs: number;
}

const SYSTEM_GROUNDING_PROMPT = `You are SupportMind AI, the official customer support AI assistant.
CRITICAL MANDATORY RULES:
1. Answer the customer's question using ONLY the provided verified articles below.
2. NEVER invent company policies, refund windows, delivery dates, or prices.
3. NEVER generate unsupported product information.
4. If the provided articles do NOT contain a reliable, direct answer to the customer's question, you MUST respond EXACTLY with:
"${MANDATORY_FALLBACK_TEXT}"
5. Keep your answer professional, clear, concise, and structured with bullet points or numbered steps where helpful.
6. Do not include markdown citations like [1] or [Article] in the text because source badges are rendered automatically by the UI.`;

export class AiProviderService {
  /**
   * Main router for answering questions
   */
  public static async answerQuestion(query: string, preferredProvider?: string): Promise<AiGenerationResult> {
    const startTime = Date.now();
    const scoredArticles = await RagEngine.retrieveRelevantArticles(query, 3);

    // If no articles match above relevance threshold, trigger safe fallback immediately
    if (scoredArticles.length === 0 || scoredArticles[0].score < 4.5) {
      return {
        answer: MANDATORY_FALLBACK_TEXT,
        sources: [],
        isFallback: true,
        providerUsed: 'fallback-guard',
        latencyMs: Date.now() - startTime,
      };
    }

    const citations = RagEngine.toCitations(scoredArticles);
    const provider = preferredProvider || process.env.AI_PROVIDER || 'builtin';

    try {
      if (provider === 'openai' && process.env.OPENAI_API_KEY) {
        const answer = await this.callOpenAi(query, scoredArticles);
        const isFallback = answer.trim() === MANDATORY_FALLBACK_TEXT;
        return {
          answer,
          sources: isFallback ? [] : citations,
          isFallback,
          providerUsed: `OpenAI (${process.env.OPENAI_MODEL || 'gpt-4o-mini'})`,
          latencyMs: Date.now() - startTime,
        };
      }

      if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
        const answer = await this.callGemini(query, scoredArticles);
        const isFallback = answer.trim() === MANDATORY_FALLBACK_TEXT;
        return {
          answer,
          sources: isFallback ? [] : citations,
          isFallback,
          providerUsed: `Gemini (${process.env.GEMINI_MODEL || 'gemini-1.5-flash'})`,
          latencyMs: Date.now() - startTime,
        };
      }

      if (provider === 'ollama') {
        const ollamaRes = await this.callOllama(query, scoredArticles);
        if (ollamaRes) {
          const isFallback = ollamaRes.trim() === MANDATORY_FALLBACK_TEXT;
          return {
            answer: ollamaRes,
            sources: isFallback ? [] : citations,
            isFallback,
            providerUsed: `Ollama (${process.env.OLLAMA_MODEL || 'llama3.2:3b'})`,
            latencyMs: Date.now() - startTime,
          };
        }
        // If Ollama is offline, gracefully fall through to built-in grounded engine
      }
    } catch (err) {
      console.warn(`[AI] Error calling provider ${provider}, falling back to built-in grounded engine:`, err);
    }

    // Default: Built-in deterministic grounded engine (100% compliant, zero hallucinations)
    const groundedAnswer = this.generateDeterministicGroundedAnswer(query, scoredArticles);
    const isFallback = groundedAnswer.trim() === MANDATORY_FALLBACK_TEXT;

    return {
      answer: groundedAnswer,
      sources: isFallback ? [] : citations,
      isFallback,
      providerUsed: 'SupportMind Built-in Grounded Engine',
      latencyMs: Date.now() - startTime,
    };
  }

  /**
   * Deterministic grounded response synthesis based strictly on verified articles
   */
  private static generateDeterministicGroundedAnswer(query: string, scoredArticles: ScoredArticle[]): string {
    const top = scoredArticles[0];
    const article = top.article;
    const content = article.content;

    // Extract procedural steps if present
    const stepsMatch = content.match(/(\d+\.\s+[^\n]+(?:\n(?!\d+\.|\n)[^\n]+)*)/g);
    const bulletsMatch = content.match(/(-\s+[^\n]+(?:\n(?!-|\n)[^\n]+)*)/g);

    let synthesis = '';

    if (stepsMatch && stepsMatch.length >= 2) {
      synthesis = `Based on our verified knowledge base article **"${article.title}"**, here are the recommended steps:\n\n` +
        stepsMatch.slice(0, 7).join('\n') +
        `\n\n*(Source: ${article.title})*`;
    } else if (bulletsMatch && bulletsMatch.length >= 2) {
      synthesis = `According to our approved documentation on **"${article.title}"**:\n\n` +
        bulletsMatch.slice(0, 6).join('\n') +
        `\n\n*(Source: ${article.title})*`;
    } else {
      // Use clean excerpts from matched snippets
      const snippet = top.matchedSnippets[0] || article.excerpt;
      synthesis = `According to our official guide **"${article.title}"**:\n\n${snippet}\n\n*(Source: ${article.title})*`;
    }

    if (article.troubleshooting) {
      synthesis += `\n\n**Troubleshooting & Diagnostic Steps:**\n${article.troubleshooting}`;
    }

    return synthesis;
  }

  /**
   * OpenAI API Call
   */
  private static async callOpenAi(query: string, articles: ScoredArticle[]): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const contextText = articles
      .map(
        (a, i) =>
          `[Article ${i + 1}: ${a.article.title}]\nCategory: ${a.article.category_id}\nContent: ${a.article.content}`
      )
      .join('\n\n---\n\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: `${SYSTEM_GROUNDING_PROMPT}\n\nVERIFIED ARTICLES:\n${contextText}` },
          { role: 'user', content: query },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || MANDATORY_FALLBACK_TEXT;
  }

  /**
   * Google Gemini API Call
   */
  private static async callGemini(query: string, articles: ScoredArticle[]): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    const contextText = articles
      .map((a, i) => `[Article ${i + 1}: ${a.article.title}]\n${a.article.content}`)
      .join('\n\n');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_GROUNDING_PROMPT}\n\nVERIFIED ARTICLES:\n${contextText}\n\nCUSTOMER QUESTION: ${query}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || MANDATORY_FALLBACK_TEXT;
  }

  /**
   * Local Ollama Call (supports Llama 3.2 3B)
   */
  private static async callOllama(query: string, articles: ScoredArticle[]): Promise<string | null> {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.2:3b';

    const contextText = articles
      .map((a, i) => `[Article ${i + 1}: ${a.article.title}]\n${a.article.content}`)
      .join('\n\n');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            { role: 'system', content: `${SYSTEM_GROUNDING_PROMPT}\n\nVERIFIED ARTICLES:\n${contextText}` },
            { role: 'user', content: query },
          ],
        }),
      });

      clearTimeout(timeout);
      if (!response.ok) return null;

      const data = await response.json();
      return data.message?.content?.trim() || null;
    } catch {
      clearTimeout(timeout);
      return null;
    }
  }
}
