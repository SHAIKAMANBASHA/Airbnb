'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CategoryBar } from '@/components/CategoryBar';
import { SearchModal } from '@/components/SearchModal';
import { FilterModal } from '@/components/FilterModal';
import { ListingCard } from '@/components/ListingCard';
import { Footer } from '@/components/Footer';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import { Listing, SearchFilters } from '@/lib/types';
import { RefreshCw, SearchX } from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'guest' | 'host'>('guest');
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add Toast Notification
  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Wishlists
  const fetchWishlists = async () => {
    try {
      const items = await api.getWishlists();
      setFavoriteIds(items.map((i) => i.listing_id));
    } catch (err) {
      console.error('Failed to fetch wishlists:', err);
    }
  };

  // Fetch Listings with current filters
  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await api.getListings({
        ...searchFilters,
        category: activeCategory !== 'all' ? activeCategory : undefined
      });
      setListings(data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      addToast('error', 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [activeCategory, searchFilters]);

  // Toggle Wishlist handler
  const handleToggleWishlist = async (listingId: number) => {
    try {
      const isFav = await api.toggleWishlist(listingId);
      if (isFav) {
        setFavoriteIds((prev) => [...prev, listingId]);
        addToast('success', 'Saved to your Wishlist!');
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== listingId));
        addToast('info', 'Removed from Wishlist');
      }
    } catch (err) {
      addToast('error', 'Failed to update wishlist');
    }
  };

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
  };

  const handleApplySearch = (newFilters: SearchFilters) => {
    setSearchFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchFilters({});
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-neutral-900">
      
      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Header Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        filters={searchFilters}
        mode={mode}
        setMode={setMode}
      />

      {/* Categories Bar */}
      <CategoryBar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      {/* Main Listing Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1 w-full">
        
        {/* Active Filter Pills (if any) */}
        {(searchFilters.city || searchFilters.check_in || searchFilters.guests || searchFilters.min_price || searchFilters.property_type) && (
          <div className="mb-6 flex flex-wrap items-center gap-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mr-2">
              Active Filters:
            </span>
            {searchFilters.city && (
              <span className="bg-white border border-neutral-300 text-xs px-3 py-1 rounded-full font-medium text-neutral-800">
                City: {searchFilters.city}
              </span>
            )}
            {searchFilters.check_in && searchFilters.check_out && (
              <span className="bg-white border border-neutral-300 text-xs px-3 py-1 rounded-full font-medium text-neutral-800">
                Dates: {searchFilters.check_in} to {searchFilters.check_out}
              </span>
            )}
            {searchFilters.guests && (
              <span className="bg-white border border-neutral-300 text-xs px-3 py-1 rounded-full font-medium text-neutral-800">
                Guests: {searchFilters.guests}+
              </span>
            )}
            {searchFilters.min_price && (
              <span className="bg-white border border-neutral-300 text-xs px-3 py-1 rounded-full font-medium text-neutral-800">
                Min Price: ${searchFilters.min_price}
              </span>
            )}
            {searchFilters.property_type && (
              <span className="bg-white border border-neutral-300 text-xs px-3 py-1 rounded-full font-medium text-neutral-800">
                Type: {searchFilters.property_type}
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#FF385C] font-semibold hover:underline ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="bg-neutral-200 aspect-4/3 sm:aspect-square rounded-2xl w-full" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
                <div className="h-4 bg-neutral-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          /* Empty State */
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#FF385C] flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No stays found</h3>
            <p className="text-sm text-neutral-500 max-w-md mb-6">
              Try changing or clearing your search filters, or pick a different category to explore available properties.
            </p>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              <RefreshCw className="w-4 h-4" />
              Reset all filters
            </button>
          </div>
        ) : (
          /* Listings Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isFavorite={favoriteIds.includes(listing.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onApplySearch={handleApplySearch}
        initialFilters={searchFilters}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={searchFilters}
        onApplyFilters={handleApplyFilters}
      />

    </div>
  );
}
