'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ListingCard } from '@/components/ListingCard';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import { Wishlist } from '@/lib/types';
import { Heart, Compass } from 'lucide-react';

export default function WishlistsPage() {
  const [items, setItems] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const data = await api.getWishlists();
      setItems(data);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to load wishlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  const handleToggleWishlist = async (listingId: number) => {
    try {
      await api.toggleWishlist(listingId);
      addToast('info', 'Removed from Wishlist');
      fetchWishlists();
    } catch (err) {
      addToast('error', 'Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900">
      <Toast toasts={toasts} onClose={removeToast} />
      <Navbar mode="guest" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-rose-50 rounded-2xl text-[#FF385C]">
            <Heart className="w-6 h-6 fill-[#FF385C]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Wishlists</h1>
            <p className="text-sm text-neutral-500 font-medium">Your saved favorite places to stay</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-neutral-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center bg-neutral-50 rounded-3xl border border-neutral-200 p-8">
            <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">Your wishlist is empty</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              As you search, tap the heart icon on any stay to save your favorite stays here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              <Compass className="w-4 h-4" />
              Explore Homes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((item) => (
              <ListingCard
                key={item.id}
                listing={item.listing}
                isFavorite={true}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
