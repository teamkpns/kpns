'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tabs, Input, Select, Avatar, Empty } from 'antd';
import {
  TeamOutlined,
  CrownOutlined,
  UserOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  MailOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { StatusTag } from '@/components/common/StatusTag';
import { usePortal } from '@/context/portal-context';
import { COMMITTEE_ROLE_ORDER } from '@/lib/constants';
import { Member } from '@/types';
import { formatDate } from '@/lib/utils';

const { Option } = Select;

// Role badge colour coding
const roleBadgeClass = (role: string): string => {
  if (role === 'President') return 'bg-[#3447AA] text-white';
  if (role === 'General Secretary') return 'bg-[#202E7A] text-white';
  if (role === 'Vice President') return 'bg-indigo-700 text-white';
  if (role.includes('Secretary')) return 'bg-indigo-100 text-indigo-900';
  if (role === 'Treasurer') return 'bg-green-100 text-green-800';
  if (role === 'Executive Committee Member') return 'bg-gray-100 text-gray-700';
  return 'bg-pink-100 text-pink-800';
};

export default function TeamKPNSPage() {
  const { members, clubSettings } = usePortal();
  const [activeTab, setActiveTab] = useState('committee');
  const [memberSearch, setMemberSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('ALL');

  // Derive committee members from actual member data
  const committeeMembers = members
    .filter((m) => m.committeeRole && m.status === 'ACTIVE')
    .sort((a, b) => {
      const orderA = COMMITTEE_ROLE_ORDER[a.committeeRole!] ?? 99;
      const orderB = COMMITTEE_ROLE_ORDER[b.committeeRole!] ?? 99;
      return orderA - orderB;
    });

  // Group by role category for section headings: Executive Leadership has President & General Secretary only
  const leadership = committeeMembers.filter((m) =>
    ['President', 'General Secretary'].includes(m.committeeRole!)
  );
  const officeBearers = committeeMembers.filter((m) =>
    [
      'Vice President',
      'Assistant Secretary',
      'Treasurer',
      'Sports Secretary',
      'Cultural Secretary',
      'Information Technology Secretary',
    ].includes(m.committeeRole!)
  );
  const executiveMembers = committeeMembers.filter(
    (m) => m.committeeRole === 'Executive Committee Member'
  );

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

  const renderMemberCard = (member: Member) => {
    const isLeader = ['President', 'General Secretary'].includes(member.committeeRole ?? '');
    return (
      <div
        key={member.id}
        className={`bg-white rounded-3xl p-5 sm:p-6 border transition hover:shadow-md flex flex-col justify-between ${
          isLeader
            ? 'border-pink-200 bg-gradient-to-b from-pink-50/50 to-white shadow-xs'
            : 'border-gray-100 shadow-xs'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <Avatar
              size={60}
              icon={<UserOutlined />}
              className={`shrink-0 ${isLeader ? 'bg-[#3447AA] text-white' : 'bg-[#FBEAEB] text-[#3447AA]'}`}
            />
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeClass(member.committeeRole!)}`}
            >
              {member.committeeRole}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {member.name}
          </h3>
          <p className="text-[11px] font-mono text-gray-400 mt-0.5">{member.memberId}</p>
          <p className="text-xs text-gray-500 mt-1">
            {member.villageTown}
            {member.district ? `, ${member.district}` : ''}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
          {member.whatsapp && (
            <a
              href={`https://wa.me/91${member.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-semibold transition"
            >
              <WhatsAppOutlined />
              WhatsApp
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
            >
              <MailOutlined />
              Email
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
            Our elected Managing Committee and all registered community members — fetched live from
            the database.
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{committeeMembers.length}</p>
              <p className="text-xs text-pink-100 uppercase tracking-wider">Committee Members</p>
            </div>
            <div className="border-l border-white/30 h-8" />
            <div className="text-center">
              <p className="text-2xl font-black text-white">{members.length}</p>
              <p className="text-xs text-pink-100 uppercase tracking-wider">Total Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-8">
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
                    <CrownOutlined /> Managing Committee ({committeeMembers.length})
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

        {/* TAB 1: MANAGING COMMITTEE (from live backend) */}
        {activeTab === 'committee' && (
          <div className="space-y-10 animate-fade-in">
            {committeeMembers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center space-y-3">
                <CrownOutlined className="text-4xl text-amber-400" />
                <h3 className="text-lg font-bold text-gray-700">No Committee Roles Assigned Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Admin can assign committee roles to any member from{' '}
                  <strong>Admin → Members Directory → Set Role</strong>.
                </p>
              </div>
            ) : (
              <>
                {/* Leadership */}
                {leadership.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-b border-gray-200/80 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                        Executive Leadership
                      </span>
                      <h2 className="text-xl font-black text-gray-900">President &amp; General Secretary</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {leadership.map(renderMemberCard)}
                    </div>
                  </div>
                )}

                {/* Office Bearers */}
                {officeBearers.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-b border-gray-200/80 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                        Administrative Office Bearers
                      </span>
                      <h2 className="text-xl font-black text-gray-900">Secretaries & Portfolio In-Charge</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {officeBearers.map(renderMemberCard)}
                    </div>
                  </div>
                )}

                {/* Executive Members */}
                {executiveMembers.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-b border-gray-200/80 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                        Field & Programme Coordinators
                      </span>
                      <h2 className="text-xl font-black text-gray-900">Executive Committee Members</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {executiveMembers.map(renderMemberCard)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 2: ALL MEMBERS DIRECTORY */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="w-full sm:w-80">
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Search by name, member ID, or village..."
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
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <Option key={bg} value={bg}>{bg}</Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Members Grid */}
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Avatar
                          size={48}
                          icon={<UserOutlined />}
                          className="bg-[#3447AA] text-white shrink-0"
                        />
                        <div className="text-right">
                          <span className="block px-2 py-0.5 rounded-full bg-[#FBEAEB] text-[#3447AA] text-[11px] font-mono font-bold">
                            {member.memberId}
                          </span>
                          {member.committeeRole && (
                            <span className="mt-1 block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              <CrownOutlined className="mr-0.5" />{member.committeeRole}
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900">{member.name}</h4>
                      <p className="text-[11px] text-gray-400">Father: {member.fatherName || '—'}</p>

                      <div className="mt-2.5 space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <EnvironmentOutlined className="text-gray-400" />
                          <span>
                            {member.villageTown}, {member.district || 'Purba Medinipur'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarOutlined className="text-gray-400" />
                          <span>Since: {formatDate(member.admissionDate)}</span>
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

        {/* Bottom CTA */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Grow Our Community
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            Want to Join Team KPNS?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Enroll today as a registered member of খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ through our
            online portal.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <button className="inline-flex items-center gap-2 bg-[#3447AA] hover:bg-[#283887] text-white font-bold text-sm h-11 px-7 rounded-xl shadow-md transition">
                <UserAddOutlined />
                Apply for Membership
              </button>
            </Link>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
