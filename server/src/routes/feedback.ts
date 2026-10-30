// server/src/routes/feedback.ts
import { Router } from 'express';
import { db } from '../db/index.js';

export const feedbackRouter = Router();

// POST /api/feedback - Submit feedback on AI answer
feedbackRouter.post('/', async (req, res) => {
  try {
    const { messageId, conversationId, rating, comment, userEmail } = req.body;

    if (!messageId || !conversationId || !rating) {
      return res.status(400).json({ error: 'messageId, conversationId, and rating are required' });
    }

    if (!['helpful', 'not_helpful'].includes(rating)) {
      return res.status(400).json({ error: 'Rating must be either "helpful" or "not_helpful"' });
    }

    const feedback = await db.createFeedback({
      message_id: messageId,
      conversation_id: conversationId,
      rating,
      comment: comment ? comment.trim() : null,
      user_email: userEmail ? userEmail.trim() : null,
    });

    res.status(201).json({ success: true, feedback });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit feedback' });
  }
});

// GET /api/feedback - List feedback for admin inspection
feedbackRouter.get('/', async (_req, res) => {
  try {
    const feedbackList = await db.getFeedbackList();
    res.json({ feedback: feedbackList });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch feedback list' });
  }
});
