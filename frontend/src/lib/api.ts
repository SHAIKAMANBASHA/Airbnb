import axios from 'axios';
import { Listing, Booking, Review, Wishlist, HostStats, SearchFilters, Amenity, User } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = {
  // Users
  getCurrentUser: async (role: 'guest' | 'host' = 'guest'): Promise<User> => {
    const res = await axios.get(`${API_BASE}/users/me?role=${role}`);
    return res.data;
  },

  // Listings
  getListings: async (filters: SearchFilters = {}): Promise<Listing[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.check_in) params.append('check_in', filters.check_in);
    if (filters.check_out) params.append('check_out', filters.check_out);
    if (filters.guests) params.append('guests', filters.guests.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    if (filters.property_type && filters.property_type !== 'any') params.append('property_type', filters.property_type);

    const res = await axios.get(`${API_BASE}/listings?${params.toString()}`);
    return res.data;
  },

  getListingById: async (id: number): Promise<Listing> => {
    const res = await axios.get(`${API_BASE}/listings/${id}`);
    return res.data;
  },

  createListing: async (listingData: any, hostId: number = 1): Promise<Listing> => {
    const res = await axios.post(`${API_BASE}/listings?host_id=${hostId}`, listingData);
    return res.data;
  },

  updateListing: async (id: number, listingData: any, hostId: number = 1): Promise<Listing> => {
    const res = await axios.put(`${API_BASE}/listings/${id}?host_id=${hostId}`, listingData);
    return res.data;
  },

  deleteListing: async (id: number, hostId: number = 1): Promise<void> => {
    await axios.delete(`${API_BASE}/listings/${id}?host_id=${hostId}`);
  },

  getBookedDates: async (id: number): Promise<string[]> => {
    const res = await axios.get(`${API_BASE}/listings/${id}/booked-dates`);
    return res.data.booked_dates || [];
  },

  checkDateAvailability: async (id: number, checkIn: string, checkOut: string): Promise<{ available: boolean; message: string }> => {
    const res = await axios.post(`${API_BASE}/listings/${id}/check-dates`, {
      listing_id: id,
      check_in: checkIn,
      check_out: checkOut,
    });
    return res.data;
  },

  // Bookings
  createBooking: async (bookingData: any, userId: number = 4): Promise<Booking> => {
    const res = await axios.post(`${API_BASE}/bookings?user_id=${userId}`, bookingData);
    return res.data;
  },

  getMyTrips: async (userId: number = 4): Promise<Booking[]> => {
    const res = await axios.get(`${API_BASE}/bookings/my-trips?user_id=${userId}`);
    return res.data;
  },

  cancelBooking: async (bookingId: number, userId: number = 4): Promise<void> => {
    await axios.post(`${API_BASE}/bookings/${bookingId}/cancel?user_id=${userId}`);
  },

  // Reviews
  createReview: async (listingId: number, reviewData: any, userId: number = 4): Promise<Review> => {
    const res = await axios.post(`${API_BASE}/listings/${listingId}/reviews?user_id=${userId}`, reviewData);
    return res.data;
  },

  getListingReviews: async (listingId: number): Promise<Review[]> => {
    const res = await axios.get(`${API_BASE}/listings/${listingId}/reviews`);
    return res.data;
  },

  // Wishlists
  getWishlists: async (userId: number = 4): Promise<Wishlist[]> => {
    const res = await axios.get(`${API_BASE}/wishlists?user_id=${userId}`);
    return res.data;
  },

  toggleWishlist: async (listingId: number, userId: number = 4): Promise<boolean> => {
    const res = await axios.post(`${API_BASE}/wishlists/toggle/${listingId}?user_id=${userId}`);
    return res.data.is_favorite;
  },

  // Host Dashboard
  getHostStats: async (hostId: number = 1): Promise<HostStats> => {
    const res = await axios.get(`${API_BASE}/host/stats?host_id=${hostId}`);
    return res.data;
  },

  getHostListings: async (hostId: number = 1): Promise<Listing[]> => {
    const res = await axios.get(`${API_BASE}/host/listings?host_id=${hostId}`);
    return res.data;
  },

  getHostReservations: async (hostId: number = 1): Promise<Booking[]> => {
    const res = await axios.get(`${API_BASE}/host/reservations?host_id=${hostId}`);
    return res.data;
  },

  // Amenities
  getAmenities: async (): Promise<Amenity[]> => {
    const res = await axios.get(`${API_BASE}/amenities`);
    return res.data;
  }
};
