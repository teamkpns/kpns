'use client';

import React, { useState } from 'react';
import { Input, Select, Button, Table, Tag, Empty } from 'antd';
import {
  SearchOutlined,
  HistoryOutlined,
  UserOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { usePortal } from '@/context/portal-context';

const { Option } = Select;

export default function AdminActivityLogsPage() {
  const { activityLogs } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesRole = roleFilter === 'ALL' || log.role.toUpperCase() === roleFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      log.action.toLowerCase().includes(term) ||
      log.user.toLowerCase().includes(term) ||
      (log.memberId && log.memberId.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term));

    return matchesRole && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
              Audit & Governance
            </span>
            <h1 className="text-2xl font-black text-gray-900">Activity Log</h1>
            <p className="text-xs text-gray-500">
              Immutable timestamped audit trail of administrative approvals, profile updates, and logins.
            </p>
          </div>
        </div>

        {/* Filters (Specification Section 24) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search by User, Action, Member ID, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                size="large"
                className="rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="sm:col-span-4">
              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                size="large"
                className="w-full rounded-xl"
              >
                <Option value="ALL">All Roles (Admin & Member)</Option>
                <Option value="ADMIN">Admin Actions Only</Option>
                <Option value="MEMBER">Member Self-Updates</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2 sm:p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Empty description="No activity logs matching search" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Target Member ID</th>
                    <th className="py-3.5 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 text-gray-500 font-mono">{log.timestamp}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{log.user}</td>
                      <td className="py-3.5 px-4">
                        <Tag
                          color={log.role.toUpperCase() === 'ADMIN' ? 'blue' : 'default'}
                          className="font-bold uppercase text-[10px] rounded-md"
                        >
                          {log.role}
                        </Tag>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">{log.action}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3447AA]">
                        {log.memberId || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
