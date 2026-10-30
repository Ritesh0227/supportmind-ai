// client/src/components/knowledge/CategoryGrid.tsx
import React from 'react';
import {
  UserCheck,
  CreditCard,
  Package,
  Truck,
  RefreshCw,
  Layers,
  Terminal,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { ArticleCategory } from '../../types.js';

interface CategoryGridProps {
  categories: ArticleCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="h-6 w-6 text-blue-600" />,
  CreditCard: <CreditCard className="h-6 w-6 text-emerald-600" />,
  Package: <Package className="h-6 w-6 text-amber-600" />,
  Truck: <Truck className="h-6 w-6 text-indigo-600" />,
  RefreshCw: <RefreshCw className="h-6 w-6 text-rose-600" />,
  Layers: <Layers className="h-6 w-6 text-purple-600" />,
  Terminal: <Terminal className="h-6 w-6 text-cyan-600" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-teal-600" />,
};

const COLOR_MAP: Record<string, string> = {
  UserCheck: 'bg-blue-50 border-blue-100',
  CreditCard: 'bg-emerald-50 border-emerald-100',
  Package: 'bg-amber-50 border-amber-100',
  Truck: 'bg-indigo-50 border-indigo-100',
  RefreshCw: 'bg-rose-50 border-rose-100',
  Layers: 'bg-purple-50 border-purple-100',
  Terminal: 'bg-cyan-50 border-cyan-100',
  ShieldCheck: 'bg-teal-50 border-teal-100',
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Browse Knowledge Base</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Explore Support Categories
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Select a category to view all approved articles, policies, and troubleshooting procedures.
          </p>
        </div>

        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="mt-3 sm:mt-0 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors inline-flex items-center"
          >
            Show All Categories
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const iconEl = ICON_MAP[cat.icon] || <HelpCircle className="h-6 w-6 text-slate-600" />;
          const iconBg = COLOR_MAP[cat.icon] || 'bg-slate-50 border-slate-100';

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 bg-white ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md translate-y-[-2px]'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-card hover:translate-y-[-2px]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl border ${iconBg} transition-transform group-hover:scale-105`}>
                  {iconEl}
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                  {cat.articleCount ?? 0} {cat.articleCount === 1 ? 'article' : 'articles'}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-blue-600">
                <span>View articles</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
