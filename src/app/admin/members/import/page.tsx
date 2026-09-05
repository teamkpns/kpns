'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Upload, Table, Alert, message, Tag, Steps, Card } from 'antd';
import {
  UploadOutlined,
  FileExcelOutlined,
  CheckCircleFilled,
  WarningFilled,
  ArrowLeftOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { usePortal } from '@/context/portal-context';
import { Member } from '@/types';
import { calculateProfileCompletion } from '@/lib/utils';

export default function MemberImportPage() {
  const router = useRouter();
  const { importMembersList } = usePortal();
  const [fileList, setFileList] = useState<any[]>([]);
  const [parsedData, setParsedData] = useState<Partial<Member>[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ added: number; duplicates: number } | null>(null);

  // Sample import data template
  const loadSampleCSV = () => {
    const sample: Partial<Member>[] = [
      {
        name: 'Ashok Kumar Bhowmik',
        fatherName: 'Late Bipin Bhowmik',
        whatsapp: '9832887766',
        email: 'ashok.bhowmik@example.com',
        bloodGroup: 'B+',
        villageTown: 'Khejurda',
        postOffice: 'Khejurda',
        status: 'ACTIVE',
        fromNo: '101',
      },
      {
        name: 'Sunita Mandal',
        fatherName: 'Gouranga Mandal',
        whatsapp: '9832998877',
        email: '',
        bloodGroup: 'O+',
        villageTown: 'Kamarda',
        postOffice: 'Kamarda',
        status: 'ACTIVE',
        fromNo: '102',
      },
      {
        name: 'Subrata Pramanik',
        fatherName: 'Nabin Pramanik',
        whatsapp: '9876543210', // duplicate of Pintu to test duplicate detection!
        email: 'pintu.patra@example.com',
        bloodGroup: 'A+',
        villageTown: 'Khejurda',
        status: 'ACTIVE',
        fromNo: '103',
      },
      {
        name: 'Dipak Samanta',
        fatherName: 'Haripada Samanta',
        whatsapp: '9434771122',
        email: 'dipak.samanta@example.com',
        bloodGroup: 'AB+',
        villageTown: 'Bhograi',
        status: 'ACTIVE',
        fromNo: '104',
      },
    ];

    setParsedData(sample);
    message.success('Loaded 4 sample member rows for preview.');
  };

  const handleExecuteImport = () => {
    if (parsedData.length === 0) {
      message.warning('Please load or upload member data first.');
      return;
    }

    setImporting(true);
    setTimeout(() => {
      const res = importMembersList(parsedData);
      setResult(res);
      setImporting(false);
      message.success(`Successfully imported ${res.added} members!`);
    }, 700);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
              Batch Data Migration
            </span>
            <h1 className="text-2xl font-black text-gray-900">Import Existing Members</h1>
            <p className="text-xs text-gray-500">
              Bulk import legacy members from CSV or Excel spreadsheets with duplicate checking.
            </p>
          </div>

          <Link href="/admin/members">
            <Button icon={<ArrowLeftOutlined />} className="rounded-xl font-semibold text-xs h-9">
              Back to Members
            </Button>
          </Link>
        </div>

        {/* Upload & Actions Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-gray-200 hover:border-[#3447AA] rounded-2xl p-6 text-center space-y-3 transition bg-gray-50/50">
              <FileExcelOutlined className="text-4xl text-[#3447AA]" />
              <div>
                <p className="text-sm font-bold text-gray-800">Upload CSV or Excel File</p>
                <p className="text-xs text-gray-500">Drag & drop or click to select spreadsheet</p>
              </div>

              <div className="flex justify-center gap-2 pt-2">
                <Button
                  icon={<UploadOutlined />}
                  onClick={loadSampleCSV}
                  className="rounded-xl text-xs font-bold bg-white text-[#3447AA] border-[#3447AA]"
                >
                  Load Sample CSV Template
                </Button>
              </div>
            </div>

            {/* Rules & Guidelines Box (Specification Section 31 & 32) */}
            <div className="bg-[#FBEAEB] p-5 rounded-2xl border border-pink-200 space-y-2 text-xs text-gray-700">
              <h4 className="font-bold text-[#3447AA] uppercase text-[11px]">
                Import Rules & Protection
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-gray-600">
                <li>
                  <strong>Blank fields allowed:</strong> Legacy members can have missing fields.
                </li>
                <li>
                  <strong>Profile Score:</strong> Automatically computed upon import.
                </li>
                <li>
                  <strong>Duplicate Protection:</strong> Automatically flags duplicate WhatsApp
                  numbers, emails, or Member IDs.
                </li>
                <li>
                  <strong>User ID Generation:</strong> Automatically assigned from From No. and
                  Name.
                </li>
              </ul>
            </div>
          </div>

          {/* Import Result Alert */}
          {result && (
            <Alert
              message="Import Completed"
              description={`Successfully added ${result.added} new members. Skipped ${result.duplicates} duplicate records.`}
              type="success"
              showIcon
              className="rounded-2xl"
            />
          )}

          {/* Data Preview Table (Specification Section 31) */}
          {parsedData.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Import Preview ({parsedData.length} Records)
                </h3>
                <Button
                  type="primary"
                  loading={importing}
                  onClick={handleExecuteImport}
                  className="bg-[#3447AA] font-bold text-xs h-9 px-6 rounded-xl shadow-xs"
                >
                  Confirm & Import ({parsedData.length})
                </Button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Mobile</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Blood</th>
                      <th className="py-3 px-4">Village</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Profile Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {parsedData.map((item, index) => {
                      const { score } = calculateProfileCompletion(item);
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="py-3 px-4 font-bold text-gray-900">{item.name}</td>
                          <td className="py-3 px-4 text-gray-600">{item.whatsapp || '—'}</td>
                          <td className="py-3 px-4 text-gray-600">{item.email || '—'}</td>
                          <td className="py-3 px-4 font-bold text-red-600">{item.bloodGroup}</td>
                          <td className="py-3 px-4 text-gray-600">{item.villageTown}</td>
                          <td className="py-3 px-4">
                            <Tag color="success" className="font-bold rounded-md uppercase">
                              {item.status || 'ACTIVE'}
                            </Tag>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-xs text-[#3447AA] bg-blue-50 px-2 py-0.5 rounded">
                              {score}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
