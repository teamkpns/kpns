'use client';

import React, { useState } from 'react';
import { Button, Modal, message, Progress, Tag } from 'antd';
import {
  TeamOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  GiftOutlined,
  HeartFilled,
  EnvironmentOutlined,
  CalendarOutlined,
  WarningFilled,
  DownloadOutlined,
  PrinterOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { usePortal } from '@/context/portal-context';
import { formatDate } from '@/lib/utils';

export default function AdminReportsPage() {
  const { members, applications } = usePortal();
  const [activeReportModal, setActiveReportModal] = useState<string | null>(null);

  // Aggregations
  const totalCount = members.length;
  const activeCount = members.filter((m) => m.status === 'ACTIVE').length;
  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const incompleteCount = members.filter((m) => m.profileCompletion < 80).length;

  // Blood group breakdown
  const bloodGroupsCount: Record<string, number> = {};
  members.forEach((m) => {
    bloodGroupsCount[m.bloodGroup] = (bloodGroupsCount[m.bloodGroup] || 0) + 1;
  });

  // Location breakdown
  const villageCount: Record<string, number> = {};
  members.forEach((m) => {
    const v = m.villageTown || 'Other';
    villageCount[v] = (villageCount[v] || 0) + 1;
  });

  const reportsList = [
    {
      id: 'all-members',
      title: 'Member Master Report',
      description: 'Complete roster of all registered sangha members.',
      icon: <TeamOutlined className="text-[#3447AA]" />,
      count: totalCount,
      tag: 'Full Register',
    },
    {
      id: 'active-members',
      title: 'Active Members List',
      description: 'Members with verified active status in good standing.',
      icon: <CheckCircleFilled className="text-green-500" />,
      count: activeCount,
      tag: 'Verified',
    },
    {
      id: 'pending-apps',
      title: 'Pending Applications',
      description: 'Online membership applications awaiting committee review.',
      icon: <ClockCircleFilled className="text-amber-500" />,
      count: pendingCount,
      tag: 'Action Req',
    },
    {
      id: 'birthdays',
      title: 'Birthday Calendar Report',
      description: 'Categorized monthly member birthdays for community wishes.',
      icon: <GiftOutlined className="text-pink-500" />,
      count: members.length,
      tag: 'Celebrations',
    },
    {
      id: 'blood-groups',
      title: 'Blood Group Directory',
      description: 'Emergency donor directory sorted by rare blood groups.',
      icon: <HeartFilled className="text-red-500" />,
      count: Object.keys(bloodGroupsCount).length + ' Groups',
      tag: 'Emergency',
    },
    {
      id: 'locations',
      title: 'Location & Village Report',
      description: 'Geographical distribution of members across Purba Medinipur.',
      icon: <EnvironmentOutlined className="text-indigo-500" />,
      count: Object.keys(villageCount).length + ' Villages',
      tag: 'Demographics',
    },
    {
      id: 'admissions',
      title: 'Admission Year Analytics',
      description: 'Historical registration timeline of members by year.',
      icon: <CalendarOutlined className="text-purple-500" />,
      count: '2020 - 2026',
      tag: 'History',
    },
    {
      id: 'incomplete',
      title: 'Incomplete Profiles',
      description: 'Members with pending contact, address, or Aadhaar fields.',
      icon: <WarningFilled className="text-orange-500" />,
      count: incompleteCount,
      tag: 'Needs Update',
    },
  ];

  const handleExportCSV = (reportName: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Member ID,Name,Father Name,Mobile,Email,Blood Group,Village,Status\n';
    members.forEach((m) => {
      csvContent += `"${m.memberId}","${m.name}","${m.fatherName}","${m.whatsapp}","${m.email}","${m.bloodGroup}","${m.villageTown}","${m.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(`Exported ${reportName} to CSV!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
              Statistical Insights
            </span>
            <h1 className="text-2xl font-black text-gray-900">Reports & Analytics</h1>
            <p className="text-xs text-gray-500">
              Generate, print, and export member statistics and data registries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              className="rounded-xl font-semibold text-xs h-9"
            >
              Print Report
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleExportCSV('KPNS_Master_Report')}
              className="bg-[#3447AA] font-bold text-xs h-9 rounded-xl shadow-xs"
            >
              Export All CSV
            </Button>
          </div>
        </div>

        {/* 8 Report Cards (Specification Section 23) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportsList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-xl shadow-2xs">
                    {item.icon}
                  </div>
                  <Tag className="rounded-full text-[10px] font-bold px-2 py-0.5 uppercase">
                    {item.tag}
                  </Tag>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-1">
                  <span className="text-xl font-black text-gray-900">{item.count}</span>
                </div>
              </div>

              {/* Action buttons (Specification Section 23: View | Print | Export) */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-1 text-xs">
                <button
                  onClick={() => setActiveReportModal(item.id)}
                  className="text-[#3447AA] font-bold hover:underline py-1 px-1.5"
                >
                  View
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={handlePrint}
                  className="text-gray-600 font-semibold hover:text-gray-900 py-1 px-1.5"
                >
                  Print
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => handleExportCSV(item.id)}
                  className="text-gray-600 font-semibold hover:text-gray-900 py-1 px-1.5"
                >
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Report View Modal */}
        <Modal
          title={
            <span className="font-bold text-gray-900">
              Report Viewer — {reportsList.find((r) => r.id === activeReportModal)?.title}
            </span>
          }
          open={!!activeReportModal}
          onCancel={() => setActiveReportModal(null)}
          width={750}
          footer={[
            <Button
              key="export"
              icon={<DownloadOutlined />}
              onClick={() => handleExportCSV(activeReportModal || 'Report')}
            >
              Export CSV
            </Button>,
            <Button
              key="print"
              icon={<PrinterOutlined />}
              type="primary"
              className="bg-[#3447AA]"
              onClick={handlePrint}
            >
              Print
            </Button>,
            <Button key="close" onClick={() => setActiveReportModal(null)}>
              Close
            </Button>,
          ]}
        >
          <div className="py-3 max-h-96 overflow-y-auto space-y-4 text-xs">
            {activeReportModal === 'blood-groups' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium">
                  Summary breakdown of registered blood donors:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((bg) => (
                    <div key={bg} className="bg-red-50 p-3 rounded-2xl border border-red-100 text-center">
                      <span className="text-xs font-bold text-red-600">{bg}</span>
                      <p className="text-lg font-black text-gray-900 mt-1">
                        {members.filter((m) => m.bloodGroup === bg).length}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Member ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Mobile</th>
                    <th className="py-2.5 px-3">Blood</th>
                    <th className="py-2.5 px-3">Village</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td className="py-2 px-3 font-mono font-bold text-[#3447AA]">{m.memberId}</td>
                      <td className="py-2 px-3 font-bold">{m.name}</td>
                      <td className="py-2 px-3">{m.whatsapp}</td>
                      <td className="py-2 px-3 font-bold text-red-600">{m.bloodGroup}</td>
                      <td className="py-2 px-3">{m.villageTown}</td>
                      <td className="py-2 px-3">
                        <Tag color={m.status === 'ACTIVE' ? 'success' : 'default'}>{m.status}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
