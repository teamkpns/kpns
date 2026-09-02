'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge, Drawer } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  BellOutlined,
  AppstoreOutlined,
  KeyOutlined,
  GiftOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { usePortal } from '@/context/portal-context';
import { KPNSLogo } from './KPNSLogo';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, notifications, switchDemoUser } = usePortal();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isAdmin = currentRole === 'ADMIN';

  // Navigation targets based on role
  const homeHref = isAdmin ? '/admin/dashboard' : '/member/dashboard';
  const profileHref = isAdmin ? '/admin/settings' : '/member/profile';
  const alertsHref = isAdmin ? '/admin/applications' : '/member/notifications';

  return (
    <>
      {/* Fixed Bottom Bar on Mobile/Tablet (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-bottom">
        <Link
          href={homeHref}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
            pathname === homeHref || pathname === '/'
              ? 'text-[#3447AA] font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <HomeOutlined className="text-xl" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        <Link
          href={profileHref}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
            pathname.includes('/profile') || (isAdmin && pathname.includes('/settings'))
              ? 'text-[#3447AA] font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <UserOutlined className="text-xl" />
          <span className="text-[10px] mt-0.5">{isAdmin ? 'Settings' : 'Profile'}</span>
        </Link>

        <Link
          href={alertsHref}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative ${
            pathname.includes('/notifications') || pathname.includes('/applications')
              ? 'text-[#3447AA] font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Badge count={unreadCount} size="small" offset={[4, -2]}>
            <BellOutlined className="text-xl" />
          </Badge>
          <span className="text-[10px] mt-0.5">Alerts</span>
        </Link>

        <button
          onClick={() => setMoreDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
            moreDrawerOpen ? 'text-[#3447AA] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <AppstoreOutlined className="text-xl" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </div>

      {/* More Options Drawer for Mobile */}
      <Drawer
        title={<KPNSLogo size="sm" />}
        placement="bottom"
        height="auto"
        onClose={() => setMoreDrawerOpen(false)}
        open={moreDrawerOpen}
        className="rounded-t-3xl"
      >
        <div className="grid grid-cols-4 gap-3 py-2 text-center">
          {isAdmin ? (
            <>
              <Link
                href="/admin/dashboard"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <DashboardOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Dashboard</span>
              </Link>
              <Link
                href="/admin/applications"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <FileTextOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Applications</span>
              </Link>
              <Link
                href="/admin/members"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <TeamOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Members</span>
              </Link>
              <Link
                href="/admin/birthdays"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <GiftOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Birthdays</span>
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <FileTextOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Reports</span>
              </Link>
              <Link
                href="/admin/activity-logs"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <FileTextOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Logs</span>
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <SettingOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Settings</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/member/dashboard"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <DashboardOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Dashboard</span>
              </Link>
              <Link
                href="/member/profile"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <UserOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Profile</span>
              </Link>
              <Link
                href="/member/password"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <KeyOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Password</span>
              </Link>
              <Link
                href="/member/birthdays"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <GiftOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Birthdays</span>
              </Link>
            </>
          )}

          <div
            onClick={() => {
              if (isAdmin) switchDemoUser('MEMBER');
              else switchDemoUser('ADMIN');
              setMoreDrawerOpen(false);
            }}
            className="flex flex-col items-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
          >
            <SwapOutlined className="text-2xl text-[#3447AA] mb-1" />
            <span className="text-xs font-semibold text-[#3447AA]">
              {isAdmin ? 'Member Mode' : 'Admin Mode'}
            </span>
          </div>
        </div>
      </Drawer>
    </>
  );
};
