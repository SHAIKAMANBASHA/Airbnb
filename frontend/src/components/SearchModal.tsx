'use client';

import React, { useState } from 'react';
import { Search, X, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onApplySearch,
  initialFilters = {}
}) => {
  const [city, setCity] = useState(initialFilters.city || '');
  const [checkIn, setCheckIn] = useState(initialFilters.check_in || '');
  const [checkOut, setCheckOut] = useState(initialFilters.check_out || '');
  const [adults, setAdults] = useState(initialFilters.guests || 1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);

  if (!isOpen) return null;

  const popularDestinations = [
    { name: 'Malibu', region: 'California, US' },
    { name: 'Aspen', region: 'Colorado, US' },
    { name: 'Beverly Hills', region: 'California, US' },
    { name: 'Santorini', region: 'Greece' },
    { name: 'Kyoto', region: 'Japan' },
    { name: 'Ubud', region: 'Bali, Indonesia' }
  ];

  const handleSearch = () => {
    const totalGuests = adults + childrenCount;
    onApplySearch({
      city: city.trim() || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: totalGuests > 0 ? totalGuests : undefined
    });
    onClose();
  };

  const handleClear = () => {
    setCity('');
    setCheckIn('');
    setCheckOut('');
    setAdults(1);
    setChildrenCount(0);
    setInfants(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Search Stays</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Where / Destination */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              <MapPin className="w-4 h-4 text-[#FF385C]" /> Where to?
            </label>
            <input
              type="text"
              placeholder="Search destination (e.g. Malibu, Aspen, Kyoto)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            />

            {/* Quick Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => setCity(dest.name)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                    city.toLowerCase() === dest.name.toLowerCase()
                      ? 'bg-[#FF385C] text-white border-[#FF385C]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
              <Calendar className="w-4 h-4 text-[#FF385C]" /> When are you going?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-neutral-500 font-medium mb-1">Check-in Date</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                />
              </div>
              <div>
                <span className="block text-xs text-neutral-500 font-medium mb-1">Check-out Date</span>
                <input
                  type="date"
                  min={checkIn || undefined}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                />
              </div>
            </div>
          </div>

          {/* Guests counter */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
              <Users className="w-4 h-4 text-[#FF385C]" /> Who is coming?
            </label>
            
            <div className="space-y-4 divide-y divide-neutral-200">
              {/* Adults */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">Adults</div>
                  <div className="text-xs text-neutral-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-300 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-neutral-900">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">Children</div>
                  <div className="text-xs text-neutral-500">Ages 2–12</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                    disabled={childrenCount <= 0}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-300 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-neutral-900">{childrenCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildrenCount(childrenCount + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-white flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-neutral-800 hover:underline transition"
          >
            Clear all
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            <Search className="w-4 h-4 stroke-[3]" />
            Search
          </button>
        </div>

      </div>
    </div>
  );
};
