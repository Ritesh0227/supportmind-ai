// client/src/components/chat/ChatWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  ShieldCheck,
  Loader2,
  Settings2,
} from 'lucide-react';
import { ChatMessage, SourceCitation, SystemConfig } from '../../types.js';
import { MessageBubble } from './MessageBubble.js';
import { FeedbackModal } from './FeedbackModal.js';
import { api } from '../../services/api.js';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialQuery?: string;
  onOpenSourceArticle: (slug: string) => void;
}

const STARTER_QUESTIONS = [
  'How do I reset my password?',
  'Where can I find my invoice?',
  'How do I track my order?',
  'Can I cancel my order?',
  'How do I request a return?',
  'Why was my payment declined?',
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  initialQuery,
  onOpenSourceArticle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStage, setTypingStage] = useState('Searching knowledge base...');
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [activeFeedback, setActiveFeedback] = useState<{ messageId: string; rating: 'helpful' | 'not_helpful' } | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('builtin');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load system config
  useEffect(() => {
    api.getSystemConfig().then((cfg) => {
      setSystemConfig(cfg);
      if (cfg.activeProvider) setSelectedProvider(cfg.activeProvider);
    }).catch(console.error);
  }, []);

  // Handle initialQuery if passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputText).trim();
    if (!query || isTyping) return;

    setInputText('');

    // Add customer message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      conversationId: conversationId || '',
      sender: 'user',
      content: query,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTypingStage('Searching approved knowledge base...');

    const timer1 = setTimeout(() => {
      setTypingStage('Verifying policy compliance...');
    }, 400);

    const timer2 = setTimeout(() => {
      setTypingStage('Synthesizing grounded response...');
    }, 800);

    try {
      const res = await api.sendChatMessage({
        sessionId,
        query,
        conversationId,
        provider: selectedProvider,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (res.conversationId && !conversationId) {
        setConversationId(res.conversationId);
      }

      const assistantMsg: ChatMessage = {
        id: res.messageId,
        conversationId: res.conversationId,
        sender: 'assistant',
        content: res.answer,
        sources: res.sources,
        isFallback: res.isFallback,
        latencyMs: res.latencyMs,
        providerUsed: res.providerUsed,
        createdAt: res.createdAt,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        conversationId: conversationId || '',
        sender: 'assistant',
        content:
          "I encountered an unexpected connection issue. Please make sure the SupportMind backend server is running, or contact our support desk.",
        isFallback: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setConversationId(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button (when closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Open SupportMind AI Assistant"
          className="fixed bottom-6 right-6 z-40 group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-elevated hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>
          <span className="font-bold text-sm hidden sm:inline">Ask AI Assistant</span>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-elevated border border-slate-200/90 overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-6 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] h-[640px] max-h-[90vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm tracking-tight">SupportMind AI</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center space-x-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>Grounded in approved knowledge only</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Provider Quick Dropdown */}
              {systemConfig && (
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-[10px] px-2 py-1 rounded-lg border border-slate-700 focus:outline-none"
                  title="Configure AI Provider"
                >
                  <option value="builtin">Built-in RAG Engine</option>
                  <option value="openai" disabled={!systemConfig.providers.openai?.available}>
                    OpenAI {systemConfig.providers.openai?.available ? '' : '(No Key)'}
                  </option>
                  <option value="gemini" disabled={!systemConfig.providers.gemini?.available}>
                    Gemini {systemConfig.providers.gemini?.available ? '' : '(No Key)'}
                  </option>
                  <option value="ollama" disabled={!systemConfig.providers.ollama?.available}>
                    Ollama 3.2 {systemConfig.providers.ollama?.available ? '(Local)' : '(Offline)'}
                  </option>
                </select>
              )}

              {messages.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  title="Clear conversation"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors hidden sm:block"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
                title="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/70 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-6 px-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">
                  Welcome to SupportMind Assistant
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                  Ask any question about account access, invoices, order tracking, returns, or technical troubleshooting.
                </p>

                {/* Quick Starters */}
                <div className="text-left">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                    Suggested Questions:
                  </span>
                  <div className="space-y-1.5">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="w-full text-left text-xs p-2.5 rounded-xl bg-white hover:bg-blue-50/90 text-slate-700 hover:text-blue-700 border border-slate-200/90 hover:border-blue-200 transition-all shadow-2xs font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onOpenSource={(src) => onOpenSourceArticle(src.slug)}
                  onOpenFeedback={(msgId, rating) =>
                    setActiveFeedback({ messageId: msgId, rating })
                  }
                />
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 py-2 px-3 bg-white/90 rounded-2xl border border-slate-200/80 w-fit animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                <span>{typingStage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <textarea
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="flex-1 resize-none text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 max-h-24 text-slate-900"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Strict anti-hallucination policy active</span>
              <span>Press Enter ↵ to send</span>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {activeFeedback && conversationId && (
        <FeedbackModal
          messageId={activeFeedback.messageId}
          conversationId={conversationId}
          initialRating={activeFeedback.rating}
          onClose={() => setActiveFeedback(null)}
          onSubmitted={() => {
            // Update message locally
            setMessages((prev) =>
              prev.map((m) =>
                m.id === activeFeedback.messageId ? { ...m, rating: activeFeedback.rating } : m
              )
            );
          }}
        />
      )}
    </>
  );
};
