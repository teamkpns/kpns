'use client';

import React, { useState } from 'react';
import {
  Input,
  Radio,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Divider,
  Tag,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatusTag } from '@/components/common/StatusTag';
import { AadhaarMask } from '@/components/common/AadhaarMask';
import { usePortal } from '@/context/portal-context';
import { Application } from '@/types';
import { formatDate, generateSuggestedMemberId } from '@/lib/utils';
import dayjs from 'dayjs';

const { Option } = Select;

export default function AdminApplicationsPage() {
  const { applications, approveApplication, rejectApplication } = usePortal();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalForm] = Form.useForm();
  const [processing, setProcessing] = useState(false);

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesStatus = filterStatus === 'ALL' ? true : app.status === filterStatus;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      app.name.toLowerCase().includes(term) ||
      app.id.toLowerCase().includes(term) ||
      app.whatsapp.includes(term) ||
      app.email.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const handleOpenApprove = (app: Application) => {
    setSelectedApp(app);
    const fromNoSuggestion = String(75 + applications.indexOf(app) + 1);
    const { memberId, userId } = generateSuggestedMemberId(fromNoSuggestion, app.name);

    approvalForm.setFieldsValue({
      fromNo: fromNoSuggestion,
      memberId: memberId,
      admissionDate: dayjs(),
      userId: userId,
      initialPassword: 'kpns@' + new Date().getFullYear(),
      status: 'ACTIVE',
    });

    setApproveModalOpen(true);
  };

  const handleOpenReject = (app: Application) => {
    setSelectedApp(app);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    try {
      const values = await approvalForm.validateFields();
      if (!selectedApp) return;

      setProcessing(true);
      await approveApplication(selectedApp.id, {
        fromNo: values.fromNo,
        memberId: values.memberId,
        admissionDate: values.admissionDate.format('YYYY-MM-DD'),
        userId: values.userId,
        initialPassword: values.initialPassword,
        status: values.status,
      });

      setProcessing(false);
      setApproveModalOpen(false);
      setViewModalOpen(false);
      message.success(`Application ${selectedApp.id} approved and added to Members table!`);
    } catch {
      setProcessing(false);
      message.error('Please verify all required approval fields.');
    }
  };

  const handleConfirmReject = () => {
    if (!selectedApp) return;
    if (!rejectionReason.trim()) {
      message.warning('Please enter a reason for rejection.');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      rejectApplication(selectedApp.id, rejectionReason);
      setProcessing(false);
      setRejectModalOpen(false);
      setViewModalOpen(false);
      message.success(`Application ${selectedApp.id} marked as rejected.`);
    }, 400);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Member Enrollment Verification
          </span>
          <h1 className="text-2xl font-black text-gray-900">Membership Applications</h1>
          <p className="text-xs text-gray-500">
            Review submitted online registration forms, verify credentials, and approve official
            IDs.
          </p>
        </div>

        {/* Filter Bar & Search (Specification Section 18) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Status Radio Filter */}
            <Radio.Group
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              buttonStyle="solid"
              className="flex flex-wrap"
            >
              <Radio.Button value="ALL" className="text-xs font-bold">
                ALL ({applications.length})
              </Radio.Button>
              <Radio.Button value="PENDING" className="text-xs font-bold">
                PENDING ({applications.filter((a) => a.status === 'PENDING').length})
              </Radio.Button>
              <Radio.Button value="APPROVED" className="text-xs font-bold">
                APPROVED ({applications.filter((a) => a.status === 'APPROVED').length})
              </Radio.Button>
              <Radio.Button value="REJECTED" className="text-xs font-bold">
                REJECTED ({applications.filter((a) => a.status === 'REJECTED').length})
              </Radio.Button>
            </Radio.Group>

            {/* Search Input */}
            <div className="w-full sm:w-72">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search application..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <Empty description="No applications found matching criteria" />
          </div>
        ) : (
          <>
            {/* Mobile Cards (Specification Section 18) */}
            <div className="block lg:hidden space-y-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 text-base uppercase">{app.name}</h3>
                      <p className="font-mono text-xs text-[#3447AA] font-bold mt-0.5">{app.id}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(app.appliedDate)}</p>
                    </div>
                    <StatusTag status={app.status} />
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-xl">
                    <p>
                      <strong>Mobile:</strong> {app.whatsapp}
                    </p>
                    <p>
                      <strong>Blood Group:</strong> {app.bloodGroup} | <strong>Village:</strong>{' '}
                      {app.villageTown}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      block
                      onClick={() => {
                        setSelectedApp(app);
                        setViewModalOpen(true);
                      }}
                      className="rounded-xl font-bold text-xs h-9"
                    >
                      View Application
                    </Button>
                    {app.status === 'PENDING' && (
                      <Button
                        type="primary"
                        block
                        onClick={() => handleOpenApprove(app)}
                        className="bg-[#3447AA] rounded-xl font-bold text-xs h-9"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">App ID</th>
                    <th className="py-3.5 px-4">Applicant Name</th>
                    <th className="py-3.5 px-4">Father Name</th>
                    <th className="py-3.5 px-4">WhatsApp / Mobile</th>
                    <th className="py-3.5 px-4">Blood</th>
                    <th className="py-3.5 px-4">Village</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3447AA]">{app.id}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{app.name}</td>
                      <td className="py-3.5 px-4 text-gray-600">{app.fatherName}</td>
                      <td className="py-3.5 px-4 text-gray-600">{app.whatsapp}</td>
                      <td className="py-3.5 px-4 font-bold text-red-600">{app.bloodGroup}</td>
                      <td className="py-3.5 px-4 text-gray-600">{app.villageTown}</td>
                      <td className="py-3.5 px-4 text-gray-500">{formatDate(app.appliedDate)}</td>
                      <td className="py-3.5 px-4">
                        <StatusTag status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setSelectedApp(app);
                            setViewModalOpen(true);
                          }}
                          className="rounded-lg text-xs"
                        >
                          View
                        </Button>
                        {app.status === 'PENDING' && (
                          <>
                            <Button
                              size="small"
                              type="primary"
                              icon={<CheckOutlined />}
                              onClick={() => handleOpenApprove(app)}
                              className="bg-[#3447AA] rounded-lg text-xs font-bold"
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => handleOpenReject(app)}
                              className="rounded-lg text-xs"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 1. VIEW APPLICATION MODAL */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#3447AA]">
                {selectedApp?.id}
              </span>
              <span>— Application Details</span>
            </div>
          }
          open={viewModalOpen}
          onCancel={() => setViewModalOpen(false)}
          width={650}
          footer={[
            selectedApp?.status === 'PENDING' && (
              <Button
                key="reject"
                danger
                onClick={() => {
                  setViewModalOpen(false);
                  if (selectedApp) handleOpenReject(selectedApp);
                }}
              >
                Reject Application
              </Button>
            ),
            selectedApp?.status === 'PENDING' && (
              <Button
                key="approve"
                type="primary"
                className="bg-[#3447AA]"
                onClick={() => {
                  setViewModalOpen(false);
                  if (selectedApp) handleOpenApprove(selectedApp);
                }}
              >
                Approve Membership
              </Button>
            ),
            <Button key="close" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedApp && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
                <div>
                  <p className="text-gray-400">Application Status</p>
                  <div className="mt-1">
                    <StatusTag status={selectedApp.status} />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Submission Date</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">
                    {formatDate(selectedApp.appliedDate)}
                  </p>
                </div>
              </div>

              {/* Personal Section */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-[#3447AA] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <UserOutlined /> Personal Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400">Applicant Name:</span>
                    <p className="font-bold text-gray-900">{selectedApp.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Father's Name:</span>
                    <p className="font-bold text-gray-900">{selectedApp.fatherName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">WhatsApp Number:</span>
                    <p className="font-bold text-gray-900">{selectedApp.whatsapp}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Alternative Mobile:</span>
                    <p className="font-bold text-gray-900">{selectedApp.altMobile || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email ID:</span>
                    <p className="font-bold text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Blood Group:</span>
                    <p className="font-bold text-red-600">{selectedApp.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date of Birth:</span>
                    <p className="font-bold text-gray-900">{formatDate(selectedApp.dob)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Aadhaar Security:</span>
                    <div>
                      <AadhaarMask aadhaar={selectedApp.aadhaar} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-[#3447AA] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <HomeOutlined /> Address Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400">House No:</span>
                    <p className="font-bold text-gray-900">{selectedApp.houseNumber || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Village/Town:</span>
                    <p className="font-bold text-gray-900">{selectedApp.villageTown}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Post Office:</span>
                    <p className="font-bold text-gray-900">{selectedApp.postOffice || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Police Station:</span>
                    <p className="font-bold text-gray-900">{selectedApp.policeStation || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">City / Block:</span>
                    <p className="font-bold text-gray-900">{selectedApp.city || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">District:</span>
                    <p className="font-bold text-[#3447AA]">{selectedApp.district || 'Purba Medinipur'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">State & Country:</span>
                    <p className="font-bold text-gray-900">
                      {selectedApp.state || 'West Bengal'}, {selectedApp.country || 'India'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Pincode:</span>
                    <p className="font-bold text-gray-900">{selectedApp.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* 2. APPROVE MEMBERSHIP MODAL (Specification Section 19) */}
        <Modal
          title={
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#3447AA] uppercase tracking-wider">
                Official Admission Process
              </span>
              <h3 className="text-lg font-black text-gray-900">APPROVE MEMBERSHIP</h3>
            </div>
          }
          open={approveModalOpen}
          onCancel={() => setApproveModalOpen(false)}
          confirmLoading={processing}
          onOk={handleConfirmApprove}
          okText="APPROVE MEMBER"
          okButtonProps={{ className: 'bg-[#3447AA] font-bold h-10 px-6 rounded-xl' }}
          cancelButtonProps={{ className: 'rounded-xl h-10' }}
          width={540}
        >
          {selectedApp && (
            <div className="py-2 space-y-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-xs text-[#3447AA] font-medium">
                Applicant: <strong>{selectedApp.name}</strong> ({selectedApp.whatsapp})
              </div>

              <Form form={approvalForm} layout="vertical" className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">From No. *</span>}
                    name="fromNo"
                    rules={[{ required: true, message: 'Please enter From No' }]}
                  >
                    <Input placeholder="e.g. 76" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Member ID *</span>}
                    name="memberId"
                    rules={[{ required: true, message: 'Please enter Member ID' }]}
                  >
                    <Input placeholder="e.g. KPNS76DJ26" size="large" className="rounded-xl" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Form.Item
                    label={
                      <span className="text-xs font-bold text-gray-700">Date of Admission *</span>
                    }
                    name="admissionDate"
                    rules={[{ required: true, message: 'Select admission date' }]}
                  >
                    <DatePicker
                      className="w-full rounded-xl"
                      size="large"
                      format="DD-MM-YYYY"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">User ID *</span>}
                    name="userId"
                    rules={[{ required: true, message: 'Please enter User ID' }]}
                  >
                    <Input placeholder="e.g. DEBASISH76" size="large" className="rounded-xl" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Form.Item
                    label={
                      <span className="text-xs font-bold text-gray-700">Initial Password *</span>
                    }
                    name="initialPassword"
                    rules={[{ required: true, message: 'Set initial password' }]}
                  >
                    <Input.Password size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Membership Status</span>}
                    name="status"
                    initialValue="ACTIVE"
                  >
                    <Select size="large" className="rounded-xl">
                      <Option value="ACTIVE">ACTIVE</Option>
                      <Option value="PENDING">PENDING</Option>
                      <Option value="INACTIVE">INACTIVE</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Form>
            </div>
          )}
        </Modal>

        {/* 3. REJECT APPLICATION MODAL */}
        <Modal
          title="Reject Application"
          open={rejectModalOpen}
          onCancel={() => setRejectModalOpen(false)}
          onOk={handleConfirmReject}
          okText="Confirm Rejection"
          okButtonProps={{ danger: true, className: 'font-bold h-10 px-6 rounded-xl' }}
          cancelButtonProps={{ className: 'rounded-xl h-10' }}
        >
          <div className="py-2 space-y-3">
            <p className="text-xs text-gray-600">
              Please enter the official reason for rejecting the application of{' '}
              <strong>{selectedApp?.name}</strong>:
            </p>
            <Input.TextArea
              rows={3}
              placeholder="e.g. Incomplete address or outside jurisdiction"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
