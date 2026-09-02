'use client';

import React from 'react';
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
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { Button } from 'antd';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { applications, logout, switchDemoUser } = usePortal();

  const pendingAppsCount = applications.filter((a) => a.status === 'PENDING').length;

  const adminNav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardOutlined /> },
    {
      label: 'Applications',
      href: '/admin/applications',
      icon: <FileTextOutlined />,
      badge: pendingAppsCount,
    },
    { label: 'Members', href: '/admin/members', icon: <TeamOutlined /> },
    { label: 'Birthdays', href: '/admin/birthdays', icon: <GiftOutlined /> },
    { label: 'Reports', href: '/admin/reports', icon: <BarChartOutlined /> },
    { label: 'Activity Logs', href: '/admin/activity-logs', icon: <HistoryOutlined /> },
    { label: 'Club Settings', href: '/admin/settings', icon: <SettingOutlined /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-8">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop Admin Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs sticky top-24 space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-indigo-900/60 uppercase flex items-center justify-between">
                <span>Admin Administration</span>
                <span className="bg-blue-100 text-[#3447AA] text-[10px] px-2 py-0.5 rounded font-extrabold">
                  PORTAL
                </span>
              </div>

              {adminNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Button
                  block
                  icon={<SwapOutlined />}
                  onClick={() => switchDemoUser('MEMBER')}
                  className="rounded-xl border-[#3447AA] text-[#3447AA] font-semibold text-xs h-9"
                >
                  Switch to Member View
                </Button>

                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="rounded-xl font-semibold text-xs h-9"
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
