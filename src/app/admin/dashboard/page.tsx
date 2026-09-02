'use client';

import React from 'react';
import Link from 'next/link';
import { Row, Col, Card, Button, Table, Badge, Avatar } from 'antd';
import {
  TeamOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  WarningFilled,
  UserAddOutlined,
  FileTextOutlined,
  UploadOutlined,
  ArrowRightOutlined,
  GiftOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatusTag } from '@/components/common/StatusTag';
import { usePortal } from '@/context/portal-context';
import { formatDate } from '@/lib/utils';
import { KPNS_COLORS } from '@/lib/constants';

export default function AdminDashboardPage() {
  const { members, applications, activityLogs } = usePortal();

  const totalMembers = 1240 + members.length;
  const activeMembers = 1175 + members.filter((m) => m.status === 'ACTIVE').length;
  const pendingApps = applications.filter((a) => a.status === 'PENDING').length;
  const incompleteProfiles = members.filter((m) => m.profileCompletion < 80).length + 84;

  const recentApplications = applications.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Welcome Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
              Administrative Control Center
            </span>
            <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">
              Overview of membership records, registrations, and club operational logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/members/import">
              <Button
                icon={<UploadOutlined />}
                className="rounded-xl font-semibold text-xs h-9 border-[#3447AA] text-[#3447AA]"
              >
                Import Members
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                className="bg-[#3447AA] font-bold text-xs h-9 rounded-xl shadow-xs"
              >
                Review Applications ({pendingApps})
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Dashboard Metric Cards (Specification Section 17) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Members */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">TOTAL MEMBERS</span>
              <TeamOutlined className="text-lg text-[#3447AA]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">
              {totalMembers.toLocaleString()}
            </p>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
              <span>↑ Verified register</span>
            </p>
          </div>

          {/* Active Members */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">ACTIVE</span>
              <CheckCircleFilled className="text-lg text-green-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-green-600">
              {activeMembers.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">In good standing</p>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">PENDING</span>
              <ClockCircleFilled className="text-lg text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-500">{pendingApps}</p>
            <Link
              href="/admin/applications"
              className="text-[10px] text-[#3447AA] font-bold hover:underline"
            >
              Needs approval →
            </Link>
          </div>

          {/* Incomplete Profiles */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">INCOMPLETE</span>
              <WarningFilled className="text-lg text-orange-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-orange-500">{incompleteProfiles}</p>
            <p className="text-[10px] text-gray-500 font-medium">Missing fields</p>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
              <p className="text-xs text-gray-500">
                Latest member registration requests awaiting administrator action.
              </p>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-[#3447AA] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRightOutlined />
            </Link>
          </div>

          {/* Mobile Applications List (Section 18) & Desktop Table */}
          <div className="block sm:hidden space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-gray-900 text-sm uppercase">{app.name}</h3>
                    <p className="font-mono text-xs text-[#3447AA] font-bold mt-0.5">{app.id}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(app.appliedDate)}</p>
                  </div>
                  <StatusTag status={app.status} />
                </div>

                <Link href="/admin/applications" className="block">
                  <Button
                    type="primary"
                    block
                    className="bg-[#3447AA] font-bold text-xs h-8 rounded-xl"
                  >
                    View Application
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">WhatsApp / Mobile</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#3447AA]">{app.id}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{app.name}</td>
                    <td className="py-3 px-4 text-gray-600">{app.whatsapp}</td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(app.appliedDate)}</td>
                    <td className="py-3 px-4">
                      <StatusTag status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href="/admin/applications">
                        <Button
                          size="small"
                          type="primary"
                          className="bg-[#3447AA] text-xs font-bold rounded-lg"
                        >
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Split: Recent Activity Log + Birthday Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity Log */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Recent Activity Log</h2>
                <p className="text-xs text-gray-500">Audit trail of system and member actions.</p>
              </div>
              <Link
                href="/admin/activity-logs"
                className="text-xs font-bold text-[#3447AA] hover:underline"
              >
                All Logs →
              </Link>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 text-xs border border-gray-100"
                >
                  <HistoryOutlined className="text-base text-[#3447AA] mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{log.action}</span>
                      <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">{log.details || log.memberId || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Birthday Widget */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#FBEAEB] to-pink-50 rounded-3xl p-6 border border-pink-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white text-pink-600 flex items-center justify-center text-xl shadow-xs">
                <GiftOutlined />
              </div>
              <h3 className="text-base font-black text-gray-900">Member Birthdays</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Check upcoming member birthdays to send fraternal congratulations.
              </p>
            </div>

            <Link href="/admin/birthdays" className="block">
              <Button
                type="primary"
                block
                className="bg-[#3447AA] font-bold text-xs h-10 rounded-xl"
              >
                Open Birthday Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
