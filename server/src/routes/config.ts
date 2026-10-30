// server/src/routes/config.ts
import { Router } from 'express';
import { supabase } from '../db/supabaseClient.js';

export const configRouter = Router();

configRouter.get('/', async (_req, res) => {
  let ollamaReachable = false;
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const resp = await fetch(`${ollamaUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    ollamaReachable = resp.ok;
  } catch {
    ollamaReachable = false;
  }

  res.json({
    activeProvider: process.env.AI_PROVIDER || 'builtin',
    databaseMode: process.env.DATABASE_MODE || 'local',
    supabaseConnected: supabase !== null,
    providers: {
      builtin: {
        name: 'SupportMind Built-in Grounded Engine',
        description: 'Deterministic RAG synthesis with strict anti-hallucination policy. Zero external API keys needed.',
        available: true,
      },
      openai: {
        name: 'OpenAI GPT-4o-mini',
        description: 'Server-side OpenAI chat completions with grounded context injection.',
        available: Boolean(process.env.OPENAI_API_KEY),
      },
      gemini: {
        name: 'Google Gemini 1.5 Flash',
        description: 'Google Generative Language API with strict grounding guardrails.',
        available: Boolean(process.env.GEMINI_API_KEY),
      },
      ollama: {
        name: 'Local Ollama (Llama 3.2 3B)',
        description: 'Local on-device inference running via Ollama without cloud dependencies.',
        available: ollamaReachable,
        url: ollamaUrl,
      },
    },
  });
});
