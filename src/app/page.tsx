'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Avatar } from 'antd';
import {
  UserAddOutlined,
  LoginOutlined,
  TeamOutlined,
  SmileOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  FileImageOutlined,
  NotificationOutlined,
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { SOCIAL_LINKS, COMMITTEE_ROLE_ORDER } from '@/lib/constants';
import { Member } from '@/types';

export default function HomePage() {
  const { members, clubSettings, currentUser, activityPosts } = usePortal();

  const totalMembers = members.length;
  const publishedPosts = (activityPosts || []).filter((p) => p.published).slice(0, 3);

  // ── Leadership & Volunteers (5 Members including Treasurer) ────────────────
  const committeeMembers = (members || [])
    .filter((m) => m.committeeRole && m.status === 'ACTIVE')
    .sort((a, b) => {
      const orderA = COMMITTEE_ROLE_ORDER[a.committeeRole!] ?? 99;
      const orderB = COMMITTEE_ROLE_ORDER[b.committeeRole!] ?? 99;
      return orderA - orderB;
    });

  const activeVolunteers = (members || []).filter(
    (m) => m.status === 'ACTIVE' && !m.committeeRole
  );

  // Find Treasurer explicitly
  const treasurerMember = (members || []).find(
    (m) => m.status === 'ACTIVE' && m.committeeRole?.toLowerCase().includes('treasurer')
  );

  let previewList: Member[] = [];
  if (treasurerMember) {
    const withoutTreasurer = committeeMembers.filter(
      (m) => !m.committeeRole?.toLowerCase().includes('treasurer')
    );
    // Take top 4 from committee + treasurer (5 members)
    previewList = [...withoutTreasurer.slice(0, 4), treasurerMember];
    previewList.sort((a, b) => {
      const orderA = COMMITTEE_ROLE_ORDER[a.committeeRole!] ?? 99;
      const orderB = COMMITTEE_ROLE_ORDER[b.committeeRole!] ?? 99;
      return orderA - orderB;
    });
  } else {
    previewList = committeeMembers.slice(0, 5);
    if (previewList.length < 5) {
      previewList = [...previewList, ...activeVolunteers].slice(0, 5);
    }
  }
  const leadershipPreview = previewList;

  // ── Slideshow ──────────────────────────────────────────────────────────────
  const slideshowImages = [
    {
      src: '/img/slideshow1.jpg',
      title: 'Free Eye Checkup Camp',
      caption: 'Annual comprehensive pediatric and community ophthalmology clinic.',
    },
    {
      src: '/img/slideshow2.jpg',
      title: 'Abritti School Performance',
      caption: 'Our students showcasing recitation and cultural heritage at Egra Mela.',
    },
    {
      src: '/img/slideshow3.jpg',
      title: 'Sudhi Samman Felicitation',
      caption: 'Honoring eminent educationists and grassroots social workers.',
    },
    {
      src: '/img/slideshow4.jpg',
      title: 'Pediatric Health Check-up',
      caption: 'Free specialist healthcare consultations and child wellness camps.',
    },
  ];

  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slideshowImages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slideshowImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slideshowImages.length, isPaused]);

  const prevSlide = () =>
    setSlideIndex((i) => (i - 1 + slideshowImages.length) % slideshowImages.length);
  const nextSlide = () => setSlideIndex((i) => (i + 1) % slideshowImages.length);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-16 lg:pb-0">
      <Header />

      {/* ── 1. Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#FBEAEB]/15 blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-100 shadow-xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping" />
            <span>Serving the Community Since 1935</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {clubSettings.clubNameBengali}
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-bold text-pink-100 tracking-wide uppercase">
              {clubSettings.clubNameEnglish || 'Khejurda Palliunnyayan Narayan Sangha'}
            </p>
          </div>

          {clubSettings.tagline && (
            <p className="text-base sm:text-xl font-light text-pink-100/90 tracking-wide max-w-2xl mx-auto italic">
              &ldquo;{clubSettings.tagline}&rdquo;
            </p>
          )}

          {/* Government Registration Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-[11px] sm:text-xs font-medium text-amber-100 max-w-full truncate">
            <span>🏛️ Reg. Under West Bengal Societies Registration Act, 1961 &bull; Reg. No: SO168946</span>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-light">
            Dedicated to grassroots rural development, pediatric healthcare camps, Anganwadi child
            nutrition support, and rich cultural traditions across Purba Medinipur.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto w-full">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                type="primary"
                size="large"
                icon={<UserAddOutlined />}
                className="w-full sm:w-auto bg-[#FBEAEB] text-[#3447AA] hover:bg-white hover:text-[#1E2C78] font-bold text-sm sm:text-base h-11 sm:h-12 px-7 rounded-xl shadow-lg border-0 transition"
              >
                Become a Member
              </Button>
            </Link>

            <Link href={currentUser ? '/member/dashboard' : '/login'} className="w-full sm:w-auto">
              <Button
                ghost
                size="large"
                icon={<LoginOutlined />}
                className="w-full sm:w-auto border-white/60 text-white hover:border-white hover:bg-white/10 font-bold text-sm sm:text-base h-11 sm:h-12 px-7 rounded-xl transition"
              >
                {currentUser ? 'Go to Dashboard' : 'Member Login'}
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 sm:pt-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-2 sm:gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 border border-white/15">
              <div>
                <p className="text-xl sm:text-3xl font-black text-white">{totalMembers}+</p>
                <p className="text-[10px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Registered Members
                </p>
              </div>
              <div className="border-x border-white/20">
                <p className="text-xl sm:text-3xl font-black text-green-300">1935</p>
                <p className="text-[10px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Founded In
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black text-white">100%</p>
                <p className="text-[10px] sm:text-xs text-pink-100 uppercase tracking-wider font-medium mt-0.5">
                  Volunteer Driven
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Modern & Attractive Photo Slideshow ─────────────────────────── */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 bg-gray-900 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slideshow Viewport */}
          <div className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[500px] overflow-hidden">
            {slideshowImages.map((slide, idx) => {
              const isActive = idx === slideIndex;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none scale-105'
                  }`}
                >
                  {/* Ambient blurred backdrop for seamless fit without harsh letterboxes */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-40"
                    style={{ backgroundImage: `url(${slide.src})` }}
                  />

                  {/* Sharp centered image */}
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="relative z-10 w-full h-full object-contain"
                  />

                  {/* Sleek bottom gradient overlay */}
                  <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                  {/* Floating Glassmorphism Caption Card */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto z-20 max-w-md">
                    <div className="backdrop-blur-md bg-black/45 border border-white/20 rounded-2xl p-3.5 sm:p-5 text-white shadow-lg space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#3447AA]/80 text-pink-100 text-[10px] font-extrabold uppercase tracking-wider">
                          Gallery &bull; {idx + 1}/{slideshowImages.length}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-bold text-white leading-snug drop-shadow-sm">
                        {slide.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 font-light">
                        {slide.caption}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-[#3447AA] text-white backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-105 shadow-md active:scale-95"
              aria-label="Previous slide"
            >
              <LeftOutlined className="text-sm sm:text-base" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-[#3447AA] text-white backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-105 shadow-md active:scale-95"
              aria-label="Next slide"
            >
              <RightOutlined className="text-sm sm:text-base" />
            </button>

            {/* Modern Pill Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-1.5 backdrop-blur-md bg-black/30 px-3 py-1.5 rounded-full border border-white/15">
              {slideshowImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === slideIndex
                      ? 'w-6 bg-white shadow-xs'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Community Welfare Initiatives ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Social Welfare &amp; Community Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Our Core Pillars of Service
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Serving rural Purba Medinipur through healthcare, child wellness, and literature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: ICDS */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl mb-4">
                <SmileOutlined />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ICDS &amp; Child Development</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Dedicated support for pre-school education, malnutrition eradication, and maternal
                health education across local Anganwadi centers in our rural block.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/about?tab=icds"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
              >
                <span>Read ICDS Mission</span>
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Health & Eye Camps */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3447AA] flex items-center justify-center text-2xl mb-4">
                <MedicineBoxOutlined />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Medical &amp; Eye Camps</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Pediatric medical checkups with specialist doctors, free medicines for backward
                children, and ophthalmic surgery camps with Lions&apos; Club of Egra.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/about?tab=health"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
              >
                <span>Healthcare Camps</span>
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Sudhi Samman */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4">
                <BookOutlined />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sudhi Samman &amp; Literature</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Annual Sahitya Baasar honoring educators &amp; intellectuals, alongside publishing our
                esteemed literary little magazine <em>&ldquo;Saaraswat Arghya&rdquo;</em>.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/about?tab=culture"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3447AA] hover:underline"
              >
                <span>Explore Heritage</span>
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Meet Team KPNS: 5 Volunteers (including Treasurer) ───────────── */}
      <section className="py-12 sm:py-16 bg-white border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                Our Leadership &amp; Volunteers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                Meet Team KPNS
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Governed by an elected Managing Committee and dedicated member volunteers.
              </p>
            </div>
            <Link href="/team">
              <Button
                type="primary"
                icon={<TeamOutlined />}
                className="bg-[#3447AA] hover:bg-[#283887] font-bold text-xs h-10 px-5 rounded-xl transition"
              >
                View Full Committee &amp; Directory
              </Button>
            </Link>
          </div>

          {/* 5-Column Grid on Laptop/Desktop, 2-3 on Tablet, 1 on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {leadershipPreview.length > 0 ? (
              leadershipPreview.map((person) => {
                const designation =
                  person.committeeRole ||
                  (person.role === 'ADMIN' ? 'Administrator' : 'Active Member');
                const admissionYear = person.admissionDate
                  ? new Date(person.admissionDate).getFullYear()
                  : '1935';

                return (
                  <div
                    key={person.id}
                    className="relative overflow-hidden bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-gray-200/80 text-center space-y-2 hover:bg-white hover:shadow-md transition duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {person.avatarUrl ? (
                        <Avatar
                          src={person.avatarUrl}
                          size={56}
                          className="mx-auto border-2 border-[#3447AA] shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#3447AA] to-[#202E7A] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                          {person.name.charAt(0)}
                        </div>
                      )}
                      <h4
                        className="text-sm font-bold text-gray-900 mt-2.5 truncate"
                        title={person.name}
                      >
                        {person.name}
                      </h4>
                      <p
                        className="text-[11px] font-semibold text-[#3447AA] truncate mt-0.5"
                        title={designation}
                      >
                        {designation}
                      </p>
                      {person.villageTown && (
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          {person.villageTown}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
                        Since {admissionYear}
                      </span>
                      {person.committeeVision && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-50 text-[#3447AA] text-[10px] font-semibold border border-pink-200/60">
                          ✨ Vision
                        </span>
                      )}
                    </div>

                    {/* Vision overlay on hover */}
                    {person.committeeVision && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#3447AA]/95 to-[#202E7A]/98 flex flex-col items-center justify-center px-4 py-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <svg
                          className="w-6 h-6 text-pink-200 mb-2 opacity-80 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-white text-[11px] font-medium italic text-center leading-relaxed line-clamp-6">
                          {person.committeeVision}
                        </p>
                        <span className="mt-2 text-pink-200 text-[10px] font-bold uppercase tracking-wider">
                          — {person.name}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-6 text-xs text-gray-400">
                No active committee members found in database.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Recent Activities ────────────────────────────────────────────── */}
      {publishedPosts.length > 0 && (
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA] flex items-center gap-1.5">
                <NotificationOutlined /> Latest Updates &amp; Programs
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                Recent Activities
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Glimpses of our ongoing social welfare, health camps, and cultural events.
              </p>
            </div>
            <Link href="/about?tab=activity">
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                className="bg-[#3447AA] hover:bg-[#283887] font-bold text-xs h-10 px-5 rounded-xl transition"
              >
                View All Activities
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {post.photoUrl ? (
                    <div className="h-52 sm:h-56 overflow-hidden bg-gray-100">
                      <img
                        src={post.photoUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition duration-300 hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-blue-50/70 flex items-center justify-center text-blue-300">
                      <FileImageOutlined className="text-4xl" />
                    </div>
                  )}

                  <div className="p-5 space-y-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3447AA] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      <CalendarOutlined />
                      {dayjs(post.postDate).format('DD MMM YYYY')}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 font-light">
                      {post.body}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-end border-t border-gray-50">
                  <Link
                    href="/about?tab=activity"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#3447AA] hover:underline"
                  >
                    <span>Read Details</span>
                    <ArrowRightOutlined />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Modern Footer (with Four Social Media Logos) ─────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 mt-auto border-t border-gray-800">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Row: Club Info + 4 Social Media Logos */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-white font-extrabold text-base sm:text-lg tracking-wide">
                {clubSettings.clubNameBengali}
              </p>
              <p className="font-semibold text-gray-300 text-xs tracking-wider">
                {clubSettings.clubNameEnglish || 'KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS)'}
              </p>
              <p className="text-gray-400 text-xs">
                KPNS &copy; 1935–{new Date().getFullYear()} &bull; Reg. No: SO168946 &bull; Khejurda, Purba Medinipur
              </p>
            </div>

            {/* Four Social Media Logos */}
            <div className="flex items-center gap-3">
              {/* 1. Facebook */}
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow KPNS on Facebook"
                className="w-11 h-11 rounded-full bg-gray-850 hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center text-xl transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
                aria-label="Facebook"
              >
                <FacebookFilled />
              </a>

              {/* 2. Instagram */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow KPNS on Instagram"
                className="w-11 h-11 rounded-full bg-gray-850 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-gray-300 hover:text-white flex items-center justify-center text-xl transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
                aria-label="Instagram"
              >
                <InstagramFilled />
              </a>

              {/* 3. YouTube */}
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                title="Subscribe to KPNS on YouTube"
                className="w-11 h-11 rounded-full bg-gray-850 hover:bg-[#FF0000] text-gray-300 hover:text-white flex items-center justify-center text-xl transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
                aria-label="YouTube"
              >
                <YoutubeFilled />
              </a>

              {/* 4. X (Twitter) */}
              <a
                href={SOCIAL_LINKS.x || SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow KPNS on X"
                className="w-11 h-11 rounded-full bg-gray-850 hover:bg-white text-gray-300 hover:text-black flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 border border-gray-800 hover:border-transparent"
                aria-label="X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom Row: Quick Navigation Links + Legal Note */}
          <div className="pt-6 border-t border-gray-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
            <p className="text-gray-500 text-[11px]">
              Registered under West Bengal Societies Registration Act, 1961 &bull; All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <span>&bull;</span>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
              <span>&bull;</span>
              <Link href="/team" className="hover:text-white transition">
                Team KPNS
              </Link>
              <span>&bull;</span>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
              <span>&bull;</span>
              <Link href="/register" className="hover:text-white transition">
                Apply Membership
              </Link>
              <span>&bull;</span>
              <Link href="/login" className="hover:text-white transition">
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}
