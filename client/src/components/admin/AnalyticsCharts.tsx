// client/src/components/admin/AnalyticsCharts.tsx
import React from 'react';
import { DashboardStats } from '../../types.js';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

interface AnalyticsChartsProps {
  stats: DashboardStats;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats }) => {
  const maxCategoryCount = Math.max(...stats.articlesByCategory.map((c) => c.count), 1);
  const totalFeedback = stats.helpfulFeedbackCount + stats.notHelpfulFeedbackCount;
  const helpfulPct = totalFeedback > 0 ? Math.round((stats.helpfulFeedbackCount / totalFeedback) * 100) : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
      {/* 1. Category Distribution Bar Chart */}
      <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Knowledge Coverage by Category</h3>
              <p className="text-xs text-slate-500">Number of published articles per support category</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {stats.articlesByCategory.map((item) => {
            const pct = Math.round((item.count / maxCategoryCount) * 100);
            return (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.category}</span>
                  <span className="text-slate-500">{item.count} articles</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(pct, 8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Customer Sentiment & Satisfaction Ring */}
      <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <PieIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Customer Satisfaction Sentiment</h3>
              <p className="text-xs text-slate-500">Real-time ratings on AI-generated answers</p>
            </div>
          </div>

          <div className="py-4 text-center">
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-tr from-emerald-50 to-blue-50 border-4 border-emerald-500/30 text-emerald-600 mb-3 shadow-inner">
              <span className="text-4xl font-extrabold text-slate-900">{helpfulPct}%</span>
            </div>
            <p className="text-xs font-bold text-slate-700">Positive Resolution Rate</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Based on verified customer feedback ratings</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Helpful</span>
            <div className="text-xl font-extrabold text-emerald-800 mt-0.5">{stats.helpfulFeedbackCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Not Helpful</span>
            <div className="text-xl font-extrabold text-rose-800 mt-0.5">{stats.notHelpfulFeedbackCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
