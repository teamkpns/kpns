'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  GiftOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  LogoutOutlined,
  SwapOutlined,
  LoadingOutlined,
  UserOutlined,
  LockOutlined,
  MessageOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { Button, Avatar, Spin, message } from 'antd';
import { KPNS_COLORS } from '@/lib/constants';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, isLoading, applications, contactMessages, logout, switchDemoUser } = usePortal();

  const isAdmin = currentRole === 'ADMIN' || currentRole === 'SUPERADMIN';
  const pendingAppsCount = applications.filter((a) => a.status === 'PENDING').length;
  const unreadMessagesCount = contactMessages.filter((m) => !m.read).length;

  // Strict route protection for /admin/*
  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        // Not logged in -> send to login
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (!isAdmin) {
        // Logged in as normal MEMBER -> restrict from admin pages and redirect to member dashboard
        message.warning('Access restricted: Only Admin can access administrative pages.');
        router.replace('/member/dashboard');
      }
    }
  }, [currentUser, currentRole, isLoading, isAdmin, router, pathname]);

  const adminNav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardOutlined /> },
    {
      label: 'Applications',
      href: '/admin/applications',
      icon: <FileTextOutlined />,
      badge: pendingAppsCount,
    },
    { label: 'Members', href: '/admin/members', icon: <TeamOutlined /> },
    {
      label: 'Messages',
      href: '/admin/messages',
      icon: <MessageOutlined />,
      badge: unreadMessagesCount,
    },
    { label: 'Activity Posts', href: '/admin/posts', icon: <FileImageOutlined /> },
    { label: 'Birthdays', href: '/admin/birthdays', icon: <GiftOutlined /> },
    { label: 'Reports', href: '/admin/reports', icon: <BarChartOutlined /> },
    { label: 'Activity Logs', href: '/admin/activity-logs', icon: <HistoryOutlined /> },
    { label: 'Club Settings', href: '/admin/settings', icon: <SettingOutlined /> },
  ];

  // If loading or unauthorized, show spinner
  if (isLoading || !currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#3447AA' }} spin />} />
        <p className="mt-4 text-xs font-semibold text-gray-500">
          {!currentUser ? 'Checking admin session...' : 'Verifying admin authorization...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-8">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop Admin Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs sticky top-24 space-y-4">
              {/* Admin Profile Badge */}
              <div className="bg-gradient-to-r from-[#3447AA] to-[#202E7A] p-3.5 rounded-xl text-white">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    style={{ backgroundColor: '#FFFFFF', color: '#3447AA' }}
                    icon={<UserOutlined />}
                    size="default"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-pink-200 font-mono">
                      {currentUser.memberId}
                    </p>
                    <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-white/20 text-white rounded">
                      ADMIN PRIVILEGES
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-indigo-900/60 uppercase flex items-center justify-between">
                  <span>Admin Administration</span>
                  <span className="bg-blue-100 text-[#3447AA] text-[10px] px-2 py-0.5 rounded font-extrabold">
                    PORTAL
                  </span>
                </div>

                {adminNav.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition ${
                        isActive
                          ? 'bg-[#3447AA] text-white shadow-sm shadow-[#3447AA]/20'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-amber-400 text-gray-900' : 'bg-amber-500 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>

              {/* Action Buttons: Member Portal & Logout */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <Link href="/member/dashboard">
                  <Button
                    block
                    className="rounded-xl border-gray-200 text-gray-700 hover:text-[#3447AA] font-bold text-xs h-9 mb-2"
                  >
                    View Member Dashboard
                  </Button>
                </Link>

                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="rounded-xl font-bold text-xs h-9"
                >
                  Logout
                </Button>
              </div>
            </div>
          </aside>

          {/* Admin Main Content Area */}
          <section className="col-span-1 lg:col-span-9">{children}</section>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};
