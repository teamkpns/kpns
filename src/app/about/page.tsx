'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Row, Col, Tabs, Tag, Card } from 'antd';
import {
  HeartFilled,
  MedicineBoxOutlined,
  BookOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  UserAddOutlined,
  ArrowRightOutlined,
  SmileOutlined,
  AuditOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { SOCIAL_LINKS } from '@/lib/constants';

export default function AboutPage() {
  const { clubSettings } = usePortal();
  const [activeTab, setActiveTab] = useState('overview');

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            About {clubSettings.clubNameBengali}
          </h1>
          <p className="text-base sm:text-xl text-pink-100 font-light italic max-w-2xl mx-auto">
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

        {/* TAB 1: OVERVIEW & LEGACY */}
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

        {/* TAB 2: ICDS & CHILD DEVELOPMENT */}
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

        {/* TAB 3: HEALTH & EYE CAMPS */}
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

        {/* TAB 4: SUDHI SAMMAN & LITERATURE */}
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

      <MobileBottomNav />
    </div>
  );
}
