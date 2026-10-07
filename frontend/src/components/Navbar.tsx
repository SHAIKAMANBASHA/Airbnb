'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Globe, Menu, User as UserIcon, Heart, Compass, PlusCircle, LayoutDashboard, Briefcase } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface NavbarProps {
  onOpenSearch?: () => void;
  filters?: SearchFilters;
  mode?: 'guest' | 'host';
  setMode?: (mode: 'guest' | 'host') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  filters = {},
  mode = 'guest',
  setMode
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatLocationLabel = () => {
    if (filters.city) return filters.city;
    return 'Anywhere';
  };

  const formatDatesLabel = () => {
    if (filters.check_in && filters.check_out) {
      return `${filters.check_in.slice(5)} - ${filters.check_out.slice(5)}`;
    }
    return 'Any week';
  };

  const formatGuestsLabel = () => {
    if (filters.guests && filters.guests > 0) {
      return `${filters.guests} guest${filters.guests > 1 ? 's' : ''}`;
    }
    return 'Add guests';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <svg
              className="w-9 h-9 text-[#FF385C] transition-transform duration-200 group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.308-3.321 7.806-7.5 7.806-3.155 0-5.748-1.921-6.804-4.708l-.196-.549-.196.549c-1.056 2.787-3.649 4.708-6.804 4.708-4.179 0-7.5-3.498-7.5-7.806 0-1.168.257-2.224.971-3.711l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.316.657-3.398 2.584l-.533 1.025c-1.947 3.818-6.101 12.513-7.078 14.793l-.117.288c-.627 1.496-.807 2.277-.847 3.012l-.007.242c0 3.208 2.453 5.806 5.5 5.806 2.49 0 4.606-1.583 5.279-3.92l.148-.564h1.706l.148.564c.673 2.337 2.789 3.92 5.279 3.92 3.047 0 5.5-2.598 5.5-5.806 0-.773-.178-1.564-.854-3.254l-.117-.288c-.977-2.28-5.131-10.975-7.078-14.793l-.533-1.025C18.316 3.657 17.239 3 16 3zm0 13c1.933 0 3.5 1.567 3.5 3.5S17.933 23 16 23s-3.5-1.567-3.5-3.5S14.067 16 16 16zm0 2c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-[#FF385C] hidden sm:inline-block font-sans">
              airbnb
            </span>
          </Link>

          {/* Search Pill Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center border border-neutral-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition duration-200 cursor-pointer text-sm font-medium divide-x divide-neutral-200 bg-white"
          >
            <span className="pr-3 text-neutral-900 truncate max-w-[120px] sm:max-w-none">
              {formatLocationLabel()}
            </span>
            <span className="px-3 text-neutral-900 hidden md:inline-block">
              {formatDatesLabel()}
            </span>
            <div className="pl-3 flex items-center gap-3">
              <span className="text-neutral-500 hidden sm:inline-block font-normal">
                {formatGuestsLabel()}
              </span>
              <div className="bg-[#FF385C] text-white p-2 rounded-full flex items-center justify-center shrink-0">
                <Search className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </button>

          {/* Right Menu Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {setMode && (
              <button
                onClick={() => setMode(mode === 'guest' ? 'host' : 'guest')}
                className="text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-100 py-2.5 px-4 rounded-full transition cursor-pointer hidden sm:block"
              >
                {mode === 'guest' ? 'Switch to hosting' : 'Switch to guest mode'}
              </button>
            )}

            <button className="p-2.5 text-neutral-700 hover:bg-neutral-100 rounded-full transition hidden lg:block">
              <Globe className="w-4 h-4" />
            </button>

            {/* Profile Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 border border-neutral-300 rounded-full p-1.5 pl-3 hover:shadow-md transition bg-white"
              >
                <Menu className="w-4 h-4 text-neutral-600" />
                <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                  <UserIcon className="w-4 h-4 text-neutral-300" />
                </div>
              </button>

              {/* Dropdown Menu Popup */}
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setMenuOpen(false)}
                >
                  {mode === 'guest' ? (
                    <>
                      <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition text-neutral-800 font-medium"
                      >
                        <Compass className="w-4 h-4 text-neutral-500" />
                        Explore listings
                      </Link>
                      <Link
                        href="/trips"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition text-neutral-800 font-medium"
                      >
                        <Briefcase className="w-4 h-4 text-neutral-500" />
                        My Trips
                      </Link>
                      <Link
                        href="/wishlists"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition text-neutral-800 font-medium"
                      >
                        <Heart className="w-4 h-4 text-neutral-500" />
                        Wishlists & Favorites
                      </Link>
                      <hr className="my-2 border-neutral-100" />
                      {setMode && (
                        <button
                          onClick={() => setMode('host')}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition text-[#FF385C] font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Host your home
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/host"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition text-neutral-800 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                        Host Dashboard
                      </Link>
                      <Link
                        href="/host/create"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition text-neutral-800 font-medium"
                      >
                        <PlusCircle className="w-4 h-4 text-neutral-500" />
                        Create New Listing
                      </Link>
                      <hr className="my-2 border-neutral-100" />
                      {setMode && (
                        <button
                          onClick={() => setMode('guest')}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition text-neutral-700 font-medium"
                        >
                          <Compass className="w-4 h-4" />
                          Switch to Guest Mode
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
