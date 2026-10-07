'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, DollarSign, Home, BedDouble } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters
}) => {
  const [minPrice, setMinPrice] = useState<number | string>(filters.min_price || '');
  const [maxPrice, setMaxPrice] = useState<number | string>(filters.max_price || '');
  const [propertyType, setPropertyType] = useState<string>(filters.property_type || 'any');
  const [bedrooms, setBedrooms] = useState<number>(filters.bedrooms || 0);

  if (!isOpen) return null;

  const propertyTypes = ['any', 'Villa', 'Chalet', 'Mansion', 'Dome', 'Cave House', 'Chateau', 'A-Frame', 'Treehouse'];

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      property_type: propertyType !== 'any' ? propertyType : undefined,
      bedrooms: bedrooms > 0 ? bedrooms : undefined
    });
    onClose();
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('any');
    setBedrooms(0);
    onApplyFilters({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-neutral-900">Filters</h2>
          <div className="w-9"></div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Price Range */}
          <div>
            <h3 className="text-base font-semibold text-neutral-900 mb-1 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#FF385C]" /> Price range
            </h3>
            <p className="text-xs text-neutral-500 mb-4">Nightly prices before taxes and fees</p>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 border border-neutral-300 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-[#FF385C]">
                <span className="block text-xs text-neutral-400 font-medium">Minimum</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-semibold text-neutral-500">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <span className="text-neutral-400 font-semibold">–</span>

              <div className="flex-1 border border-neutral-300 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-[#FF385C]">
                <span className="block text-xs text-neutral-400 font-medium">Maximum</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-semibold text-neutral-500">$</span>
                  <input
                    type="number"
                    placeholder="2000+"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* Property Type */}
          <div>
            <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Home className="w-4 h-4 text-[#FF385C]" /> Property type
            </h3>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
                  className={`px-4 py-2.5 rounded-full border text-xs font-semibold transition ${
                    propertyType.toLowerCase() === type.toLowerCase()
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {type === 'any' ? 'Any type' : type}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* Bedrooms Selector */}
          <div>
            <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-[#FF385C]" /> Bedrooms
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setBedrooms(num)}
                  className={`px-5 py-2.5 rounded-full border text-xs font-semibold transition min-w-[50px] text-center ${
                    bedrooms === num
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {num === 0 ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-white flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-neutral-800 hover:underline transition"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-md"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};
