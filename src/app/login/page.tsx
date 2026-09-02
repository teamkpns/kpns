'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, message, Radio } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { KPNSLogo } from '@/components/common/KPNSLogo';
import { usePortal } from '@/context/portal-context';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoUser } = usePortal();
  const [loading, setLoading] = useState(false);
  const [roleType, setRoleType] = useState<UserRole>('MEMBER');

  const onFinish = (values: { identifier: string; password?: string; remember?: boolean }) => {
    setLoading(true);
    setTimeout(() => {
      const success = login(values.identifier, roleType);
      setLoading(false);
      if (success) {
        message.success(`Welcome back! Logged in as ${roleType}`);
        if (roleType === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/member/dashboard');
        }
      } else {
        message.error('Invalid credentials. Please try demo accounts below.');
      }
    }, 600);
  };

  const handleQuickDemoLogin = (targetRole: 'MEMBER' | 'ADMIN') => {
    setLoading(true);
    setTimeout(() => {
      switchDemoUser(targetRole);
      setLoading(false);
      if (targetRole === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/member/dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Desktop Split Screen Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FBEAEB]/15 blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <KPNSLogo size="lg" variant="white" />
          </div>

          {/* Middle Message */}
          <div className="relative z-10 space-y-4 my-auto max-w-md">
            <span className="px-3 py-1 rounded-full bg-white/10 text-pink-100 text-xs font-semibold backdrop-blur-xs border border-white/20">
              Welcome to the Portal
            </span>
            <h2 className="text-3xl font-black text-white leading-tight">
              খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed font-light">
              Digital member management for membership records, profile updates, birthday
              reminders, and community communications.
            </p>

            <div className="pt-4 space-y-2 text-xs text-pink-100">
              <div className="flex items-center gap-2">
                <CheckCircleFilled className="text-pink-300" />
                <span>Instant profile verification & ID generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleFilled className="text-pink-300" />
                <span>Masked Aadhaar and high-grade privacy protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleFilled className="text-pink-300" />
                <span>Mobile-first touch-friendly design</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 text-xs text-blue-200/70 flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} KPNS Organization</span>
            <Link href="/" className="hover:text-white transition flex items-center gap-1">
              <ArrowLeftOutlined /> Back to Website
            </Link>
          </div>
        </div>

        {/* Right Side: Login Card (Mobile & Desktop) */}
        <div className="col-span-1 lg:col-span-6 flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            {/* Mobile Header (Visible only on mobile) */}
            <div className="lg:hidden text-center space-y-2">
              <div className="flex justify-center mb-3">
                <KPNSLogo size="md" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ
              </h2>
              <p className="text-xs text-gray-500">Welcome Back • Member Sign In</p>
            </div>

            {/* Desktop Form Title */}
            <div className="hidden lg:block">
              <h2 className="text-2xl font-black text-gray-900">Sign In to Your Account</h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your User ID, Email, or WhatsApp number to access.
              </p>
            </div>

            {/* Portal Role Selector */}
            <div className="bg-gray-50 p-1.5 rounded-xl flex items-center justify-between border border-gray-200/80">
              <button
                type="button"
                onClick={() => setRoleType('MEMBER')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  roleType === 'MEMBER'
                    ? 'bg-[#3447AA] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Member Login
              </button>
              <button
                type="button"
                onClick={() => setRoleType('ADMIN')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  roleType === 'ADMIN'
                    ? 'bg-[#3447AA] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin Login
              </button>
            </div>

            {/* Login Form */}
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                identifier: roleType === 'ADMIN' ? 'admin@kpns.org.in' : 'PINTU75',
                remember: true,
              }}
              className="space-y-4"
            >
              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">User ID / Email</span>}
                name="identifier"
                rules={[{ required: true, message: 'Please enter your User ID or Email' }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400 mr-1" />}
                  placeholder="e.g. PINTU75 or pintu@example.com"
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">Password</span>}
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
                initialValue="kpns@2026"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-1" />}
                  placeholder="Enter your password"
                  size="large"
                  className="rounded-xl"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <div className="flex items-center justify-between text-xs">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-600 text-xs">Remember me</Checkbox>
                </Form.Item>
                <Link
                  href="/forgot-password"
                  className="text-[#3447AA] font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 rounded-xl shadow-md"
              >
                {roleType === 'ADMIN' ? 'LOGIN AS ADMIN' : 'LOGIN'}
              </Button>
            </Form>

            {/* Quick Demo Login Preset Buttons */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('MEMBER')}
                  className="py-2 px-3 rounded-xl bg-[#FBEAEB] hover:bg-pink-100 text-[#3447AA] text-xs font-bold transition border border-pink-200 text-center"
                >
                  👤 Login as Pintu (Member)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('ADMIN')}
                  className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#3447AA] text-xs font-bold transition border border-blue-200 text-center"
                >
                  🛡️ Login as Admin
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-600">
                New Member?{' '}
                <Link href="/register" className="text-[#3447AA] font-bold hover:underline">
                  Register Now
                </Link>
              </p>
            </div>

            {/* Mobile Back to Home */}
            <div className="lg:hidden text-center pt-2">
              <Link href="/" className="text-xs text-gray-400 hover:text-gray-700 flex items-center justify-center gap-1">
                <ArrowLeftOutlined /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
