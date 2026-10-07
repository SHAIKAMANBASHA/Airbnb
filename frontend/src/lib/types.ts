export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  is_host: boolean;
  superhost_status: boolean;
  joined_date?: string;
  response_rate?: number;
  bio?: string;
}

export interface ListingPhoto {
  id: number;
  listing_id: number;
  url: string;
  caption?: string;
  is_cover: boolean;
  order: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
  category: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  property_type: string;
  room_type: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  rating: number;
  review_count: number;
  host_id: number;
  created_at: string;
  host: User;
  photos: ListingPhoto[];
  amenities: Amenity[];
}

export interface Review {
  id: number;
  listing_id: number;
  user_id: number;
  rating: number;
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  check_in_rating: number;
  value_rating: number;
  comment: string;
  created_at: string;
  user: User;
}

export interface Booking {
  id: number;
  listing_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  nightly_price: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  listing: Listing;
  user: User;
}

export interface Wishlist {
  id: number;
  user_id: number;
  listing_id: number;
  listing: Listing;
}

export interface HostStats {
  total_listings: number;
  total_reservations: number;
  total_earnings: number;
  average_rating: number;
}

export interface SearchFilters {
  category?: string;
  city?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  bedrooms?: number;
  min_price?: number;
  max_price?: number;
  property_type?: string;
}
