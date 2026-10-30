// client/src/components/testsuite/TestSuiteModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { TestQuestion, TestRunResult } from '../../types.js';
import { api } from '../../services/api.js';

interface TestSuiteModalProps {
  onClose: () => void;
  onTestInChat: (question: string) => void;
}

export const TestSuiteModal: React.FC<TestSuiteModalProps> = ({
  onClose,
  onTestInChat,
}) => {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [evalResult, setEvalResult] = useState<TestRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getTestQuestions().then(setQuestions).catch(console.error);
  }, []);

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await api.runTestSuite();
      setEvalResult(res);
    } catch (err: any) {
      setError(err.message || 'Evaluation run failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Automated Evaluation & Benchmark Suite
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  HACK-P380 Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates grounding accuracy, source citations, and anti-hallucination safe fallbacks across standard test cases.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Action / Metric Banner */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-6 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Benchmark Cases</span>
              <span className="font-extrabold text-lg">{questions.length} Questions</span>
            </div>
            {evalResult && (
              <>
                <div className="border-l border-slate-700 pl-6">
                  <span className="text-slate-400 block text-[11px]">Accuracy Score</span>
                  <span className="font-extrabold text-lg text-emerald-400">
                    {evalResult.accuracyPercentage}%
                  </span>
                </div>
                <div className="border-l border-slate-700 pl-6">
                  <span className="text-slate-400 block text-[11px]">Verification Status</span>
                  <span className="font-bold text-emerald-300">
                    {evalResult.passedCount} Passed / {evalResult.failedCount} Failed
                  </span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={isRunning}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Live Evaluation...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-slate-950" />
                <span>Run Full Evaluation Suite</span>
              </>
            )}
          </button>
        </div>

        {/* Test Questions & Results List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const res = evalResult?.results.find((r) => r.id === q.id);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    res
                      ? res.passed
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                      : 'bg-white border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          Case #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                          {q.expectedCategory}
                        </span>
                        {res && (
                          <span
                            className={`inline-flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                              res.passed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {res.passed ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                <span>PASSED</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3.5 w-3.5 text-rose-600" />
                                <span>FAILED</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        "{q.question}"
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onTestInChat(q.question);
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors self-start shrink-0"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Test in Chat</span>
                    </button>
                  </div>

                  {/* Criteria & Expected Source */}
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>
                      <strong className="text-slate-700">Expected Article:</strong>{' '}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-700">
                        {q.expectedArticleSlug}
                      </code>
                    </span>
                    {q.keyVerificationPoints && (
                      <span className="text-slate-400">
                        Key rules: {q.keyVerificationPoints.join(' • ')}
                      </span>
                    )}
                  </div>

                  {/* Evaluation Result Breakdown */}
                  {res && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs space-y-2 bg-white/70 p-3 rounded-xl">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-800">Evaluation Proof:</span>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{res.latencyMs}ms</span>
                          </span>
                          <span>• {res.providerUsed}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 font-medium">{res.reason}</p>

                      {res.sources.length > 0 && (
                        <div className="flex items-center space-x-1 text-[11px] text-blue-700 font-semibold">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Grounded Citations: {res.sources.map((s) => `"${s.title}"`).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
