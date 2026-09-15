'use client';

import React from 'react';
import Link from 'next/link';
import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
} from '@ant-design/icons';
import { usePortal } from '@/context/portal-context';
import { SOCIAL_LINKS } from '@/lib/constants';

export const Footer: React.FC = () => {
  const { clubSettings } = usePortal();

  return (
    <footer className="bg-gray-950 text-gray-400 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Row: Club Info + 4 Social Media Logos */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-white font-extrabold text-base sm:text-lg tracking-wide">
              {clubSettings?.clubNameBengali || 'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ'}
            </p>
            <p className="font-semibold text-gray-300 text-xs tracking-wider">
              {clubSettings?.clubNameEnglish || 'KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS)'}
            </p>
            <p className="text-gray-400 text-xs">
              KPNS &copy; 1935–{new Date().getFullYear()} &bull; Reg. No: SO168946 &bull; Khejurda, Purba Medinipur
            </p>
          </div>

          {/* Four Social Media Logos */}
          <div className="flex items-center gap-3">
            {/* 1. Facebook */}
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow KPNS on Facebook"
              className="w-11 h-11 rounded-full bg-gray-850 hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center text-xl transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
              aria-label="Facebook"
            >
              <FacebookFilled />
            </a>

            {/* 2. Instagram */}
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow KPNS on Instagram"
              className="w-11 h-11 rounded-full bg-gray-850 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-gray-300 hover:text-white flex items-center justify-center text-xl transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
              aria-label="Instagram"
            >
              <InstagramFilled />
            </a>

            {/* 3. YouTube */}
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              title="Subscribe to KPNS on YouTube"
              className="w-11 h-11 rounded-full bg-gray-850 hover:bg-[#FF0000] text-gray-300 hover:text-white flex items-center justify-center text-xl transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
              aria-label="YouTube"
            >
              <YoutubeFilled />
            </a>

            {/* 4. X (Twitter) */}
            <a
              href={SOCIAL_LINKS.x || SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow KPNS on X"
              className="w-11 h-11 rounded-full bg-gray-850 hover:bg-white text-gray-300 hover:text-black flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
              aria-label="X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Row: Quick Navigation Links + Legal Note */}
        <div className="pt-6 border-t border-gray-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
          <p className="text-gray-500 text-[11px]">
            Registered under West Bengal Societies Registration Act, 1961 &bull; All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>&bull;</span>
            <Link href="/about" className="hover:text-white transition">
              About Us
            </Link>
            <span>&bull;</span>
            <Link href="/team" className="hover:text-white transition">
              Team KPNS
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
            <span>&bull;</span>
            <Link href="/register" className="hover:text-white transition">
              Apply Membership
            </Link>
            <span>&bull;</span>
            <Link href="/login" className="hover:text-white transition">
              Member Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
