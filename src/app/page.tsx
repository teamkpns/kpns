'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card, Row, Col, Statistic } from 'antd';
import {
  UserAddOutlined,
  LoginOutlined,
  IdcardOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { KPNS_COLORS } from '@/lib/constants';

export default function HomePage() {
  const { members, clubSettings, currentUser } = usePortal();

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-16 lg:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative background powder pink accent shapes */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 rounded-full bg-[#FBEAEB]/15 blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-100 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping" />
            <span>অফিসিয়াল সদস্য ব্যবস্থাপনা পোর্টাল</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {clubSettings.clubNameBengali}
          </h1>

          <p className="text-lg sm:text-2xl font-light text-pink-100 tracking-wide max-w-2xl mx-auto italic">
            &ldquo;{clubSettings.tagline}&rdquo;
          </p>

          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Khejurdaha Pally Unnayan Narayan Sangha (KPNS) — Bridging community, heritage, social
            welfare, and member fraternity through a seamless digital experience.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                type="primary"
                size="large"
                icon={<UserAddOutlined />}
                className="w-full sm:w-auto bg-[#FBEAEB] text-[#3447AA] hover:bg-white hover:text-[#1E2C78] font-bold text-sm sm:text-base h-12 px-7 rounded-xl shadow-lg border-0 transition"
              >
                Become a Member
              </Button>
            </Link>

            <Link href={currentUser ? '/member/dashboard' : '/login'} className="w-full sm:w-auto">
              <Button
                ghost
                size="large"
                icon={<LoginOutlined />}
                className="w-full sm:w-auto border-white/60 text-white hover:border-white hover:bg-white/10 font-bold text-sm sm:text-base h-12 px-7 rounded-xl transition"
              >
                {currentUser ? 'Go to Dashboard' : 'Member Login'}
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/15">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">{totalMembers}+</p>
                <p className="text-[11px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Total Members
                </p>
              </div>
              <div className="border-x border-white/20">
                <p className="text-2xl sm:text-3xl font-black text-green-300">{activeMembers}</p>
                <p className="text-[11px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Active Verified
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                <p className="text-[11px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Digital Portal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Key Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Designed for Community Excellence
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Experience our clean, mobile-first management portal built with modern security and
            friendliness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-[#FBEAEB] text-[#3447AA] flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              <UserAddOutlined />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Member Registration</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Simple 4-step mobile application wizard. Instant application tracking ID and real-time
              approval notifications.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
            >
              <span>Apply Online</span>
              <ArrowRightOutlined />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-[#FBEAEB] text-[#3447AA] flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              <IdcardOutlined />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Membership</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Official Member ID, Form Number, profile completeness tracker, and birthday
              celebrations in a unified dashboard.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
            >
              <span>Access ID</span>
              <ArrowRightOutlined />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-[#FBEAEB] text-[#3447AA] flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              <SafetyCertificateOutlined />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Masked Profile</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Aadhaar numbers protected with standard masking (XXXX XXXX 1234) and enterprise
              Supabase Row Level Security.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
            >
              <span>Learn Security</span>
              <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white border-y border-gray-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                About Our Sangha
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {clubSettings.clubNameBengali}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dedicated to rural development, cultural elevation, youth empowerment, sports, and
                social upliftment in Khejurdaha and surrounding areas of Purba Medinipur.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircleOutlined className="text-[#3447AA]" />
                  <span>Annual Blood Donation & Health Checkup Camps</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircleOutlined className="text-[#3447AA]" />
                  <span>Educational Assistance & Book Grants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircleOutlined className="text-[#3447AA]" />
                  <span>Cultural Festivals & Sports Tournaments</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FBEAEB] to-pink-50 p-6 sm:p-8 rounded-3xl border border-pink-200/80 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Club Contact Information</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-[#3447AA] text-base mt-0.5" />
                  <span>{clubSettings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-[#3447AA] text-base" />
                  <span>{clubSettings.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MailOutlined className="text-[#3447AA] text-base" />
                  <span>{clubSettings.contactEmail}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register">
                  <Button
                    type="primary"
                    block
                    className="bg-[#3447AA] font-bold text-xs h-10 rounded-xl"
                  >
                    Apply for New Membership
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
          <div>
            <p className="text-white font-bold">{clubSettings.clubNameBengali}</p>
            <p className="text-gray-400 text-[11px] mt-0.5">
              &copy; {new Date().getFullYear()} KPNS. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white transition">
              Member Login
            </Link>
            <span>•</span>
            <Link href="/register" className="hover:text-white transition">
              Registration
            </Link>
            <span>•</span>
            <Link href="/admin/dashboard" className="hover:text-white transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}
