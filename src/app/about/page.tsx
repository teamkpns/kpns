'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { Button, Tabs, Empty, Spin, Modal } from 'antd';
import {
  HeartFilled,
  MedicineBoxOutlined,
  BookOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  SmileOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  NotificationOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  FacebookFilled,
  YoutubeFilled,
  EyeOutlined,
  VideoCameraOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { ActivityPost } from '@/types';
import {
  KPNS_CUP_YEARS,
  BOISHAKHI_YEARS,
  CupYearData,
  CupPhoto,
  BoishakhiYearData,
  BoishakhiVideo,
} from '@/lib/events-data';

function AboutContent() {
  const { clubSettings, activityPosts, isLoading } = usePortal();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('activity');

  // Sub-tab state for KPNS CUP and Boishakhi Sandhya
  const [selectedCupYear, setSelectedCupYear] = useState<number>(2025);
  const [selectedBoishakhiYear, setSelectedBoishakhiYear] = useState<string>('১৪৩১');

  // Modals for interactive previews
  const [previewPhoto, setPreviewPhoto] = useState<CupPhoto | null>(null);
  const [activeVideo, setActiveVideo] = useState<BoishakhiVideo | null>(null);

  // Allow direct deep-link to any tab: e.g. /about?tab=kpnscup or /about?tab=boishakhi
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const currentCup: CupYearData =
    KPNS_CUP_YEARS.find((y) => y.year === selectedCupYear) || KPNS_CUP_YEARS[0];

  const currentBoishakhi: BoishakhiYearData =
    BOISHAKHI_YEARS.find((y) => y.bengaliYear === selectedBoishakhiYear) || BOISHAKHI_YEARS[0];

  const icdsObjectives = [
    {
      title: 'Nutrition & Child Health',
      desc: 'Improving the nutritional and health status of vulnerable children in the critical age group of 0–6 years.',
    },
    {
      title: 'Holistic Development',
      desc: 'Laying strong cognitive, psychological, physical, and social foundations for rural children.',
    },
    {
      title: 'Reducing Mortality & Malnutrition',
      desc: 'Actively combating malnutrition, child morbidity, and school dropouts in our rural jurisdiction.',
    },
    {
      title: 'Maternal Capability & Wellness',
      desc: 'Empowering expecting and nursing mothers with proper health and nutritional education.',
    },
    {
      title: 'Inter-departmental Coordination',
      desc: 'Partnering seamlessly with ASHA Karmees, Anganwadi workers, and district healthcare authorities.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-12">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-100">
            A Dedicated Volunteer Organization • Est. 1935
          </span>
          <h1
            suppressHydrationWarning
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
          >
            About {clubSettings.clubNameBengali}
          </h1>
          <p
            suppressHydrationWarning
            className="text-base sm:text-xl text-pink-100 font-light italic max-w-2xl mx-auto"
          >
            &ldquo;{clubSettings.tagline}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl mx-auto leading-relaxed pt-2">
            Founded in 1935 in the rural heartland of Khejurda, Purba Medinipur, KPNS has stood as
            a steadfast pillar of community development, public healthcare, child welfare, and
            cultural enlightenment for over nine decades.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-8">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            centered
            items={[
              {
                key: 'activity',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <NotificationOutlined /> Recent Activity
                  </span>
                ),
              },
              {
                key: 'overview',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <TeamOutlined /> Organization & Legacy
                  </span>
                ),
              },
              {
                key: 'icds',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <SmileOutlined /> ICDS & Child Welfare
                  </span>
                ),
              },
              {
                key: 'kpnscup',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm text-amber-700">
                    <TrophyOutlined className="text-amber-500" /> KPNS CUP
                  </span>
                ),
              },
              {
                key: 'boishakhi',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm text-rose-700">
                    <PlayCircleOutlined className="text-rose-500" /> বৈশাখী সন্ধ্যা
                  </span>
                ),
              },
              {
                key: 'health',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <MedicineBoxOutlined /> Medical & Eye Camps
                  </span>
                ),
              },
              {
                key: 'culture',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <BookOutlined /> Sudhi Samman & Literature
                  </span>
                ),
              },
            ]}
          />
        </div>

        {/* TAB 1: RECENT ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                News &amp; Programs
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Recent Activity</h2>
              <p className="text-sm text-gray-500 mt-1">
                Latest events, health camps, and community initiatives by KPNS.
              </p>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 flex justify-center">
                <Spin size="large" />
              </div>
            ) : activityPosts.filter((p) => p.published).length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <p className="text-gray-500 text-sm">No activity posts yet. Check back soon!</p>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activityPosts
                  .filter((p) => p.published)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OVERVIEW & LEGACY */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Story Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                  Our Roots & Heritage
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  Nine Decades of Voluntary Social Upliftment
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong>KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS)</strong> was established in{' '}
                  <strong>1935</strong> by visionary community leaders to empower the rural
                  dwellers of Khejurda, Egra, and neighboring villages of Purba Medinipur, West
                  Bengal.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Operating entirely through selfless volunteer dedication, the Sangha conducts
                  continuous programs in <strong>free pediatric healthcare</strong>,{' '}
                  <strong>ophthalmic surgeries</strong>, <strong>child nutrition</strong>,{' '}
                  <strong>literary publications</strong>, and{' '}
                  <strong>felicitation of regional scholars</strong>.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FBEAEB] text-[#3447AA] text-xs font-bold">
                    🏛️ Est. 1935
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    📍 Purba Medinipur, West Bengal
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                    🤝 100% Volunteer Driven
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#FBEAEB] via-pink-50 to-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <SafetyCertificateOutlined className="text-[#3447AA]" />
                  Core Mission Pillars
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
                    <p className="text-xs font-bold text-gray-900">Child & Mother Health</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Supporting Anganwadi ICDS centers and rural pediatric nutrition.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
                    <p className="text-xs font-bold text-gray-900">Free Medical Relief</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Free doctor checkups, eye surgery camps, and medicine distributions.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
                    <p className="text-xs font-bold text-gray-900">Literature & Heritage</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Felicitation of local scholars through Sudhi Samman & Saaraswat Arghya.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center shadow-xs">
                <p className="text-2xl sm:text-3xl font-black text-[#3447AA]">1935</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Foundation Year</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center shadow-xs">
                <p className="text-2xl sm:text-3xl font-black text-pink-600">500+</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Kids Treated Annually</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center shadow-xs">
                <p className="text-2xl sm:text-3xl font-black text-green-600">100%</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Free Medical Aid</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center shadow-xs">
                <p className="text-2xl sm:text-3xl font-black text-amber-600">90+ Yrs</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Community Service</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ICDS & CHILD DEVELOPMENT */}
        {activeTab === 'icds' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                  Child Welfare Focus
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                  Integrated Child Development Scheme (ICDS)
                </h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Inaugurated under national welfare guidelines, the Integrated Child Development
                  Scheme (ICDS) ensures pre-school education to every child, eradicates
                  malnourishment, and monitors the healthcare of expectant and nursing mothers
                  across local Anganwadi centers.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900">Key Objectives & Community Commitments:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {icdsObjectives.map((obj, i) => (
                    <div
                      key={i}
                      className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#3447AA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{obj.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{obj.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KPNS CUP (Added right after ICDS) */}
        {activeTab === 'kpnscup' && (
          <div className="space-y-6 animate-fade-in">
            {/* Introductory Card with exact text */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/40 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-bold border border-amber-300">
                  🏆 Annual Sports Tournament • Est. 2013
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  ⚽ 13+ Annual Editions
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                  🤝 Promoting Youth Camaraderie
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  <TrophyOutlined className="text-amber-500" />
                  KPNS CUP
                </h2>
                {/* Exact user-provided description */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl mt-2 font-normal">
                  KPNS CUP was started in 2013 with the aim of promoting sports, teamwork, and
                  community spirit. Since then, it has been organized every year, bringing players
                  and supporters together in the spirit of healthy competition and friendship. We
                  look forward to continuing this tradition for years to come.
                </p>
              </div>

              {/* Tournament Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <p className="text-xl sm:text-2xl font-black text-amber-700">2013</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Year of Inception</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <p className="text-xl sm:text-2xl font-black text-[#3447AA]">16 Teams</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Regional Clubs</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <p className="text-xl sm:text-2xl font-black text-green-700">Annual</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Winter Championship</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <p className="text-xl sm:text-2xl font-black text-purple-700">5,000+</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Enthusiastic Spectators</p>
                </div>
              </div>
            </div>

            {/* Year Sub-Tabs Navigation */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <CalendarOutlined className="text-[#3447AA]" />
                    Tournament Editions &amp; Facebook Photos
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select a year below to explore tournament memories, champions, and photo albums.
                  </p>
                </div>
                <a
                  href="https://www.facebook.com/kpns.club/photos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition text-xs font-bold w-fit"
                >
                  <FacebookFilled /> Visit KPNS Facebook Photos
                </a>
              </div>

              {/* Scrollable Year Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {KPNS_CUP_YEARS.map((edition) => {
                  const isActive = edition.year === selectedCupYear;
                  return (
                    <button
                      key={edition.year}
                      onClick={() => setSelectedCupYear(edition.year)}
                      className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#3447AA] text-white shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <TrophyOutlined className={isActive ? 'text-amber-300' : 'text-gray-400'} />
                      <span>{edition.year}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {edition.edition.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Year Highlights Banner */}
              <div className="bg-gradient-to-r from-blue-50/80 via-white to-amber-50/50 p-5 rounded-2xl border border-blue-100/80 mt-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#3447AA]">
                      KPNS CUP {currentCup.year} • {currentCup.edition}
                    </span>
                    <h4 className="text-lg font-black text-gray-900 mt-0.5">{currentCup.season}</h4>
                    <p className="text-xs text-gray-600 mt-1 max-w-2xl">{currentCup.description}</p>
                  </div>

                  <a
                    href={currentCup.facebookAlbumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] text-white hover:bg-[#1464cc] transition font-bold text-xs shadow-xs shrink-0 self-start sm:self-center"
                  >
                    <FacebookFilled className="text-base" />
                    <span>View Album on Facebook</span>
                  </a>
                </div>

                {/* Match Summary Chips */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-amber-100/80 text-amber-900 font-bold flex items-center gap-1.5">
                    🥇 Champion: {currentCup.champion}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 font-semibold flex items-center gap-1.5">
                    🥈 Runner-up: {currentCup.runnersUp}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 font-medium flex items-center gap-1.5">
                    🏟️ {currentCup.venue}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-green-50 text-green-800 font-medium">
                    ⚽ {currentCup.teamsCount} Teams
                  </span>
                </div>
              </div>

              {/* Photo Gallery Grid for the Selected Year */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <PictureOutlined className="text-[#3447AA]" />
                    Tournament Photos ({currentCup.year})
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Click any photo to enlarge or view on Facebook
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentCup.photos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setPreviewPhoto(photo)}
                      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                    >
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                          {photo.category}
                        </span>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                          <EyeOutlined className="text-xl" />
                          <span className="text-xs font-bold">View Photo</span>
                        </div>
                      </div>

                      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
                        <div>
                          <h5 className="font-bold text-gray-900 text-xs leading-snug line-clamp-1">
                            {photo.title}
                          </h5>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {photo.caption}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                            <FacebookFilled /> Facebook
                          </span>
                          <span className="text-[10px] text-gray-400 group-hover:text-[#3447AA] font-bold">
                            Enlarge ↗
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: বৈশাখী সন্ধ্যা (Added right after KPNS CUP) */}
        {activeTab === 'boishakhi' && (
          <div className="space-y-6 animate-fade-in">
            {/* Introductory Card with exact text */}
            <div className="bg-gradient-to-br from-rose-500/10 via-red-50/40 to-white rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-800 text-xs font-bold border border-rose-300">
                  🎭 বাংলার ঐতিহ্য ও বাৎসরিক সাংস্কৃতিক মহোৎসব • সূচনা ১৪১৯ বঙ্গাব্দ
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
                  🎶 সঙ্গীত, নৃত্য ও নাট্যানুষ্ঠান
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
                  🌟 লোকসংস্কৃতির মিলনমেলা
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  <PlayCircleOutlined className="text-rose-600" />
                  বৈশাখী সন্ধ্যা
                </h2>
                {/* Exact user-provided Bengali description */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl mt-2 font-normal">
                  বৈশাখী সন্ধ্যা শুরু হয়েছিল ১৪১৯ বঙ্গাব্দে। বাংলার সংস্কৃতি, ঐতিহ্য ও লোকজ আনন্দকে
                  কেন্দ্র করে এই অনুষ্ঠান প্রতিবছর নতুন উদ্দীপনা ও উৎসাহের সঙ্গে আয়োজিত হয়ে আসছে।
                  সঙ্গীত, নৃত্য, আবৃত্তি ও সাংস্কৃতিক পরিবেশনার মাধ্যমে বৈশাখী সন্ধ্যা আমাদের সকলকে
                  একসূত্রে বেঁধে রাখে।
                </p>
              </div>

              {/* Cultural Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-rose-100 shadow-2xs text-center">
                  <p className="text-lg sm:text-xl font-black text-rose-700">১৪১৯ বঙ্গাব্দ</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">সূচনা বর্ষ (2012-13)</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-rose-100 shadow-2xs text-center">
                  <p className="text-lg sm:text-xl font-black text-purple-700">রবীন্দ্র-নজরুল</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">ও লোকসঙ্গীত সুরধারা</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-rose-100 shadow-2xs text-center">
                  <p className="text-lg sm:text-xl font-black text-amber-700">নৃত্যনাট্য</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">ও ঐতিহ্যবাহী আবৃত্তি</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-rose-100 shadow-2xs text-center">
                  <p className="text-lg sm:text-xl font-black text-[#3447AA]">গুণীজন</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">সংবর্ধনা ও আশীর্বাদ</p>
                </div>
              </div>
            </div>

            {/* Year Sub-Tabs Navigation for Boishakhi Sandhya */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <YoutubeFilled className="text-red-600" />
                    প্রতি বছরের সাংস্কৃতিক আসর ও ইউটিউব ভিডিও প্লে-লিস্ট
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    প্রতিটি বছরের ট্যাব নির্বাচন করে বৈশাখী সন্ধ্যার অনুষ্ঠান ও ইউটিউব ভিডিও উপভোগ করুন।
                  </p>
                </div>
                <a
                  href="https://www.youtube.com/@kpns1935/playlists"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-xs font-bold w-fit"
                >
                  <YoutubeFilled /> অফিসিয়াল ইউটিউব চ্যানেল (@kpns1935)
                </a>
              </div>

              {/* Scrollable Bengali Year Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {BOISHAKHI_YEARS.map((edition) => {
                  const isActive = edition.bengaliYear === selectedBoishakhiYear;
                  return (
                    <button
                      key={edition.bengaliYear}
                      onClick={() => setSelectedBoishakhiYear(edition.bengaliYear)}
                      className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-rose-700 text-white shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <PlayCircleOutlined className={isActive ? 'text-amber-300' : 'text-gray-400'} />
                      <span>{edition.bengaliYear} বঙ্গাব্দ</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {edition.gregorianYear}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Playlist Highlight Banner for the Selected Year */}
              <div className="bg-gradient-to-r from-red-50/70 via-white to-rose-50/40 p-5 rounded-2xl border border-red-100 mt-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
                  {/* Playlist Thumbnail Card */}
                  <div
                    onClick={() => {
                      if (currentBoishakhi.videos.length > 0) {
                        setActiveVideo(currentBoishakhi.videos[0]);
                      }
                    }}
                    className="relative w-full md:w-64 h-36 rounded-2xl overflow-hidden shadow-sm border border-red-200/80 cursor-pointer group shrink-0 bg-slate-900"
                  >
                    <img
                      src={currentBoishakhi.playlistThumbnail}
                      alt={currentBoishakhi.occasion}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-3 text-white">
                      <span className="self-start px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-black tracking-wide uppercase flex items-center gap-1">
                        <YoutubeFilled /> YouTube Playlist
                      </span>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black">{currentBoishakhi.bengaliYear} বৈশাখী সন্ধ্যা</p>
                          <p className="text-[10px] text-gray-300">{currentBoishakhi.videos.length} টি ভিডিও অন্তর্ভুক্ত</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-red-600 transition flex items-center justify-center text-white text-base">
                          <PlayCircleOutlined />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Playlist & Edition Description */}
                  <div className="flex-1 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                      বৈশাখী সন্ধ্যা • {currentBoishakhi.edition}
                    </span>
                    <h4 className="text-lg font-black text-gray-900">{currentBoishakhi.occasion}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{currentBoishakhi.description}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] pt-1 text-gray-600">
                      <span className="px-2.5 py-0.5 rounded-lg bg-gray-100">
                        📍 {currentBoishakhi.venue}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-800 font-semibold">
                        🎭 {currentBoishakhi.theme}
                      </span>
                    </div>
                  </div>

                  {/* Direct YouTube Playlist Button */}
                  <a
                    href={currentBoishakhi.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition font-bold text-xs shadow-xs shrink-0 self-start md:self-center"
                  >
                    <YoutubeFilled className="text-base" />
                    <span>ইউটিউব প্লে-লিস্ট খুলুন</span>
                  </a>
                </div>
              </div>

              {/* Video Showcase Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <VideoCameraOutlined className="text-red-600" />
                    সাংস্কৃতিক ভিডিও সংগ্রহ ({currentBoishakhi.bengaliYear} বঙ্গাব্দ)
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    ভিডিও থাম্বনেইলে ক্লিক করে সরাসরি দেখুন
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentBoishakhi.videos.map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                    >
                      {/* Video Thumbnail with YouTube Red Play Button */}
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        {/* YouTube Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110">
                            <PlayCircleOutlined />
                          </div>
                        </div>

                        {/* Category & Duration Tags */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                          {vid.category}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold">
                          {vid.duration}
                        </div>
                      </div>

                      {/* Video Details */}
                      <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                        <div>
                          <h5 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2">
                            {vid.bengaliTitle}
                          </h5>
                          {vid.performer && (
                            <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                              শিল্পী: {vid.performer}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                            <YoutubeFilled /> দেখুন
                          </span>
                          <a
                            href={vid.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-gray-400 hover:text-red-600 font-semibold"
                          >
                            YouTube-এ খুলুন ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HEALTH & EYE CAMPS */}
        {activeTab === 'health' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pediatric Health Camps */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl">
                  <MedicineBoxOutlined />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Free Health Camps for Children</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  KPNS regularly organizes free health check-up camps specifically tailored for the
                  economically backward children of our locality. Sick children are diagnosed and
                  provided with <strong>free medical aid and prescription medicines</strong> directly
                  from our organization.
                </p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-1 text-gray-700">
                  <p>
                    <strong>Medical Specialist Partner:</strong> Dr. Debabrata Karan (Renowned Child
                    Specialist, Ramnagar State General Hospital).
                  </p>
                  <p>
                    <strong>Field Support:</strong> Active assistance from rural ASHA Karmees and ICDS
                    workers.
                  </p>
                </div>
              </div>

              {/* Free Eye Care & Surgery Camps */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3447AA] flex items-center justify-center text-2xl">
                  <HeartFilled />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Free Eye Check-up & Surgery Camps</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Free ophthalmic check-up camps are hosted at our club premises for visually
                  challenged elders and rural patients in close collaboration with the esteemed{' '}
                  <strong>Lions&apos; Club of EGRA</strong>.
                </p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-1 text-gray-700">
                  <p>
                    <strong>Medicines & Eyeglasses:</strong> Arranged and funded directly by KPNS.
                  </p>
                  <p>
                    <strong>Complex Operations:</strong> Specialized cataract and eye surgery
                    arrangements facilitated with hospital partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SUDHI SAMMAN & LITERATURE */}
        {activeTab === 'culture' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                  Cultural & Literary Heritage
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                  Sudhi Samman & Sahitya Baasar
                </h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Every year, KPNS pays homage to intellectual luminaries, educators, and writers
                  who serve society with their vast knowledge and creative excellence through{' '}
                  <strong>&ldquo;Sahitya Baasar O Sudhi Samman Pradaan Anusthaan&rdquo;</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FBEAEB] p-5 rounded-2xl border border-pink-200 space-y-2">
                  <span className="text-xs font-bold uppercase text-[#3447AA]">Literary Journal</span>
                  <h4 className="text-base font-extrabold text-gray-900">
                    &ldquo;Saaraswat Arghya&rdquo; Magazine
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A special literary little magazine published annually to showcase original
                    creative writings, poems, and essays from local writers and thinkers.
                  </p>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold uppercase text-blue-800">Accreditation</span>
                  <h4 className="text-base font-extrabold text-gray-900">Scholar Felicitations</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Conferring mementos and certificates of accreditation to intellectuals who
                    inspire youth and preserve our Bengali cultural tradition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action Bar */}
        <div className="mt-10 bg-gradient-to-r from-[#3447AA] to-[#202E7A] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Join the KPNS Family Today</h3>
            <p className="text-xs sm:text-sm text-pink-100">
              Be a part of our ongoing voluntary initiatives and community progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/team">
              <Button
                size="large"
                className="bg-white/10 hover:bg-white/20 text-white border-white/40 font-bold rounded-xl text-xs sm:text-sm"
              >
                Meet Team KPNS
              </Button>
            </Link>
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                className="bg-[#FBEAEB] text-[#3447AA] hover:bg-white font-bold rounded-xl text-xs sm:text-sm shadow-md border-0"
              >
                Apply for Membership
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <MobileBottomNav />

      {/* Interactive Photo Modal for KPNS CUP */}
      <Modal
        open={!!previewPhoto}
        onCancel={() => setPreviewPhoto(null)}
        footer={null}
        width={720}
        centered
        className="rounded-3xl overflow-hidden"
      >
        {previewPhoto && (
          <div className="space-y-4 pt-2">
            <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-[70vh] flex items-center justify-center">
              <img
                src={previewPhoto.imageUrl}
                alt={previewPhoto.title}
                className="w-full max-h-[65vh] object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                  {previewPhoto.category}
                </span>
                <h4 className="text-base font-bold text-gray-900 mt-1">{previewPhoto.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{previewPhoto.caption}</p>
              </div>
              <a
                href={previewPhoto.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] text-white hover:bg-[#1464cc] text-xs font-bold shrink-0 transition"
              >
                <FacebookFilled /> Facebook-এ দেখুন
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Interactive Video Player Modal for বৈশাখী সন্ধ্যা */}
      <Modal
        open={!!activeVideo}
        onCancel={() => setActiveVideo(null)}
        footer={null}
        width={800}
        centered
        destroyOnClose
        className="rounded-3xl overflow-hidden"
      >
        {activeVideo && (
          <div className="space-y-4 pt-2">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.bengaliTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold">
                  {activeVideo.category}
                </span>
                <h4 className="text-base font-bold text-gray-900 mt-1">{activeVideo.bengaliTitle}</h4>
                {activeVideo.performer && (
                  <p className="text-xs text-gray-600 mt-0.5">শিল্পী: {activeVideo.performer}</p>
                )}
              </div>
              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold shrink-0 transition"
              >
                <YoutubeFilled /> YouTube-এ দেখুন
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <AboutContent />
    </Suspense>
  );
}

// ── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: ActivityPost }) {
  const [expanded, setExpanded] = React.useState(false);
  const isLong = post.body.length > 280;

  const socialLinks = [
    { href: post.fbLink, icon: <FacebookOutlined />, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
    { href: post.instagramLink, icon: <InstagramOutlined />, label: 'Instagram', color: 'bg-pink-500 hover:bg-pink-600' },
    { href: post.youtubeLink, icon: <YoutubeOutlined />, label: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
    {
      href: post.xLink,
      icon: <span className="font-black text-sm">𝕏</span>,
      label: 'X',
      color: 'bg-gray-900 hover:bg-black',
    },
  ].filter((s) => !!s.href);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
      {/* Photo */}
      {post.photoUrl && (
        <div className="h-56 overflow-hidden">
          <img
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 space-y-3">
        {/* Date badge */}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3447AA] bg-blue-50 px-2.5 py-1 rounded-full w-fit">
          <CalendarOutlined />
          {dayjs(post.postDate).format('DD MMMM YYYY')}
        </span>

        {/* Title */}
        <h3 className="text-base font-black text-gray-900 leading-snug">{post.title}</h3>

        {/* Body */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {isLong && !expanded ? `${post.body.slice(0, 280)}…` : post.body}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-bold text-[#3447AA] hover:underline text-left"
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href!}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition ${s.color}`}
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
