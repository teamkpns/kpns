'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge, Drawer, Dropdown, MenuProps, Button, Avatar } from 'antd';
import {
  BellOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  KeyOutlined,
  SettingOutlined,
  SwapOutlined,
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { KPNSLogo } from './KPNSLogo';
import { usePortal } from '@/context/portal-context';
import { KPNS_COLORS } from '@/lib/constants';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    currentRole,
    notifications,
    logout,
    switchDemoUser,
  } = usePortal();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isAuth = !!currentUser;
  const isAdmin = currentRole === 'ADMIN';

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div className="py-1 px-1">
          <p className="font-bold text-gray-900 text-sm">{currentUser?.name || 'User'}</p>
          <p className="text-xs text-gray-500">{currentUser?.memberId || currentUser?.userId}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-[#3447AA]/10 text-[#3447AA] rounded-md uppercase">
            {currentRole}
          </span>
        </div>
      ),
    },
    { type: 'divider' },
    ...(isAdmin
      ? [
          {
            key: 'admin-dash',
            icon: <DashboardOutlined />,
            label: <Link href="/admin/dashboard">Admin Dashboard</Link>,
          },
          {
            key: 'admin-apps',
            icon: <FileTextOutlined />,
            label: <Link href="/admin/applications">Applications</Link>,
          },
          {
            key: 'admin-members',
            icon: <TeamOutlined />,
            label: <Link href="/admin/members">Members Directory</Link>,
          },
          {
            key: 'admin-settings',
            icon: <SettingOutlined />,
            label: <Link href="/admin/settings">Club Settings</Link>,
          },
        ]
      : [
          {
            key: 'member-dash',
            icon: <DashboardOutlined />,
            label: <Link href="/member/dashboard">My Dashboard</Link>,
          },
          {
            key: 'member-profile',
            icon: <UserOutlined />,
            label: <Link href="/member/profile">My Profile</Link>,
          },
          {
            key: 'member-password',
            icon: <KeyOutlined />,
            label: <Link href="/member/password">Change Password</Link>,
          },
          {
            key: 'member-birthdays',
            icon: <GiftOutlined />,
            label: <Link href="/member/birthdays">Birthdays</Link>,
          },
        ]),
    { type: 'divider' },
    {
      key: 'switch-role',
      icon: <SwapOutlined />,
      label: (
        <span
          onClick={() => {
            if (isAdmin) switchDemoUser('MEMBER');
            else switchDemoUser('ADMIN');
          }}
        >
          Switch to {isAdmin ? 'Member View' : 'Admin View'}
        </span>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-500" />,
      danger: true,
      label: (
        <span
          onClick={() => {
            logout();
            router.push('/login');
          }}
        >
          Logout
        </span>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<MenuOutlined className="text-lg text-gray-700" />}
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100"
          />

          <KPNSLogo size="md" href="/" />
        </div>

        {/* Center / Right Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className={`transition hover:text-[#3447AA] ${
              pathname === '/' ? 'text-[#3447AA] font-semibold' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/#about"
            className="transition hover:text-[#3447AA]"
          >
            About
          </Link>
          <Link
            href="/register"
            className={`transition hover:text-[#3447AA] ${
              pathname === '/register' ? 'text-[#3447AA] font-semibold' : ''
            }`}
          >
            Membership
          </Link>

          {isAuth && !isAdmin && (
            <Link
              href="/member/dashboard"
              className={`transition hover:text-[#3447AA] ${
                pathname.startsWith('/member') ? 'text-[#3447AA] font-semibold' : ''
              }`}
            >
              Member Portal
            </Link>
          )}

          {isAuth && isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`transition hover:text-[#3447AA] ${
                pathname.startsWith('/admin') ? 'text-[#3447AA] font-semibold' : ''
              }`}
            >
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right action items */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <Link
            href={isAdmin ? '/admin/dashboard' : '/member/notifications'}
            className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition flex items-center justify-center"
          >
            <Badge count={unreadCount} size="small" offset={[2, -2]}>
              <BellOutlined className="text-xl text-gray-700" />
            </Badge>
          </Link>

          {/* User Profile or Login */}
          {isAuth ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition border border-gray-200">
                <Avatar
                  style={{ backgroundColor: KPNS_COLORS.primary }}
                  icon={<UserOutlined />}
                  size="small"
                />
                <span className="hidden sm:inline-block text-xs font-bold text-gray-800 pr-2">
                  {currentUser?.name?.split(' ')[0] || 'Account'}
                </span>
              </button>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  type="primary"
                  className="bg-[#3447AA] hover:bg-[#283887] font-semibold text-xs sm:text-sm h-9 px-4 rounded-xl"
                >
                  Member Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title={<KPNSLogo size="sm" showSubtitle={true} />}
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={290}
      >
        <div className="flex flex-col gap-2 py-2">
          {isAuth && (
            <div className="bg-[#FBEAEB] p-4 rounded-2xl mb-3 border border-pink-200">
              <div className="flex items-center gap-3">
                <Avatar
                  style={{ backgroundColor: KPNS_COLORS.primary }}
                  size="large"
                  icon={<UserOutlined />}
                />
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-[#3447AA] font-semibold">
                    {currentUser?.memberId || currentUser?.userId}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 bg-white text-[#3447AA] rounded-md shadow-xs">
                    {currentRole}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
          >
            <HomeOutlined className="text-base text-[#3447AA]" />
            <span>Home</span>
          </Link>

          <Link
            href="/register"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
          >
            <FileTextOutlined className="text-base text-[#3447AA]" />
            <span>Become a Member (Register)</span>
          </Link>

          {isAuth && !isAdmin && (
            <>
              <div className="border-t border-gray-100 my-2 pt-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-3">
                Member Menu
              </div>
              <Link
                href="/member/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <DashboardOutlined className="text-base text-[#3447AA]" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/member/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <UserOutlined className="text-base text-[#3447AA]" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/member/password"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <KeyOutlined className="text-base text-[#3447AA]" />
                <span>Change Password</span>
              </Link>
              <Link
                href="/member/birthdays"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <GiftOutlined className="text-base text-[#3447AA]" />
                <span>Birthdays</span>
              </Link>
              <Link
                href="/member/notifications"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <BellOutlined className="text-base text-[#3447AA]" />
                <span>Notifications</span>
              </Link>
            </>
          )}

          {isAuth && isAdmin && (
            <>
              <div className="border-t border-gray-100 my-2 pt-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-3">
                Admin Menu
              </div>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <DashboardOutlined className="text-base text-[#3447AA]" />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                href="/admin/applications"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <FileTextOutlined className="text-base text-[#3447AA]" />
                <span>Applications</span>
              </Link>
              <Link
                href="/admin/members"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <TeamOutlined className="text-base text-[#3447AA]" />
                <span>Members Directory</span>
              </Link>
              <Link
                href="/admin/birthdays"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <GiftOutlined className="text-base text-[#3447AA]" />
                <span>Birthdays</span>
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <FileTextOutlined className="text-base text-[#3447AA]" />
                <span>Reports</span>
              </Link>
              <Link
                href="/admin/activity-logs"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <FileTextOutlined className="text-base text-[#3447AA]" />
                <span>Activity Logs</span>
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm"
              >
                <SettingOutlined className="text-base text-[#3447AA]" />
                <span>Club Settings</span>
              </Link>
            </>
          )}

          <div className="border-t border-gray-200 mt-4 pt-3 space-y-2">
            <Button
              block
              icon={<SwapOutlined />}
              onClick={() => {
                if (isAdmin) switchDemoUser('MEMBER');
                else switchDemoUser('ADMIN');
                setMobileDrawerOpen(false);
              }}
              className="rounded-xl border-[#3447AA] text-[#3447AA] font-semibold text-xs h-9"
            >
              Switch to {isAdmin ? 'Member' : 'Admin'} Mode
            </Button>

            {isAuth ? (
              <Button
                danger
                block
                icon={<LogoutOutlined />}
                onClick={() => {
                  logout();
                  setMobileDrawerOpen(false);
                  router.push('/login');
                }}
                className="rounded-xl font-semibold text-xs h-9"
              >
                Logout
              </Button>
            ) : (
              <Link href="/login" onClick={() => setMobileDrawerOpen(false)}>
                <Button
                  type="primary"
                  block
                  className="bg-[#3447AA] rounded-xl font-semibold text-xs h-9"
                >
                  Member / Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
};
