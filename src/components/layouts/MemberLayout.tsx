'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  KeyOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';

export const MemberLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { notifications } = usePortal();
  const unread = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: 'Dashboard', href: '/member/dashboard', icon: <DashboardOutlined /> },
    { label: 'My Profile', href: '/member/profile', icon: <UserOutlined /> },
    { label: 'Change Password', href: '/member/password', icon: <KeyOutlined /> },
    { label: 'Notifications', href: '/member/notifications', icon: <BellOutlined />, badge: unread },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-8">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop Left Sidebar (hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs sticky top-24 space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
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
          </aside>

          {/* Main Content Area */}
          <section className="col-span-1 lg:col-span-9">{children}</section>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};
