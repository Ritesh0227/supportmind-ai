// client/src/components/chat/MessageBubble.tsx
import React from 'react';
import {
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  AlertTriangle,
  Clock,
  Cpu,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, SourceCitation } from '../../types.js';

interface MessageBubbleProps {
  message: ChatMessage;
  onOpenSource: (source: SourceCitation) => void;
  onOpenFeedback: (messageId: string, rating: 'helpful' | 'not_helpful') => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onOpenSource,
  onOpenFeedback,
}) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end items-end space-x-2 my-3">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-xs bg-blue-600 text-white p-3.5 text-xs sm:text-sm shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
          <User className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start space-x-2.5 my-4">
      <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
        <Bot className="h-4 w-4" />
      </div>

      <div className="max-w-[92%] sm:max-w-[85%] space-y-2.5">
        {/* Main Answer Bubble */}
        <div
          className={`rounded-2xl rounded-tl-xs p-4 text-xs sm:text-sm shadow-xs border leading-relaxed ${
            message.isFallback
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-white border-slate-200/90 text-slate-800'
          }`}
        >
          {message.isFallback && (
            <div className="flex items-center space-x-1.5 font-bold text-amber-700 text-xs mb-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Safe Fallback Policy Triggered</span>
            </div>
          )}

          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

          {/* Sources Citations Section */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-700 mb-2">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>Verified Sources & Approved References:</span>
              </div>
              <div className="space-y-1.5">
                {message.sources.map((src) => (
                  <button
                    key={src.articleId}
                    onClick={() => onOpenSource(src)}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-between group"
                  >
                    <div className="overflow-hidden pr-2">
                      <span className="block text-xs font-semibold text-slate-900 group-hover:text-blue-700 truncate">
                        {src.title}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate mt-0.5">
                        {src.excerpt}
                      </span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar (Feedback & Metadata) */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <div className="flex items-center space-x-3">
            {message.latencyMs !== undefined && (
              <span className="flex items-center space-x-1" title="Generation latency">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{message.latencyMs}ms</span>
              </span>
            )}
            {message.providerUsed && (
              <span className="flex items-center space-x-1 text-slate-400" title="AI Model / Engine">
                <Cpu className="h-3 w-3" />
                <span className="hidden sm:inline">{message.providerUsed}</span>
              </span>
            )}
          </div>

          {/* Feedback Buttons */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-400 mr-1">Was this helpful?</span>
            <button
              onClick={() => onOpenFeedback(message.id, 'helpful')}
              title="Helpful response"
              className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onOpenFeedback(message.id, 'not_helpful')}
              title="Not helpful response"
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
