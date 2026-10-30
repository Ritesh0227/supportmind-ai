// client/src/components/chat/FeedbackModal.tsx
import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.js';

interface FeedbackModalProps {
  messageId: string;
  conversationId: string;
  initialRating: 'helpful' | 'not_helpful';
  onClose: () => void;
  onSubmitted: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  messageId,
  conversationId,
  initialRating,
  onClose,
  onSubmitted,
}) => {
  const [rating, setRating] = useState<'helpful' | 'not_helpful'>(initialRating);
  const [comment, setComment] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitFeedback({
        messageId,
        conversationId,
        rating,
        comment: comment || undefined,
        userEmail: userEmail || undefined,
      });
      setSubmitted(true);
      setTimeout(() => {
        onSubmitted();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-bold text-slate-900">Provide Answer Feedback</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-900 text-sm">Thank You for Your Feedback!</p>
            <p className="text-xs text-slate-500 mt-1">
              Your response helps us improve the quality of our grounded customer support knowledge.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Was this AI answer helpful?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRating('helpful')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    rating === 'helpful'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRating('not_helpful')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    rating === 'not_helpful'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>Not Helpful</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional comment or suggestions
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What could be improved about this response?"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your email (optional)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
