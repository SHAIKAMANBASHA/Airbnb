'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import { Listing, Booking, HostStats } from '@/lib/types';
import {
  LayoutDashboard, PlusCircle, DollarSign, Home, Calendar, Star, Edit, Trash2, Eye, Award
} from 'lucide-react';

export default function HostDashboardPage() {
  const [stats, setStats] = useState<HostStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'reservations'>('listings');
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

  const loadHostData = async () => {
    setLoading(true);
    try {
      const s = await api.getHostStats(1);
      setStats(s);

      const l = await api.getHostListings(1);
      setListings(l);

      const r = await api.getHostReservations(1);
      setReservations(r);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to load host dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostData();
  }, []);

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.deleteListing(listingId, 1);
      addToast('success', 'Listing deleted');
      loadHostData();
    } catch (err) {
      addToast('error', 'Could not delete listing');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900">
      <Toast toasts={toasts} onClose={removeToast} />
      <Navbar mode="host" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full flex-1">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neutral-900 text-white rounded-2xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Host Dashboard</h1>
              <p className="text-sm text-neutral-500 font-medium">Manage your properties and guest reservations</p>
            </div>
          </div>

          <Link
            href="/host/create"
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Listing
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
            <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Total Earnings</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-950">${stats?.total_earnings || 0}</span>
              <DollarSign className="w-6 h-6 text-emerald-600 bg-emerald-100 p-1.5 rounded-full" />
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
            <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Active Listings</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-950">{stats?.total_listings || 0}</span>
              <Home className="w-6 h-6 text-sky-600 bg-sky-100 p-1.5 rounded-full" />
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
            <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Total Reservations</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-950">{stats?.total_reservations || 0}</span>
              <Calendar className="w-6 h-6 text-amber-600 bg-amber-100 p-1.5 rounded-full" />
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
            <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Average Rating</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-950">{stats?.average_rating?.toFixed(2) || '5.0'}</span>
              <Star className="w-6 h-6 text-amber-500 fill-amber-400 bg-amber-100 p-1.5 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-4 border-b border-neutral-200 mb-8">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'listings'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            My Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'reservations'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Guest Reservations ({reservations.length})
          </button>
        </div>

        {/* Tab 1: Managed Listings */}
        {activeTab === 'listings' && (
          loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-28 bg-neutral-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-16 text-center bg-neutral-50 rounded-3xl border border-neutral-200 p-8">
              <Home className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold">You don't have any listings yet</h3>
              <p className="text-xs text-neutral-500 mb-4">Start earning by publishing your property on Airbnb.</p>
              <Link
                href="/host/create"
                className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Create First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row gap-5 items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.photos?.[0]?.url || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'}
                      alt={item.title}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-neutral-500 font-medium">{item.city}, {item.country}</p>
                      <p className="text-xs text-neutral-500 font-medium">{item.category} · {item.property_type}</p>
                      <div className="mt-2 text-sm font-bold text-neutral-950">
                        ${item.price_per_night} <span className="text-xs text-neutral-500 font-normal">/ night</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                    <Link
                      href={`/listings/${item.id}`}
                      className="p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 transition"
                      title="View Stay"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/host/edit/${item.id}`}
                      className="p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 transition"
                      title="Edit Stay"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition"
                      title="Delete Stay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Tab 2: Guest Reservations */}
        {activeTab === 'reservations' && (
          reservations.length === 0 ? (
            <div className="py-16 text-center bg-neutral-50 rounded-3xl border border-neutral-200 p-8">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold">No reservations yet</h3>
              <p className="text-xs text-neutral-500">Bookings for your properties will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {res.user?.name?.[0] || 'G'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">Guest: {res.user?.name || 'Guest'}</h4>
                      <p className="text-xs text-neutral-600 font-medium">Property: {res.listing?.title}</p>
                      <p className="text-xs text-neutral-500">Dates: {res.check_in} to {res.check_out} ({res.guests_count} Guests)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                    <div>
                      <span className="block text-xs text-neutral-400 font-medium">Payout</span>
                      <span className="text-base font-bold text-neutral-950">${res.total_price}</span>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </main>

      <Footer />
    </div>
  );
}
