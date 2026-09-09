'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Row, Col, Avatar } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  BellOutlined,
  CalendarOutlined,
  IdcardOutlined,
  CheckCircleFilled,
  RightOutlined,
  SafetyCertificateFilled,
  WalletOutlined,
} from '@ant-design/icons';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { ProfileCompletionCard } from '@/components/common/ProfileCompletionCard';
import { StatusTag } from '@/components/common/StatusTag';
import { usePortal } from '@/context/portal-context';
import { formatDate } from '@/lib/utils';
import { KPNS_COLORS } from '@/lib/constants';

export default function MemberDashboardPage() {
  const { currentUser, clubSettings } = usePortal();

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const user = currentUser || {
    name: 'Pintu Patra',
    memberId: 'KPNS75PP26',
    fromNo: '75',
    userId: 'PINTU75',
    status: 'ACTIVE',
    admissionDate: '2026-08-15',
    bloodGroup: 'O+',
    profileCompletion: 85,
    missingFields: ['City missing', 'Police Station missing'],
  };

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Powder Pink Welcome Card (Specification Section 9) */}
        <div className="bg-[#FBEAEB] rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#3447AA] text-xs font-bold shadow-xs">
                <span>👋 {getGreeting()}, {user.name?.split(' ')[0]}</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                Welcome to
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#3447AA]">
                {clubSettings.clubNameBengali}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Avatar
                size={64}
                style={{ backgroundColor: KPNS_COLORS.primary }}
                icon={<UserOutlined />}
                className="shadow-md border-2 border-white"
              />
            </div>
          </div>
        </div>

        {/* Membership Summary Card (Specification Section 9) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                  MEMBER ID
                </p>
                <p className="text-2xl font-black text-[#3447AA] tracking-tight mt-0.5">
                  {user.memberId}
                </p>
              </div>
              <StatusTag status={user.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div className="bg-gray-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-gray-400">FORM NO.</p>
                <p className="text-base font-extrabold text-gray-800 mt-0.5">{user.fromNo || '—'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-gray-400">ADMISSION DATE</p>
                <p className="text-base font-extrabold text-gray-800 mt-0.5">
                  {formatDate(user.admissionDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Completion Widget (Specification Section 10) */}
          <ProfileCompletionCard
            score={user.profileCompletion || 85}
            missingFields={user.missingFields || []}
          />
        </div>

        {/* Member Quick Actions Grid (Specification Section 11) */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/member/profile"
              className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-indigo-100 transition group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3447AA] flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition">
                <UserOutlined />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-900">My Profile</span>
              <span className="text-[10px] text-gray-400 mt-0.5">View member details</span>
            </Link>

            <Link
              href="/member/profile?tab=personal"
              className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-pink-100 transition group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FBEAEB] text-[#3447AA] flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition">
                <EditOutlined />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-900">Edit Profile</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Update info</span>
            </Link>

            <Link
              href="/member/transactions"
              className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-100 transition group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition">
                <WalletOutlined />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-900">Transactions</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Dues &amp; Receipts</span>
            </Link>

            <Link
              href="/member/password"
              className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-amber-100 transition group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition">
                <LockOutlined />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-900">Password</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Change security</span>
            </Link>
          </div>
        </div>

        {/* Security & Support Note */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <SafetyCertificateFilled className="text-[#3447AA] text-lg" />
            <span>
              Your membership profile is verified and protected under KPNS Data Security Guidelines.
            </span>
          </div>
          <Link href="/member/notifications" className="text-[#3447AA] font-bold hover:underline">
            View Alerts
          </Link>
        </div>
      </div>
    </MemberLayout>
  );
}
