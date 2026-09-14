'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  KeyOutlined,
  BellOutlined,
  LogoutOutlined,
  LoadingOutlined,
  SwapOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, Avatar, Spin } from 'antd';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { KPNS_COLORS } from '@/lib/constants';

export const MemberLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, isLoading, notifications, logout, switchDemoUser } = usePortal();
  const unread = notifications.filter((n) => !n.read).length;
  const isAdmin = currentRole === 'ADMIN';

  // Protect member routes: Only authenticated users can view
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [currentUser, isLoading, router, pathname]);

  const navItems = [
    { label: 'Dashboard', href: '/member/dashboard', icon: <DashboardOutlined /> },
    { label: 'My Profile', href: '/member/profile', icon: <UserOutlined /> },
    { label: 'Transactions', href: '/member/transactions', icon: <WalletOutlined /> },
    { label: 'Change Password', href: '/member/password', icon: <KeyOutlined /> },
    { label: 'Notifications', href: '/member/notifications', icon: <BellOutlined />, badge: unread },
  ];

  // If session is initializing or user is not authenticated, show loading spinner
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#3447AA' }} spin />} />
        <p className="mt-4 text-xs font-semibold text-gray-500">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-8">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs sticky top-24 space-y-4">
              {/* Member Card */}
              <div className="bg-[#FBEAEB] p-3.5 rounded-xl border border-pink-200/80">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={currentUser?.avatarUrl}
                    style={{ backgroundColor: KPNS_COLORS.primary }}
                    icon={<UserOutlined />}
                    size="default"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 text-xs truncate leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-[#3447AA] font-mono font-semibold">
                      {currentUser.memberId}
                    </p>
                    <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-white text-[#3447AA] rounded">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                  Member Area
                </div>

                {navItems.map((item) => {
                  const isActive = pathname === item.href;
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
                            isActive ? 'bg-white text-[#3447AA]' : 'bg-[#3447AA] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Actions (Switch Role for Admin & Logout) */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                {isAdmin && (
                  <Link href="/admin/dashboard">
                    <Button
                      block
                      className="rounded-xl border-[#3447AA] text-[#3447AA] font-bold text-xs h-9 mb-2"
                    >
                      Go to Admin Portal
                    </Button>
                  </Link>
                )}

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

          {/* Main Content Area */}
          <section className="col-span-1 lg:col-span-9">{children}</section>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};
