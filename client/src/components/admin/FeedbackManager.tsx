// client/src/components/admin/FeedbackManager.tsx
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, Mail, CheckCircle2 } from 'lucide-react';
import { FeedbackRecord } from '../../types.js';

interface FeedbackManagerProps {
  feedbackList: FeedbackRecord[];
}

export const FeedbackManager: React.FC<FeedbackManagerProps> = ({ feedbackList }) => {
  const [filterRating, setFilterRating] = useState<'all' | 'helpful' | 'not_helpful'>('all');

  const filtered = feedbackList.filter((fb) => {
    if (filterRating === 'all') return true;
    return fb.rating === filterRating;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">Customer Feedback Audit Log</h3>
              <p className="text-xs text-slate-500">
                Direct ratings and optional comments submitted by customers after AI interactions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              filterRating === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({feedbackList.length})
          </button>
          <button
            onClick={() => setFilterRating('helpful')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              filterRating === 'helpful'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            Helpful ({feedbackList.filter((f) => f.rating === 'helpful').length})
          </button>
          <button
            onClick={() => setFilterRating('not_helpful')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              filterRating === 'not_helpful'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-rose-700 border-slate-200 hover:bg-rose-50'
            }`}
          >
            Not Helpful ({feedbackList.filter((f) => f.rating === 'not_helpful').length})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4">
          <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">No Feedback Recorded</h4>
          <p className="text-xs text-slate-400 mt-1">
            No customer ratings found matching the active filter.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((fb) => (
            <div key={fb.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center space-x-2">
                  {fb.rating === 'helpful' ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <ThumbsUp className="h-3 w-3" />
                      <span>Helpful</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      <ThumbsDown className="h-3 w-3" />
                      <span>Not Helpful</span>
                    </span>
                  )}

                  {fb.user_email && (
                    <span className="text-xs text-slate-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1 text-slate-400" />
                      {fb.user_email}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-800 font-medium">
                  {fb.comment ? `"${fb.comment}"` : <span className="italic text-slate-400">No comment provided</span>}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(fb.created_at).toLocaleString()}</span>
                  </span>
                  <span>• Message Ref: {fb.message_id.slice(0, 10)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
