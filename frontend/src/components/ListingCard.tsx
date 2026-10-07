'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { Listing } from '@/lib/types';

interface ListingCardProps {
  listing: Listing;
  isFavorite?: boolean;
  onToggleWishlist?: (listingId: number) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFavorite = false,
  onToggleWishlist
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [favorite, setFavorite] = useState(isFavorite);

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : [{ id: 0, listing_id: listing.id, url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', is_cover: true, order: 0 }];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    if (onToggleWishlist) {
      onToggleWishlist(listing.id);
    }
  };

  return (
    <div className="group flex flex-col cursor-pointer">
      
      {/* Image Carousel Container */}
      <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-2xl bg-neutral-200 shadow-xs">
        
        {/* Cover Photo */}
        <Link href={`/listings/${listing.id}`}>
          <img
            src={photos[currentPhotoIndex]?.url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-out"
          />
        </Link>

        {/* Superhost / Guest Favorite Badge */}
        {listing.host?.superhost_status && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold text-neutral-900 pointer-events-none">
            <Award className="w-3.5 h-3.5 text-[#FF385C]" />
            <span>Guest favorite</span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 active:scale-95 transition group/heart"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-6 h-6 stroke-[2] transition ${
              favorite
                ? 'fill-[#FF385C] text-[#FF385C] drop-shadow-md'
                : 'text-white fill-black/30 group-hover/heart:scale-110'
            }`}
          />
        </button>

        {/* Carousel Prev/Next Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Carousel Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {photos.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-200 ${
                    idx === currentPhotoIndex
                      ? 'w-2 h-2 bg-white scale-110 shadow-xs'
                      : 'w-1.5 h-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

      </div>

      {/* Listing Meta Info */}
      <Link href={`/listings/${listing.id}`} className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-neutral-900 text-base truncate">
            {listing.city}, {listing.state || listing.country}
          </h3>
          <div className="flex items-center gap-1 shrink-0 text-sm font-medium text-neutral-900">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{listing.rating.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 truncate font-normal">
          {listing.property_type} · {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
        </p>

        <p className="text-xs text-neutral-500 font-normal">
          {listing.category} category
        </p>

        <div className="mt-1 flex items-baseline gap-1 text-sm text-neutral-900 font-medium">
          <span className="font-bold text-base text-neutral-950">${listing.price_per_night}</span>
          <span className="text-neutral-500 font-normal text-xs">night</span>
        </div>
      </Link>

    </div>
  );
};
