'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Row, Col, Tag, Card } from 'antd';
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
  MedicineBoxOutlined,
  BookOutlined,
  SmileOutlined,
  CrownOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { KPNS_COLORS, SOCIAL_LINKS, MANAGING_COMMITTEE } from '@/lib/constants';

export default function HomePage() {
  const { members, clubSettings, currentUser } = usePortal();

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-16 lg:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 rounded-full bg-[#FBEAEB]/15 blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-100 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping" />
            <span>A Volunteer Organization • Serving Since 1935</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {clubSettings.clubNameBengali}
          </h1>

          <p className="text-lg sm:text-2xl font-light text-pink-100 tracking-wide max-w-2xl mx-auto italic">
            &ldquo;{clubSettings.tagline}&rdquo;
          </p>

          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Khejurdaha Pally Unnayan Narayan Sangha (KPNS) — Bridging community development,
            pediatric healthcare, ICDS child nutrition, and cultural heritage across Purba Medinipur
            through our unified portal.
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
                  Registered Members
                </p>
              </div>
              <div className="border-x border-white/20">
                <p className="text-2xl sm:text-3xl font-black text-green-300">1935</p>
                <p className="text-[11px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Founded In
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                <p className="text-[11px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Volunteer Driven
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Welfare Initiatives Section (from old KPNS site) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Social Welfare & Community Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Our Core Pillars of Service
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Serving rural Purba Medinipur through healthcare, child wellness, and literature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: ICDS */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl mb-4">
                <SmileOutlined />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ICDS & Child Development</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Dedicated support for pre-school education, malnutrition eradication, and maternal
                health education across local Anganwadi centers in our rural block.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
              >
                <span>Read ICDS Mission</span>
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Health & Eye Camps */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3447AA] flex items-center justify-center text-2xl mb-4">
                <MedicineBoxOutlined />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Medical & Eye Camps</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Pediatric medical checkups with specialist doctors, free medicines for backward
                children, and ophthalmic surgery camps with Lions&apos; Club of Egra.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
              >
                <span>Healthcare Camps</span>
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Sudhi Samman */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4">
                <BookOutlined />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sudhi Samman & Literature</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Annual Sahitya Baasar honoring educators & intellectuals, alongside publishing our
                esteemed literary little magazine <em>&ldquo;Saaraswat Arghya&rdquo;</em>.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
              >
                <span>Explore Heritage</span>
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team KPNS Preview Section */}
      <section className="py-12 bg-white border-y border-gray-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                Our Leadership & Volunteers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                Meet Team KPNS
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Governed by an elected Managing Committee and supported by dedicated members.
              </p>
            </div>
            <Link href="/team">
              <Button
                type="primary"
                icon={<TeamOutlined />}
                className="bg-[#3447AA] font-bold text-xs h-10 px-5 rounded-xl"
              >
                View Full Committee & Directory
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {MANAGING_COMMITTEE.slice(0, 4).map((person) => (
              <div
                key={person.id}
                className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 text-center space-y-2 hover:bg-white hover:shadow-xs transition"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#3447AA] text-white flex items-center justify-center font-bold text-base">
                  {person.name.charAt(0)}
                </div>
                <h4 className="text-sm font-bold text-gray-900">{person.name}</h4>
                <p className="text-[11px] font-semibold text-[#3447AA]">{person.designation}</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
                  Since {person.sinceYear}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Social Links Section */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-br from-[#FBEAEB] to-pink-50 p-6 sm:p-10 rounded-3xl border border-pink-200 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                Connect With Us
              </span>
              <h3 className="text-2xl font-black text-gray-900">
                {clubSettings.clubNameBengali}
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-[#3447AA] text-base mt-0.5" />
                  <span>{clubSettings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-[#3447AA] text-base" />
                  <a href={`tel:${clubSettings.contactPhone}`} className="hover:underline">
                    {clubSettings.contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MailOutlined className="text-[#3447AA] text-base" />
                  <a href={`mailto:${clubSettings.contactEmail}`} className="hover:underline">
                    {clubSettings.contactEmail}
                  </a>
                </div>
              </div>

              {/* Social Buttons from old PHP site */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center gap-1.5"
                >
                  Facebook
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition flex items-center gap-1.5"
                >
                  YouTube
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-1.5"
                >
                  Twitter
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-pink-100 text-center space-y-3 shadow-2xs">
              <h4 className="text-base font-bold text-gray-900">Online Member Portal</h4>
              <p className="text-xs text-gray-500">
                Are you a KPNS member or looking to apply for new membership?
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/register">
                  <Button type="primary" block className="bg-[#3447AA] font-bold text-xs h-10 rounded-xl">
                    Apply for New Membership
                  </Button>
                </Link>
                <Link href="/login">
                  <Button block className="font-semibold text-xs h-10 rounded-xl">
                    Member Login
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
              KPNS &copy; 1935–{new Date().getFullYear()} • A Volunteer Organization • Khejurdaha, Purba Medinipur
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition">
              About Us
            </Link>
            <span>•</span>
            <Link href="/team" className="hover:text-white transition">
              Team KPNS
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition">
              Contact Us
            </Link>
            <span>•</span>
            <Link href="/register" className="hover:text-white transition">
              Membership
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-white transition">
              Login
            </Link>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}
