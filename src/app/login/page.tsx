'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, message } from 'antd';
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

export default function LoginPage() {
  const router = useRouter();
  const { login, clubSettings } = usePortal();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const clubNameEnglish = clubSettings?.clubNameEnglish || 'Khejurda Palliunnyayan Narayan Sangha';
  const clubNameBengali = clubSettings?.clubNameBengali || 'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('redirect');
      if (r) setRedirectUrl(r);
    }
  }, []);

  const getDestination = (role: 'ADMIN' | 'MEMBER' | 'SUPERADMIN') => {
    if (redirectUrl) {
      if (role === 'ADMIN' || role === 'SUPERADMIN') {
        return redirectUrl;
      }
      // Regular members can only be redirected to member pages, never admin pages
      if (redirectUrl.startsWith('/member') && !redirectUrl.startsWith('/admin')) {
        return redirectUrl;
      }
    }
    return role === 'ADMIN' || role === 'SUPERADMIN' ? '/admin/dashboard' : '/member/dashboard';
  };

  const onFinish = async (values: { identifier: string; password?: string; remember?: boolean }) => {
    setLoading(true);
    try {
      const success = await login(values.identifier, values.password || '');
      setLoading(false);
      if (success) {
        const storedRole =
          (typeof window !== 'undefined' ? localStorage.getItem('kpns_auth_role') : null) || 'MEMBER';
        message.success('Welcome back! Logged in successfully.');
        const dest = getDestination(storedRole as any);
        router.push(dest);
      } else {
        message.error(
          'Invalid credentials. User ID and Password must match your registered profile in database.'
        );
      }
    } catch {
      setLoading(false);
      message.error('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Desktop/Laptop Split Screen Branding (Hidden on mobile & tablet) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FBEAEB]/15 blur-3xl pointer-events-none" />

          {/* Top Logo (without duplicate subtitle) */}
          <div className="relative z-10">
            <KPNSLogo size="lg" variant="white" showSubtitle={false} />
          </div>

          {/* Middle Message: Exactly 1 English & 1 Bengali Name */}
          <div className="relative z-10 space-y-4 my-auto max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-pink-100 text-xs font-semibold backdrop-blur-xs border border-white/20">
              KPNS Digital Portal
            </span>
            <div className="space-y-1.5">
              <h1 className="text-2xl xl:text-3xl font-black text-white leading-tight">
                {clubNameEnglish}
              </h1>
              <p className="text-lg xl:text-xl font-bold text-pink-200 leading-snug">
                {clubNameBengali}
              </p>
            </div>
            <p className="text-xs xl:text-sm text-blue-100/90 leading-relaxed font-light pt-1">
              Digital member management for membership records, profile updates, birthday reminders,
              and community communications.
            </p>

            <div className="pt-3 space-y-2 text-xs text-pink-100">
              <div className="flex items-center gap-2">
                <CheckCircleFilled className="text-pink-300 shrink-0" />
                <span>Instant profile verification &amp; ID generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleFilled className="text-pink-300 shrink-0" />
                <span>Masked Aadhaar and high-grade privacy protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleFilled className="text-pink-300 shrink-0" />
                <span>Mobile, tablet, and desktop responsive design</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 text-xs text-blue-200/70 flex items-center justify-between pt-4">
            <span>&copy; {new Date().getFullYear()} KPNS Organization</span>
            <Link href="/" className="hover:text-white transition flex items-center gap-1.5 font-medium">
              <ArrowLeftOutlined /> Back to Website
            </Link>
          </div>
        </div>

        {/* Right Side: Login Card (Mobile, Tablet & Laptop/Desktop) */}
        <div className="col-span-1 lg:col-span-6 flex items-center justify-center p-4 sm:p-8 lg:p-10 xl:p-12">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            {/* Header for Mobile & Tablet: Exactly 1 English & 1 Bengali Name */}
            <div className="lg:hidden text-center space-y-2">
              <div className="flex justify-center mb-2">
                <KPNSLogo size="md" showSubtitle={false} />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
                  {clubNameEnglish}
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#3447AA]">
                  {clubNameBengali}
                </p>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Welcome Back • Sign in to your account
              </p>
            </div>

            {/* Desktop Form Title */}
            <div className="hidden lg:block space-y-1">
              <h2 className="text-2xl font-black text-gray-900">Sign In to Your Account</h2>
              <p className="text-xs text-gray-500">
                Enter your Member ID, User ID, Email, or WhatsApp number to access.
              </p>
            </div>

            {/* Unified Login Form (No Admin Tab needed) */}
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4"
              autoComplete="off"
            >
              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">Member ID / User ID / Email / Mobile</span>}
                name="identifier"
                rules={[{ required: true, message: 'Please enter your Member ID, User ID, or Email' }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400 mr-1" />}
                  placeholder="KPNS01AB20 or user@example.com"
                  size="large"
                  className="rounded-xl text-sm h-11"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">Password</span>}
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-1" />}
                  placeholder="Enter your password"
                  size="large"
                  className="rounded-xl text-sm h-11"
                  autoComplete="current-password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <div className="flex items-center justify-between text-xs pt-0.5">
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
                className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 sm:h-12 rounded-xl shadow-md transition"
              >
                Sign In
              </Button>
            </Form>

            {/* Register Link */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                New Member?{' '}
                <Link href="/register" className="text-[#3447AA] font-bold hover:underline">
                  Apply for Membership
                </Link>
              </p>
            </div>

            {/* Mobile / Tablet Back to Home Link */}
            <div className="lg:hidden text-center pt-1">
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-gray-800 inline-flex items-center gap-1.5 font-medium transition"
              >
                <ArrowLeftOutlined /> Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
