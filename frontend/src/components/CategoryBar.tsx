'use client';

import React from 'react';
import { Waves, Mountain, Building2, Sparkles, Trees, Anchor, Flame, Star, LayoutGrid, SlidersHorizontal } from 'lucide-react';

interface CategoryBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenFilters?: () => void;
}

export const categories = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'Beachfront', label: 'Beachfront', icon: Waves },
  { id: 'Cabins', label: 'Cabins', icon: Mountain },
  { id: 'Mansions', label: 'Mansions', icon: Building2 },
  { id: 'OMG!', label: 'OMG!', icon: Sparkles },
  { id: 'Countryside', label: 'Countryside', icon: Trees },
  { id: 'Lakefront', label: 'Lakefront', icon: Anchor },
  { id: 'Amazing pools', label: 'Amazing pools', icon: Flame },
  { id: 'Icons', label: 'Icons', icon: Star },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenFilters
}) => {
  return (
    <div className="bg-white border-b border-neutral-200/80 sticky top-20 z-30 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Horizontally scrollable list */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2 scroll-smooth flex-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 border-b-2 pb-2 px-1 transition duration-200 cursor-pointer shrink-0 group ${
                  isActive
                    ? 'border-neutral-950 text-neutral-950 font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 font-medium'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-neutral-950 stroke-[2.2]' : 'text-neutral-500'
                  }`}
                />
                <span className="text-xs whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters Modal Button */}
        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 border border-neutral-300 hover:border-neutral-900 rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-800 transition shadow-xs bg-white shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
            <span>Filters</span>
          </button>
        )}

      </div>
    </div>
  );
};
