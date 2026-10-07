'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import { Listing, Review } from '@/lib/types';
import {
  Star, Heart, Share2, Award, Shield, Key, Wifi, Utensils, Car, Wind, Laptop, Waves, Flame, Sun, MapPin, X, Check, Calendar, Users, ChevronRight, MessageSquare
} from 'lucide-react';

function ListingDetailContent() {
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params?.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Wishlist state
  const [isFavorite, setIsFavorite] = useState(false);

  // Booking Calculator State
  const [checkIn, setCheckIn] = useState<string>('2026-10-22');
  const [checkOut, setCheckOut] = useState<string>('2026-10-26');
  const [guests, setGuests] = useState<number>(2);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isCheckingDates, setIsCheckingDates] = useState(false);

  // Modals state
  const [showGallery, setShowGallery] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // New Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Toast System
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

  // Fetch listing data & reviews
  const loadData = async () => {
    if (!listingId) return;
    setLoading(true);
    try {
      const data = await api.getListingById(listingId);
      setListing(data);

      const revs = await api.getListingReviews(listingId);
      setReviews(revs);

      const dates = await api.getBookedDates(listingId);
      setBookedDates(dates);

      // Check wishlist
      const wishlists = await api.getWishlists();
      setIsFavorite(wishlists.some((w) => w.listing_id === listingId));
    } catch (err) {
      console.error(err);
      addToast('error', 'Listing not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [listingId]);

  // Calculate nights
  const getNightsCount = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = getNightsCount();
  const nightlySubtotal = listing ? listing.price_per_night * nights : 0;
  const cleaningFee = listing?.cleaning_fee || 50;
  const serviceFee = listing?.service_fee || 30;
  const totalPrice = nightlySubtotal + cleaningFee + serviceFee;

  // Validate dates against collision
  const handleVerifyDates = async () => {
    if (!listing) return;
    setIsCheckingDates(true);
    setDateError(null);
    try {
      const res = await api.checkDateAvailability(listing.id, checkIn, checkOut);
      if (!res.available) {
        setDateError(res.message);
      } else {
        setDateError(null);
      }
    } catch (err) {
      setDateError('Selected dates overlap with existing booking');
    } finally {
      setIsCheckingDates(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      handleVerifyDates();
    }
  }, [checkIn, checkOut]);

  // Confirm Booking Action
  const handleReserveClick = async () => {
    if (dateError) {
      addToast('error', dateError);
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleFinalCheckout = async () => {
    if (!listing) return;
    try {
      await api.createBooking({
        listing_id: listing.id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guests,
        adults: guests,
        payment_method: 'Credit Card (Mocked)'
      });
      setShowCheckoutModal(false);
      addToast('success', 'Booking Confirmed! Redirecting to My Trips...');
      setTimeout(() => {
        router.push('/trips');
      }, 1500);
    } catch (err: any) {
      addToast('error', err?.response?.data?.detail || 'Booking failed');
    }
  };

  // Toggle wishlist
  const handleToggleWishlist = async () => {
    if (!listing) return;
    const isFav = await api.toggleWishlist(listing.id);
    setIsFavorite(isFav);
    addToast(isFav ? 'success' : 'info', isFav ? 'Saved to Wishlist!' : 'Removed from Wishlist');
  };

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !newComment.trim()) return;
    try {
      await api.createReview(listing.id, {
        rating: newRating,
        comment: newComment,
        cleanliness: 5.0,
        accuracy: 5.0,
        communication: 5.0,
        location: 5.0,
        check_in_rating: 5.0,
        value_rating: 5.0
      });
      addToast('success', 'Review published!');
      setShowReviewModal(false);
      setNewComment('');
      loadData();
    } catch (err) {
      addToast('error', 'Failed to publish review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="h-96 bg-neutral-200 rounded-3xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-6 bg-neutral-200 rounded w-1/2" />
              <div className="h-20 bg-neutral-200 rounded w-full" />
            </div>
            <div className="h-64 bg-neutral-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Navbar />
        <h2 className="text-xl font-bold mt-12">Listing Not Found</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-[#FF385C] underline">
          Back to Explore
        </button>
      </div>
    );
  }

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : [{ id: 0, listing_id: listing.id, url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', is_cover: true, order: 0 }];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900">
      
      <Toast toasts={toasts} onClose={removeToast} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full flex-1">
        
        {/* Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-700 font-medium mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{listing.rating.toFixed(2)}</span>
                <span>·</span>
                <span className="underline cursor-pointer">{listing.review_count} reviews</span>
              </div>
              <span>·</span>
              {listing.host?.superhost_status && (
                <>
                  <div className="flex items-center gap-1 text-[#FF385C]">
                    <Award className="w-4 h-4" />
                    <span>Guest favorite</span>
                  </div>
                  <span>·</span>
                </>
              )}
              <span className="underline font-semibold cursor-pointer">
                {listing.city}, {listing.state || listing.country}
              </span>
            </div>
          </div>

          {/* Share & Wishlist Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addToast('info', 'Link copied to clipboard!');
              }}
              className="flex items-center gap-2 border border-neutral-300 hover:bg-neutral-100 rounded-full px-4 py-2 text-xs font-semibold transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleToggleWishlist}
              className="flex items-center gap-2 border border-neutral-300 hover:bg-neutral-100 rounded-full px-4 py-2 text-xs font-semibold transition"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* 5-Photo Mosaic Gallery Grid */}
        <div className="relative rounded-3xl overflow-hidden mb-10 shadow-sm border border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-4/3 md:aspect-21/9 max-h-[480px]">
            {/* Cover Photo */}
            <div className="md:col-span-2 h-full overflow-hidden cursor-pointer" onClick={() => setShowGallery(true)}>
              <img
                src={photos[0]?.url}
                alt={listing.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
            
            {/* Grid Photos */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
              {photos.slice(1, 5).map((photo, i) => (
                <div key={photo.id || i} className="h-full overflow-hidden cursor-pointer" onClick={() => setShowGallery(true)}>
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Show all photos button */}
          <button
            onClick={() => setShowGallery(true)}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-neutral-900 border border-neutral-300 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <span className="grid grid-cols-2 gap-0.5 w-3 h-3">
              <span className="bg-neutral-800 rounded-xs" />
              <span className="bg-neutral-800 rounded-xs" />
              <span className="bg-neutral-800 rounded-xs" />
              <span className="bg-neutral-800 rounded-xs" />
            </span>
            Show all photos
          </button>
        </div>

        {/* Main Content & Sticky Booking Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Main Details Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Property Specs Header */}
            <div className="flex items-start justify-between pb-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {listing.room_type} hosted by {listing.host?.name}
                </h2>
                <p className="text-sm text-neutral-600 font-medium mt-1">
                  {listing.max_guests} guests · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} · {listing.beds} bed{listing.beds > 1 ? 's' : ''} · {listing.baths} bath{listing.baths > 1 ? 's' : ''}
                </p>
              </div>

              {/* Host Avatar */}
              <div className="relative shrink-0">
                <img
                  src={listing.host?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={listing.host?.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                />
                {listing.host?.superhost_status && (
                  <div className="absolute -bottom-1 -right-1 bg-[#FF385C] text-white p-1 rounded-full shadow-xs">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-6 pb-6 border-b border-neutral-200">
              <div className="flex items-start gap-4">
                <Laptop className="w-6 h-6 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">Dedicated workspace</h4>
                  <p className="text-xs text-neutral-500">A room with fast wifi that is well suited for working.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Key className="w-6 h-6 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">Self check-in</h4>
                  <p className="text-xs text-neutral-500">Check yourself in with the smart lock system.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">Free cancellation before 48 hours</h4>
                  <p className="text-xs text-neutral-500">Get a full refund if your plans change.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">About this space</h3>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="pb-6 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.amenities?.slice(0, 8).map((am) => (
                  <div key={am.id} className="flex items-center gap-3 text-sm text-neutral-800 font-medium">
                    <Check className="w-4 h-4 text-[#FF385C]" />
                    <span>{am.name}</span>
                  </div>
                ))}
              </div>

              {listing.amenities && listing.amenities.length > 8 && (
                <button
                  onClick={() => setShowAmenitiesModal(true)}
                  className="mt-6 border border-neutral-900 hover:bg-neutral-50 px-6 py-3 rounded-xl text-xs font-semibold text-neutral-900 transition"
                >
                  Show all {listing.amenities.length} amenities
                </button>
              )}
            </div>

          </div>

          {/* Right Sticky Booking Calculator Widget */}
          <div className="relative">
            <div className="sticky top-28 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl space-y-6">
              
              {/* Widget Header Price */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold text-neutral-950">${listing.price_per_night}</span>
                  <span className="text-neutral-500 text-sm font-normal"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{listing.rating.toFixed(2)}</span>
                  <span>({listing.review_count})</span>
                </div>
              </div>

              {/* Date & Guest Controls */}
              <div className="border border-neutral-300 rounded-2xl overflow-hidden divide-y divide-neutral-300 shadow-xs">
                {/* Dates */}
                <div className="grid grid-cols-2 divide-x divide-neutral-300 bg-white">
                  <div className="p-3">
                    <label className="block text-[10px] uppercase font-bold text-neutral-700">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs font-semibold text-neutral-900 focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] uppercase font-bold text-neutral-700">Check-out</label>
                    <input
                      type="date"
                      min={checkIn}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs font-semibold text-neutral-900 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="p-3 bg-white">
                  <label className="block text-[10px] uppercase font-bold text-neutral-700">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-neutral-900 focus:outline-none bg-transparent cursor-pointer"
                  >
                    {Array.from({ length: listing.max_guests }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Validation Warning */}
              {dateError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  ⚠️ {dateError}
                </div>
              )}

              {/* CTA Reserve Button */}
              <button
                onClick={handleReserveClick}
                disabled={Boolean(dateError) || isCheckingDates}
                className="w-full bg-gradient-to-r from-[#FF385C] to-[#E00B41] hover:brightness-105 text-white font-bold py-3.5 rounded-xl text-base shadow-md transition active:scale-[0.99] disabled:opacity-50"
              >
                {isCheckingDates ? 'Checking availability...' : 'Reserve Stay'}
              </button>

              <p className="text-center text-xs text-neutral-500 font-medium">
                You won't be charged yet
              </p>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm text-neutral-700 pt-2 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span className="underline">${listing.price_per_night} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>${nightlySubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Airbnb service fee</span>
                  <span>${serviceFee}</span>
                </div>

                <hr className="border-neutral-200" />

                <div className="flex justify-between font-bold text-base text-neutral-950 pt-1">
                  <span>Total before taxes</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-12 border-t border-neutral-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              <h3 className="text-2xl font-bold text-neutral-900">
                {listing.rating.toFixed(2)} · {reviews.length} reviews
              </h3>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-2 border border-neutral-900 hover:bg-neutral-50 px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-900 transition shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-[#FF385C]" />
              Write a Review
            </button>
          </div>

          {/* Rating Categories Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
            {[
              { label: 'Cleanliness', score: 5.0 },
              { label: 'Accuracy', score: 4.9 },
              { label: 'Communication', score: 5.0 },
              { label: 'Location', score: 5.0 },
              { label: 'Check-in', score: 5.0 },
              { label: 'Value', score: 4.8 },
            ].map((cat) => (
              <div key={cat.label} className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-neutral-800">{cat.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full"
                      style={{ width: `${(cat.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-neutral-900">{cat.score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev) => (
              <div key={rev.id} className="space-y-3 p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={rev.user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{rev.user?.name || 'Guest'}</h4>
                    <span className="text-xs text-neutral-500 font-medium">{rev.created_at.slice(0, 10)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(rev.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

        </div>

      </main>

      <Footer />

      {/* --- MODALS --- */}

      {/* Lightbox Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full mb-6">
            <span className="font-bold text-lg">{listing.title} Photos</span>
            <button
              onClick={() => setShowGallery(false)}
              className="p-2 hover:bg-neutral-800 rounded-full transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="max-w-4xl mx-auto space-y-6 w-full pb-12">
            {photos.map((p, i) => (
              <img
                key={p.id || i}
                src={p.url}
                alt=""
                className="w-full rounded-2xl object-cover shadow-2xl"
              />
            ))}
          </div>
        </div>
      )}

      {/* Amenities Modal */}
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">All Amenities</h3>
              <button onClick={() => setShowAmenitiesModal(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto py-2">
              {listing.amenities?.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 text-sm font-semibold">
                  <Check className="w-4 h-4 text-[#FF385C]" />
                  <span>{a.name} ({a.category})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mocked Checkout Confirmation Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95 duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-neutral-100 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h3 className="text-lg font-bold text-neutral-900">Confirm Booking</h3>
              <button onClick={() => setShowCheckoutModal(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-neutral-800">
              <div className="flex gap-4 items-center bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                <img src={photos[0]?.url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-neutral-900 line-clamp-1">{listing.title}</h4>
                  <p className="text-xs text-neutral-500">{listing.city}, {listing.country}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-medium bg-neutral-50 p-4 rounded-2xl">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Check-in:</span>
                  <span className="font-bold">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Check-out:</span>
                  <span className="font-bold">{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Guests:</span>
                  <span className="font-bold">{guests} Guests</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-950">
                  <span>Total Amount:</span>
                  <span className="text-[#FF385C]">${totalPrice}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mock Checkout: No real credit card charge will occur.</span>
              </div>
            </div>

            <button
              onClick={handleFinalCheckout}
              className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold py-3.5 rounded-xl shadow-md transition"
            >
              Pay ${totalPrice} & Confirm Reservation
            </button>
          </div>
        </div>
      )}

      {/* Leave Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmitReview} className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg">Leave a Review</h3>
              <button type="button" onClick={() => setShowReviewModal(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Your Comment</label>
              <textarea
                rows={4}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience staying at this home..."
                className="w-full border border-neutral-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-3 rounded-xl text-xs"
            >
              Post Review
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

export default function ListingDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading stay details...</div>}>
      <ListingDetailContent />
    </Suspense>
  );
}
