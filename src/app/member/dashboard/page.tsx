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
  CrownFilled,
  TeamOutlined,
} from '@ant-design/icons';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { ProfileCompletionCard } from '@/components/common/ProfileCompletionCard';
import { StatusTag } from '@/components/common/StatusTag';
import { usePortal } from '@/context/portal-context';
import { formatDate } from '@/lib/utils';
import { KPNS_COLORS } from '@/lib/constants';

export default function MemberDashboardPage() {
  const { currentUser, members, clubSettings } = usePortal();

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fallbackUser = {
    name: 'Pintu Patra',
    memberId: 'KPNS75PP26',
    fromNo: '75',
    userId: 'PINTU75',
    status: 'ACTIVE' as const,
    admissionDate: '2026-08-15',
    bloodGroup: 'O+',
    profileCompletion: 85,
    missingFields: ['City missing', 'Police Station missing'],
    avatarUrl: undefined as string | undefined,
    committeeRole: undefined as string | undefined,
    committeeVision: undefined as string | undefined,
  };

  // Find live record from members list to ensure latest committeeRole is synced
  const liveMember = members?.find(
    (m) =>
      (currentUser?.memberId && m.memberId?.toLowerCase() === currentUser.memberId.toLowerCase()) ||
      (currentUser?.id && m.id === currentUser.id) ||
      (currentUser?.userId && m.userId?.toLowerCase() === currentUser.userId.toLowerCase())
  );

  const user = {
    ...fallbackUser,
    ...(currentUser || {}),
    ...(liveMember || {}),
  };

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Powder Pink Welcome Card (Specification Section 9) */}
        <div className="bg-[#FBEAEB] rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#3447AA] text-xs font-bold shadow-xs">
                  <span>👋 {getGreeting()}, {user.name?.split(' ')[0]}</span>
                </div>
                {user.committeeRole && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black shadow-xs">
                    <CrownFilled className="text-amber-100" />
                    <span>{user.committeeRole}</span>
                  </div>
                )}
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
                src={user.avatarUrl}
                style={{ backgroundColor: KPNS_COLORS.primary }}
                icon={<UserOutlined />}
                className="shadow-md border-2 border-white"
              />
            </div>
          </div>
        </div>

        {/* Current Committee Role Spotlight Banner */}
        {user.committeeRole && (
          <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 rounded-3xl p-5 sm:p-6 border border-amber-300/80 shadow-xs relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                  <CrownFilled />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Current Committee Role
                    </span>
                    <span className="text-xs text-amber-800 font-semibold hidden sm:inline">
                      Managing Committee Body
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 mt-1 flex items-center gap-2">
                    {user.committeeRole}
                  </h2>
                  {user.committeeVision ? (
                    <p className="text-xs text-amber-950/85 italic mt-1 font-medium leading-relaxed max-w-2xl">
                      &ldquo;{user.committeeVision}&rdquo;
                    </p>
                  ) : (
                    <p className="text-xs text-amber-800/80 mt-1">
                      Official Executive Portfolio &bull; Khejurda Pallyunnayan Narayan Sangha
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#3447AA] border border-amber-200 text-xs font-bold shadow-2xs transition"
                >
                  <TeamOutlined />
                  <span>View Team KPNS</span>
                </Link>
              </div>
            </div>
          </div>
        )}

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
              <div className="flex flex-col items-end gap-1.5">
                <StatusTag status={user.status} />
                {user.committeeRole && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-extrabold border border-amber-300 shadow-2xs">
                    <CrownFilled className="text-amber-500 text-[10px]" />
                    {user.committeeRole}
                  </span>
                )}
              </div>
            </div>

            <div className={`grid ${user.committeeRole ? 'grid-cols-3' : 'grid-cols-2'} gap-3 pt-3 border-t border-gray-100`}>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-gray-400">FORM NO.</p>
                <p className="text-base font-extrabold text-gray-800 mt-0.5">{user.fromNo || '—'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-gray-400">ADMISSION DATE</p>
                <p className="text-sm font-extrabold text-gray-800 mt-0.5 leading-snug">
                  {formatDate(user.admissionDate)}
                </p>
              </div>
              {user.committeeRole && (
                <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/70">
                  <p className="text-[10px] font-bold uppercase text-amber-800">COMMITTEE ROLE</p>
                  <p className="text-sm font-extrabold text-amber-900 mt-0.5 truncate leading-snug" title={user.committeeRole}>
                    {user.committeeRole}
                  </p>
                </div>
              )}
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
