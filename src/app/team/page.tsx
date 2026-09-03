'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tabs, Input, Select, Button, Avatar, Tag, Card, Row, Col, Empty } from 'antd';
import {
  TeamOutlined,
  CrownOutlined,
  UserOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  MailOutlined,
  SearchOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { StatusTag } from '@/components/common/StatusTag';
import { usePortal } from '@/context/portal-context';
import { MANAGING_COMMITTEE, CommitteeMember, KPNS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

const { Option } = Select;

export default function TeamKPNSPage() {
  const { members, clubSettings } = usePortal();
  const [activeTab, setActiveTab] = useState('committee');
  const [memberSearch, setMemberSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('ALL');

  // Filter members for the Members tab
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.memberId.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.villageTown && m.villageTown.toLowerCase().includes(memberSearch.toLowerCase())) ||
      (m.city && m.city.toLowerCase().includes(memberSearch.toLowerCase()));

    const matchesBlood = bloodFilter === 'ALL' || m.bloodGroup === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  const renderCommitteeCard = (person: CommitteeMember) => {
    const isLeadership = person.roleType === 'EXECUTIVE_LEADER';
    const isBearer = person.roleType === 'OFFICE_BEARER';

    return (
      <div
        key={person.id}
        className={`bg-white rounded-3xl p-6 border transition hover:shadow-md flex flex-col justify-between ${
          isLeadership
            ? 'border-pink-200 bg-gradient-to-b from-pink-50/50 to-white shadow-xs'
            : isBearer
            ? 'border-indigo-100 hover:border-indigo-200'
            : 'border-gray-100'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              className={`shrink-0 ${
                isLeadership
                  ? 'bg-[#3447AA] text-white'
                  : 'bg-[#FBEAEB] text-[#3447AA]'
              }`}
            />
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isLeadership
                  ? 'bg-[#3447AA] text-white'
                  : isBearer
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Since {person.sinceYear}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {person.name}
          </h3>
          <p className="text-xs font-extrabold text-[#3447AA] mt-0.5">{person.designation}</p>

          {person.bio && (
            <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">{person.bio}</p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
          {person.whatsapp && (
            <a
              href={`https://wa.me/91${person.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-semibold transition"
            >
              <WhatsAppOutlined />
              <span>WhatsApp</span>
            </a>
          )}
          {person.phone && (
            <a
              href={`tel:${person.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 font-semibold transition"
            >
              <PhoneOutlined />
              <span>Call</span>
            </a>
          )}
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
            >
              <MailOutlined />
              <span>Email</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-12">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-100">
            <TeamOutlined /> KPNS Community Fraternity
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Team KPNS
          </h1>
          <p className="text-base sm:text-lg text-pink-100 font-light max-w-2xl mx-auto">
            Meet our dedicated Managing Committee leadership and registered community members
            working together for rural progress.
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
                key: 'committee',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <CrownOutlined /> Managing Committee ({MANAGING_COMMITTEE.length})
                  </span>
                ),
              },
              {
                key: 'members',
                label: (
                  <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <UserOutlined /> All Members ({members.length})
                  </span>
                ),
              },
            ]}
          />
        </div>

        {/* TAB 1: MANAGING COMMITTEE */}
        {activeTab === 'committee' && (
          <div className="space-y-10 animate-fade-in">
            {/* Executive Leadership */}
            <div className="space-y-4">
              <div className="border-b border-gray-200/80 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                  Executive Leadership
                </span>
                <h2 className="text-xl font-black text-gray-900">President & Executive Directorate</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {MANAGING_COMMITTEE.filter((m) => m.roleType === 'EXECUTIVE_LEADER').map(
                  renderCommitteeCard
                )}
              </div>
            </div>

            {/* Office Bearers */}
            <div className="space-y-4">
              <div className="border-b border-gray-200/80 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                  Administrative Office Bearers
                </span>
                <h2 className="text-xl font-black text-gray-900">Secretaries & Portfolio In-Charge</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MANAGING_COMMITTEE.filter((m) => m.roleType === 'OFFICE_BEARER').map(
                  renderCommitteeCard
                )}
              </div>
            </div>

            {/* Executive Committee Members */}
            <div className="space-y-4">
              <div className="border-b border-gray-200/80 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                  Field & Program Coordinators
                </span>
                <h2 className="text-xl font-black text-gray-900">Executive Committee Members</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {MANAGING_COMMITTEE.filter((m) => m.roleType === 'EXECUTIVE_MEMBER').map(
                  renderCommitteeCard
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERS DIRECTORY */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="w-full sm:w-80">
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Search members by name, ID, or village..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  allowClear
                  className="rounded-xl"
                  size="large"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-gray-500 shrink-0">Blood Group:</span>
                <Select
                  value={bloodFilter}
                  onChange={setBloodFilter}
                  size="large"
                  className="w-full sm:w-40 rounded-xl"
                >
                  <Option value="ALL">All Groups</Option>
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </div>
            </div>

            {/* Members Cards Grid */}
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Avatar
                          size={48}
                          icon={<UserOutlined />}
                          className="bg-[#3447AA] text-white shrink-0"
                        />
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FBEAEB] text-[#3447AA] text-[11px] font-mono font-bold">
                          {member.memberId}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 leading-snug">
                        {member.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Father: {member.fatherName || '—'}
                      </p>

                      <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <EnvironmentOutlined className="text-gray-400" />
                          <span>
                            {member.villageTown}, {member.district || 'Purba Medinipur'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarOutlined className="text-gray-400" />
                          <span>Member Since: {formatDate(member.admissionDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 font-bold text-xs">
                        🩸 {member.bloodGroup}
                      </span>
                      <StatusTag status={member.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center">
                <Empty description="No members found matching your search criteria" />
              </div>
            )}
          </div>
        )}

        {/* Bottom Call to Action */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Grow Our Community
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            Want to Join Team KPNS?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Enroll today as a registered member of খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ through our 4-step
            online portal.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                icon={<UserAddOutlined />}
                className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 px-7 rounded-xl shadow-md"
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
