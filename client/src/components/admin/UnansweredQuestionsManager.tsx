// client/src/components/admin/UnansweredQuestionsManager.tsx
import React from 'react';
import { AlertCircle, PlusCircle, CheckCircle2, Clock } from 'lucide-react';

interface UnansweredQuestionsManagerProps {
  unansweredList: Array<{
    id: string;
    conversationId: string;
    question: string;
    createdAt: string;
  }>;
  onCreateArticleForQuestion: (question: string) => void;
}

export const UnansweredQuestionsManager: React.FC<UnansweredQuestionsManagerProps> = ({
  unansweredList,
  onCreateArticleForQuestion,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">Unanswered Questions Triage</h3>
              <p className="text-xs text-slate-500">
                Customer questions that triggered safe fallback because no approved documentation matched.
              </p>
            </div>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
          {unansweredList.length} Pending
        </span>
      </div>

      {unansweredList.length === 0 ? (
        <div className="text-center py-12 px-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">All Customer Questions Grounded!</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Zero customer questions have triggered fallbacks. Knowledge base coverage is optimal.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {unansweredList.map((item) => (
            <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-900 block">
                  "{item.question}"
                </span>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </span>
                  <span>• Session: {item.conversationId.slice(0, 12)}...</span>
                </div>
              </div>

              <button
                onClick={() => onCreateArticleForQuestion(item.question)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shrink-0"
              >
                <PlusCircle className="h-4 w-4 text-blue-600" />
                <span>Create Knowledge Article</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
