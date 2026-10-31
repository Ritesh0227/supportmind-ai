// client/src/components/pages/ChatPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  Info,
} from 'lucide-react';
import { ChatMessage, SourceCitation, Article } from '../../types.js';
import { api } from '../../services/api.js';

interface ChatPageProps {
  initialQuery?: string;
  onOpenSourceArticle: (slug: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  initialQuery,
  onOpenSourceArticle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Searching knowledge base...');
  const [sessionId] = useState(() => `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  // Feedback modal
  const [activeFeedbackMsg, setActiveFeedbackMsg] = useState<ChatMessage | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<'helpful' | 'not_helpful'>('helpful');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const starterQuestions = [
    'How do I reset my password?',
    'Where can I find my invoice?',
    'How do I track my order?',
    'Why was my payment declined?',
    'How do I request a return?',
    'When will I receive my refund?',
    'My website is not loading. What should I do?',
    'What is your policy on flying drones inside airplanes?', // Intentional fallback test
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || loading) return;

    setInputQuery('');

    // Add user message to state
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conversationId || '',
      sender: 'user',
      content: q,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Multi-stage indicator
    setLoadingStage('Searching approved knowledge base articles...');
    const t1 = setTimeout(() => setLoadingStage('Evaluating source relevance & citations...'), 350);
    const t2 = setTimeout(() => setLoadingStage('Synthesizing grounded response...'), 700);

    try {
      const response = await api.sendChatMessage({
        sessionId,
        query: q,
        conversationId,
      });

      clearTimeout(t1);
      clearTimeout(t2);

      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }

      const assistantMsg: ChatMessage = {
        id: response.messageId || `msg-asst-${Date.now()}`,
        conversationId: response.conversationId || conversationId || '',
        sender: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        isFallback: response.isFallback,
        latencyMs: response.latencyMs,
        providerUsed: response.providerUsed,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        conversationId: conversationId || '',
        sender: 'assistant',
        content: "I couldn't process your question at this moment. Please check your connection or contact our human customer support team.",
        isFallback: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleOpenFeedback = (msg: ChatMessage, rating: 'helpful' | 'not_helpful') => {
    setActiveFeedbackMsg(msg);
    setFeedbackRating(rating);
    setFeedbackComment('');
    setFeedbackEmail('');
    setFeedbackSuccessMsg(null);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackMsg) return;

    setSubmittingFeedback(true);
    try {
      await api.submitFeedback({
        messageId: activeFeedbackMsg.id,
        conversationId: activeFeedbackMsg.conversationId || conversationId || sessionId,
        rating: feedbackRating,
        comment: feedbackComment || undefined,
        userEmail: feedbackEmail || undefined,
      });

      // Update local message rating
      setMessages((prev) =>
        prev.map((m) => (m.id === activeFeedbackMsg.id ? { ...m, rating: feedbackRating } : m))
      );

      setFeedbackSuccessMsg('Feedback recorded. Thank you for helping us improve!');
      setTimeout(() => {
        setActiveFeedbackMsg(null);
        setFeedbackSuccessMsg(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleResetSession = () => {
    setMessages([]);
    setConversationId(undefined);
    setInputQuery('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Bot className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Customer Support Chat
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Grounded Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Answers are retrieved strictly from approved help articles. Zero hallucinations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetSession}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Start new conversation"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Session</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[680px] overflow-hidden">
        {/* Chat Status Header Bar */}
        <div className="px-6 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SupportMind RAG Pipeline Active</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Session ID: {sessionId.slice(0, 16)}</span>
          </div>
          <div className="text-slate-400 font-medium hidden sm:block">
            Strict Source Citations Enabled
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Welcome Greeting if no messages */}
          {messages.length === 0 && (
            <div className="text-center py-8 max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                <Sparkles className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  How can our Support Assistant help you today?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Ask questions about passwords, invoices, shipping timeframes, return policies, or error troubleshooting.
                  Every answer references verified company knowledge.
                </p>
              </div>

              {/* Starter Question Chips */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Click to Ask a Test Question:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {starterQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/90 text-xs font-medium transition-all text-left shadow-2xs hover:border-blue-300"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rendered Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : msg.isFallback
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Body Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : msg.isFallback
                    ? 'bg-amber-50/90 border border-amber-200/90 text-slate-900 rounded-tl-xs'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs'
                }`}
              >
                {/* Assistant Verification Badge Header */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-100/90">
                    <div className="flex items-center space-x-1.5 font-bold">
                      {msg.isFallback ? (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          <span className="text-amber-800">Knowledge Gap / Safe Fallback</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-800">Verified Knowledge Grounded</span>
                        </>
                      )}
                    </div>
                    {msg.latencyMs && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {msg.latencyMs}ms • {msg.providerUsed || 'Grounded Engine'}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className={`text-sm leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-slate-800'}`}>
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                      return (
                        <div key={pIdx} className="space-y-1 my-2 pl-2">
                          {paragraph.split('\n').map((line, lIdx) => (
                            <div key={lIdx} className="flex items-start space-x-2">
                              <span className="text-blue-500 font-bold">•</span>
                              <span>{line.replace(/^(\d+\.|\-)\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return <p key={pIdx} className="my-1.5">{paragraph}</p>;
                  })}
                </div>

                {/* Visible Source References (Beside / Below Supported Answers) */}
                {msg.sources && msg.sources.length > 0 && !msg.isFallback && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span className="flex items-center space-x-1">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span>Supporting Knowledge Articles ({msg.sources.length}):</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                        Grounded
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => onOpenSourceArticle(src.slug || src.articleId)}
                          className="group/src p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/90 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                                Source #{sIdx + 1}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Score: {src.relevanceScore}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover/src:text-blue-600 line-clamp-1">
                              {src.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {src.excerpt}
                            </p>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-semibold text-blue-600">
                            <span>Open source documentation</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful / Not Helpful Feedback Controls for Assistant Messages */}
                {msg.sender === 'assistant' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px]">Was this response accurate?</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenFeedback(msg, 'helpful')}
                        className={`p-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                          msg.rating === 'helpful'
                            ? 'bg-emerald-100 text-emerald-700 font-bold'
                            : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title="Mark answer as helpful"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[10px]">Helpful</span>
                      </button>

                      <button
                        onClick={() => handleOpenFeedback(msg, 'not_helpful')}
                        className={`p-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                          msg.rating === 'not_helpful'
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title="Mark answer as not helpful"
                      >
                        <ThumbsDown className="h-3.5 w-3.5 text-rose-600" />
                        <span className="text-[10px]">Not Helpful</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start space-x-3 animate-in fade-in duration-200">
              <div className="h-9 w-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs max-w-sm space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>{loadingStage}</span>
                </div>
                <div className="flex space-x-1.5 pt-1">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a customer support question (e.g., How do I track my order?)..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-hidden text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Qualitative Feedback Modal */}
      {activeFeedbackMsg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {feedbackRating === 'helpful' ? '👍 Helpful Answer' : '👎 Not Helpful Answer'}
              </h3>
              <button
                onClick={() => setActiveFeedbackMsg(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {feedbackSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-center font-bold text-xs border border-emerald-200">
                {feedbackSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Optional Feedback Comments:
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Tell us what was missing, or how this answer helped you..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Email (Optional, for support follow-up):
                  </label>
                  <input
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveFeedbackMsg(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs disabled:opacity-50"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
