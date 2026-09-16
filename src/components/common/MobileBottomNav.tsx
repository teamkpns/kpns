'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge, Drawer, Button } from 'antd';
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
  LogoutOutlined,
  LoginOutlined,
  MailOutlined,
  MessageOutlined,
  FileImageOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { usePortal } from '@/context/portal-context';
import { KPNSLogo } from './KPNSLogo';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, notifications, logout } = usePortal();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isAuth = !!currentUser;
  const isAdmin = currentRole === 'ADMIN' || currentRole === 'SUPERADMIN';

  // Navigation targets based on role
  const homeHref = isAuth
    ? isAdmin
      ? '/admin/dashboard'
      : '/member/dashboard'
    : '/';
  const profileHref = isAuth
    ? isAdmin
      ? '/admin/settings'
      : '/member/profile'
    : '/about';
  const alertsHref = isAuth
    ? isAdmin
      ? '/admin/applications'
      : '/member/notifications'
    : '/team';

  return (
    <>
      {/* Fixed Bottom Bar on Mobile/Tablet (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-bottom">
        {/* Item 1: Home */}
        <Link
          href={homeHref}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
            pathname === homeHref || (pathname === '/' && !isAuth)
              ? 'text-[#3447AA] font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <HomeOutlined className="text-xl" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* Item 2: Profile / Settings / About */}
        <Link
          href={profileHref}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
            (isAuth && (pathname.includes('/profile') || (isAdmin && pathname.includes('/settings')))) ||
            (!isAuth && pathname === '/about')
              ? 'text-[#3447AA] font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {isAuth ? (
            <UserOutlined className="text-xl" />
          ) : (
            <FileTextOutlined className="text-xl" />
          )}
          <span className="text-[10px] mt-0.5">
            {isAuth ? (isAdmin ? 'Settings' : 'Profile') : 'About'}
          </span>
        </Link>

        {/* Item 3: Alerts or Team */}
        <Link
          href={alertsHref}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative ${
            (isAuth && (pathname.includes('/notifications') || pathname.includes('/applications'))) ||
            (!isAuth && pathname === '/team')
              ? 'text-[#3447AA] font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {isAuth ? (
            <>
              <Badge count={unreadCount} size="small" offset={[4, -2]}>
                <BellOutlined className="text-xl" />
              </Badge>
              <span className="text-[10px] mt-0.5">Alerts</span>
            </>
          ) : (
            <>
              <TeamOutlined className="text-xl" />
              <span className="text-[10px] mt-0.5">Team</span>
            </>
          )}
        </Link>

        {/* Item 4: More / Menu */}
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
        size="auto"
        onClose={() => setMoreDrawerOpen(false)}
        open={moreDrawerOpen}
        className="rounded-t-3xl"
      >
        <div className="space-y-4 py-2">
          {/* Unauthenticated Guest User */}
          {!isAuth && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <Link
                href="/"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <HomeOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Home</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <FileTextOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">About Us</span>
              </Link>
              <Link
                href="/team"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <TeamOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Team KPNS</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <MailOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Contact Us</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
              >
                <UserOutlined className="text-2xl text-[#3447AA] mb-1" />
                <span className="text-xs font-semibold text-gray-800">Register</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex flex-col items-center p-3 rounded-2xl bg-[#FBEAEB] text-[#3447AA] transition font-bold"
              >
                <LoginOutlined className="text-2xl mb-1" />
                <span className="text-xs">Member Login</span>
              </Link>
            </div>
          )}

          {/* Authenticated Regular Member (ONLY Member Pages) */}
          {isAuth && !isAdmin && (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
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
                  <span className="text-xs font-semibold text-gray-800">My Profile</span>
                </Link>
                <Link
                  href="/member/transactions"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <WalletOutlined className="text-2xl text-[#3447AA] mb-1" />
                  <span className="text-xs font-semibold text-gray-800">Transactions</span>
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
                  href="/member/notifications"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <BellOutlined className="text-2xl text-[#3447AA] mb-1" />
                  <span className="text-xs font-semibold text-gray-800">Alerts</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <FileTextOutlined className="text-2xl text-[#3447AA] mb-1" />
                  <span className="text-xs font-semibold text-gray-800">About Us</span>
                </Link>
                <Link
                  href="/team"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <TeamOutlined className="text-2xl text-[#3447AA] mb-1" />
                  <span className="text-xs font-semibold text-gray-800">Team KPNS</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition col-span-3"
                >
                  <MailOutlined className="text-2xl text-[#3447AA] mb-1" />
                  <span className="text-xs font-semibold text-gray-800">Contact Us</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    logout();
                    setMoreDrawerOpen(false);
                    router.push('/login');
                  }}
                  className="rounded-xl font-bold text-xs h-10"
                >
                  Logout
                </Button>
              </div>
            </>
          )}

          {/* Authenticated Admin (Admin Pages + Member Pages) */}
          {isAuth && isAdmin && (
            <>
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <DashboardOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Admin</span>
                </Link>
                <Link
                  href="/admin/applications"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <FileTextOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Apps</span>
                </Link>
                <Link
                  href="/admin/members"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <TeamOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Members</span>
                </Link>
                <Link
                  href="/admin/messages"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <MessageOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Messages</span>
                </Link>
                <Link
                  href="/admin/posts"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <FileImageOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Posts</span>
                </Link>
                <Link
                  href="/admin/birthdays"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <GiftOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Birthdays</span>
                </Link>
                <Link
                  href="/admin/reports"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <FileTextOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Reports</span>
                </Link>
                <Link
                  href="/admin/activity-logs"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <FileTextOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Logs</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-gray-50 hover:bg-[#FBEAEB] transition"
                >
                  <SettingOutlined className="text-xl text-[#3447AA] mb-1" />
                  <span className="text-[11px] font-semibold text-gray-800">Settings</span>
                </Link>
                <Link
                  href="/member/dashboard"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-blue-50 text-[#3447AA] transition font-bold col-span-4"
                >
                  <DashboardOutlined className="text-xl mb-1" />
                  <span className="text-[11px]">Member View</span>
                </Link>
              </div>


              <div className="pt-2 border-t border-gray-100">
                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    logout();
                    setMoreDrawerOpen(false);
                    router.push('/login');
                  }}
                  className="rounded-xl font-bold text-xs h-10"
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};
