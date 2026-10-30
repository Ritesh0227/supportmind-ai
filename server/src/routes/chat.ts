// server/src/routes/chat.ts
import { Router } from 'express';
import { db } from '../db/index.js';
import { AiProviderService } from '../ai/providers.js';

export const chatRouter = Router();

// POST /api/chat - Ask AI question
chatRouter.post('/', async (req, res) => {
  try {
    const { sessionId, query, conversationId, provider } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query string is required' });
    }

    const session = sessionId || `anon-${Date.now()}`;

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const conv = await db.getOrCreateConversation(session, query.slice(0, 40) + '...');
      convId = conv.id;
    }

    // 1. Store user message
    const userMessage = await db.createMessage({
      conversation_id: convId,
      sender: 'user',
      content: query.trim(),
    });

    // 2. Query AI Provider through RAG Engine
    const result = await AiProviderService.answerQuestion(query.trim(), provider);

    // 3. Store assistant message
    const assistantMessage = await db.createMessage({
      conversation_id: convId,
      sender: 'assistant',
      content: result.answer,
      sources: result.sources,
      is_fallback: result.isFallback,
      latency_ms: result.latencyMs,
    });

    res.json({
      conversationId: convId,
      userMessageId: userMessage.id,
      messageId: assistantMessage.id,
      answer: result.answer,
      sources: result.sources,
      isFallback: result.isFallback,
      latencyMs: result.latencyMs,
      providerUsed: result.providerUsed,
      createdAt: assistantMessage.created_at,
    });
  } catch (err: any) {
    console.error('[Chat] Error processing chat query:', err);
    res.status(500).json({
      error: 'Failed to process AI response',
      details: err.message || 'Unknown internal error',
    });
  }
});

// GET /api/chat/conversations/:id/messages - Retrieve message thread
chatRouter.get('/conversations/:id/messages', async (req, res) => {
  try {
    const messages = await db.getMessages(req.params.id);
    res.json({ messages });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch conversation messages' });
  }
});
