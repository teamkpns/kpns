'use client';

import React from 'react';
import Link from 'next/link';

interface KPNSLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'white';
  href?: string;
}

export const KPNSLogo: React.FC<KPNSLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  variant = 'dark',
  href = '/',
}) => {
  const isWhite = variant === 'white';
  const logoDimensions = {
    sm: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-sm font-bold', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-base font-bold', sub: 'text-xs' },
    lg: { box: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-xl font-bold', sub: 'text-sm' },
  }[size];

  const content = (
    <div className="flex items-center gap-3 select-none">
      {/* Insignia emblem */}
      <div
        className={`${logoDimensions.box} rounded-xl bg-gradient-to-br from-[#3447AA] to-[#1E2E7B] flex items-center justify-center text-white shadow-md shadow-[#3447AA]/20 border border-white/20 flex-shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={logoDimensions.icon}
        >
          {/* Lotus / Community emblem */}
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-semibold tracking-tight leading-tight ${
            isWhite ? 'text-white' : 'text-gray-900'
          } ${logoDimensions.text}`}
        >
          KPNS
        </span>
        {showSubtitle && (
          <span
            className={`font-medium leading-none ${
              isWhite ? 'text-pink-100' : 'text-[#3447AA]'
            } ${logoDimensions.sub}`}
          >
            খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
