'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface KPNSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'white';
  href?: string;
  className?: string;
}

export const KPNSLogo: React.FC<KPNSLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  variant = 'dark',
  href = '/',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const isWhite = variant === 'white';

  const logoDimensions = {
    sm: { box: 'w-8 h-8', img: 'w-8 h-8', text: 'text-sm font-bold', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', img: 'w-10 h-10', text: 'text-base font-bold', sub: 'text-xs' },
    lg: { box: 'w-14 h-14', img: 'w-14 h-14', text: 'text-xl font-bold', sub: 'text-sm' },
    xl: { box: 'w-20 h-20', img: 'w-20 h-20', text: 'text-2xl font-bold', sub: 'text-base' },
  }[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official KPNS Club Logo Image */}
      <div
        className={`${logoDimensions.box} rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-md shadow-[#3447AA]/15 border border-white/40 flex-shrink-0 relative`}
      >
        {!imgError ? (
          <img
            src="/img/logo.png"
            alt="KPNS Logo"
            className={`${logoDimensions.img} object-contain`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#3447AA] to-[#1E2E7B] flex items-center justify-center text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
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
