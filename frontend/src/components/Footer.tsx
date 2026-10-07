'use client';

import React from 'react';
import { Globe, DollarSign, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 mt-20 text-xs text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-300/60">
          
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">AirCover protection</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination policy</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Hosting</h4>
            <ul className="space-y-2">
              <li><a href="/host" className="hover:underline">Airbnb your home</a></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Hosting resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Airbnb</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">New features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
              <li><a href="#" className="hover:underline">Gift cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Tech Stack & Architecture</h4>
            <p className="text-neutral-500 leading-relaxed">
              Fullstack Airbnb marketplace clone built with Next.js 14, TypeScript, Tailwind CSS, Python FastAPI, SQLAlchemy, and SQLite database.
            </p>
          </div>

        </div>

        {/* Lower Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-neutral-600">
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>

          <div className="flex items-center gap-6 font-semibold text-neutral-900">
            <div className="flex items-center gap-2 cursor-pointer hover:underline">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:underline">
              <span>$ USD</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
