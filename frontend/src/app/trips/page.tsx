'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import { Booking } from '@/lib/types';
import { Briefcase, Calendar, MapPin, XCircle, ChevronRight } from 'lucide-react';

export default function MyTripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
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

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await api.getMyTrips();
      setBookings(data);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await api.cancelBooking(bookingId);
      addToast('info', 'Reservation cancelled');
      fetchTrips();
    } catch (err) {
      addToast('error', 'Could not cancel booking');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-neutral-900">
      <Toast toasts={toasts} onClose={removeToast} />
      <Navbar mode="guest" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-rose-50 rounded-2xl text-[#FF385C]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">My Trips</h1>
            <p className="text-sm text-neutral-500 font-medium">Manage your active and past reservations</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 bg-neutral-100 rounded-3xl animate-pulse w-full" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center bg-neutral-50 rounded-3xl border border-neutral-200 p-8">
            <Briefcase className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">No trips booked yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              Time to dust off your bags and start planning your next great adventure.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              Start Exploring Homes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => {
              const coverPhoto = b.listing?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80';
              const isConfirmed = b.status === 'confirmed';

              return (
                <div
                  key={b.id}
                  className="flex flex-col md:flex-row bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition p-4 md:p-6 gap-6 items-center justify-between"
                >
                  {/* Photo & Specs */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
                    <img
                      src={coverPhoto}
                      alt={b.listing?.title}
                      className="w-full sm:w-40 h-32 rounded-2xl object-cover shrink-0"
                    />
                    <div className="space-y-1.5 w-full text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-xs text-neutral-400">Booking #{b.id}</span>
                      </div>

                      <h3 className="text-base font-bold text-neutral-900 line-clamp-1">
                        {b.listing?.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                        <span>{b.listing?.city}, {b.listing?.country}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{b.check_in} → {b.check_out} ({b.guests_count} Guests)</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-neutral-200 gap-3">
                    <div className="text-left sm:text-right">
                      <span className="block text-xs text-neutral-400 font-medium">Total Paid</span>
                      <span className="text-xl font-bold text-neutral-950">${b.total_price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/listings/${b.listing_id}`}
                        className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition"
                      >
                        View Stay
                      </Link>

                      {isConfirmed && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
