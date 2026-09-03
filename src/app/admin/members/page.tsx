'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Input,
  Select,
  Button,
  Modal,
  Form,
  DatePicker,
  message,
  Tabs,
  Avatar,
  Tag,
  Popconfirm,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatusTag } from '@/components/common/StatusTag';
import { AadhaarMask } from '@/components/common/AadhaarMask';
import { usePortal } from '@/context/portal-context';
import { Member } from '@/types';
import { BLOOD_GROUPS, INDIAN_STATES, WEST_BENGAL_DISTRICTS, KPNS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import dayjs from 'dayjs';

const { Option } = Select;

export default function AdminMembersPage() {
  const { members, updateMemberProfile, addActivityLog } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [bloodFilter, setBloodFilter] = useState<string>('ALL');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [resettingPassword, setResettingPassword] = useState(false);

  // Filters logic
  const filteredMembers = members.filter((m) => {
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesBlood = bloodFilter === 'ALL' || m.bloodGroup === bloodFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      m.name.toLowerCase().includes(term) ||
      m.memberId.toLowerCase().includes(term) ||
      m.userId.toLowerCase().includes(term) ||
      m.whatsapp.includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.villageTown.toLowerCase().includes(term);

    return matchesStatus && matchesBlood && matchesSearch;
  });

  const handleOpenEdit = (member: Member) => {
    setSelectedMember(member);
    editForm.setFieldsValue({
      ...member,
      dob: member.dob ? dayjs(member.dob) : undefined,
      admissionDate: member.admissionDate ? dayjs(member.admissionDate) : undefined,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!selectedMember) return;

      const updated = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : selectedMember.dob,
        admissionDate: values.admissionDate
          ? values.admissionDate.format('YYYY-MM-DD')
          : selectedMember.admissionDate,
      };

      updateMemberProfile(selectedMember.memberId, updated);
      addActivityLog(
        `Updated member ${selectedMember.memberId}`,
        selectedMember.memberId,
        'Admin updated member credentials and profile data'
      );

      message.success(`Member ${selectedMember.memberId} updated successfully.`);
      setEditModalOpen(false);
    } catch {
      message.error('Please verify all required fields.');
    }
  };

  const handlePasswordReset = (member: Member) => {
    setResettingPassword(true);
    setTimeout(() => {
      setResettingPassword(false);
      addActivityLog(
        `Reset password for ${member.memberId}`,
        member.memberId,
        'Sent password reset link'
      );
      message.success(`Temporary login password reset link sent to ${member.email || member.whatsapp}`);
    }, 600);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
              Official Registry
            </span>
            <h1 className="text-2xl font-black text-gray-900">Members Directory</h1>
            <p className="text-xs text-gray-500">
              Complete member database, record updating, status administration, and search.
            </p>
          </div>

          <Link href="/admin/members/import">
            <Button
              type="primary"
              icon={<UploadOutlined />}
              className="bg-[#3447AA] font-bold text-xs h-10 px-5 rounded-xl shadow-xs"
            >
              Import Members (CSV/Excel)
            </Button>
          </Link>
        </div>

        {/* Search & Filter Bar (Specification Section 20) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search by Member ID, Name, Mobile, Email, User ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                size="large"
                className="rounded-xl text-xs sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                size="large"
                className="w-full rounded-xl"
              >
                <Option value="ALL">All Statuses</Option>
                <Option value="ACTIVE">ACTIVE</Option>
                <Option value="INACTIVE">INACTIVE</Option>
                <Option value="PENDING">PENDING</Option>
                <Option value="SUSPENDED">SUSPENDED</Option>
              </Select>
            </div>

            {/* Blood Group Filter */}
            <div className="sm:col-span-3">
              <Select
                value={bloodFilter}
                onChange={setBloodFilter}
                size="large"
                className="w-full rounded-xl"
              >
                <Option value="ALL">All Blood Groups</Option>
                {BLOOD_GROUPS.map((bg) => (
                  <Option key={bg} value={bg}>
                    {bg}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Members List Container */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <Empty description="No members found matching filters" />
          </div>
        ) : (
          <>
            {/* Mobile Member Cards (Specification Section 20) */}
            <div className="block lg:hidden space-y-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 text-base uppercase">
                        {member.name}
                      </h3>
                      <p className="font-mono text-xs text-[#3447AA] font-bold mt-0.5">
                        {member.memberId}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1.5">
                        <PhoneOutlined /> {member.whatsapp}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <StatusTag status={member.status} />
                      <div className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md mt-1">
                        Profile: {member.profileCompletion}%
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl flex items-center justify-between">
                    <span>Blood: <strong className="text-red-600">{member.bloodGroup}</strong></span>
                    <span>Village: <strong>{member.villageTown}</strong></span>
                    <span>From No: <strong>{member.fromNo || '—'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      block
                      onClick={() => {
                        setSelectedMember(member);
                        setViewModalOpen(true);
                      }}
                      className="rounded-xl font-bold text-xs h-9"
                    >
                      View
                    </Button>
                    <Button
                      type="primary"
                      block
                      onClick={() => handleOpenEdit(member)}
                      className="bg-[#3447AA] rounded-xl font-bold text-xs h-9"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Member ID</th>
                    <th className="py-3.5 px-4">Member Name</th>
                    <th className="py-3.5 px-4">From No.</th>
                    <th className="py-3.5 px-4">Mobile / WhatsApp</th>
                    <th className="py-3.5 px-4">Blood</th>
                    <th className="py-3.5 px-4">Village</th>
                    <th className="py-3.5 px-4">Profile %</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3447AA]">
                        {member.memberId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{member.name}</td>
                      <td className="py-3.5 px-4 text-gray-600">{member.fromNo || '—'}</td>
                      <td className="py-3.5 px-4 text-gray-600">{member.whatsapp}</td>
                      <td className="py-3.5 px-4 font-bold text-red-600">{member.bloodGroup}</td>
                      <td className="py-3.5 px-4 text-gray-600">{member.villageTown}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            member.profileCompletion >= 80
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {member.profileCompletion}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusTag status={member.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setSelectedMember(member);
                            setViewModalOpen(true);
                          }}
                          className="rounded-lg text-xs"
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => handleOpenEdit(member)}
                          className="bg-[#3447AA] rounded-lg text-xs font-bold"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 1. VIEW MEMBER DETAILS MODAL (Specification Section 21) */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#3447AA]">
                {selectedMember?.memberId}
              </span>
              <span>— {selectedMember?.name}</span>
            </div>
          }
          open={viewModalOpen}
          onCancel={() => setViewModalOpen(false)}
          width={700}
          footer={[
            <Button
              key="edit"
              type="primary"
              className="bg-[#3447AA]"
              onClick={() => {
                setViewModalOpen(false);
                if (selectedMember) handleOpenEdit(selectedMember);
              }}
            >
              Edit Member Details
            </Button>,
            <Button key="close" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedMember && (
            <div className="space-y-4 py-2 text-xs">
              {/* Membership info */}
              <div className="bg-[#FBEAEB] p-4 rounded-2xl border border-pink-200">
                <h4 className="font-bold text-[#3447AA] uppercase tracking-wider text-[11px] mb-2">
                  Membership Record (Admin Managed)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-gray-500">Member ID:</span>
                    <p className="font-bold text-[#3447AA] text-sm">{selectedMember.memberId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">From No:</span>
                    <p className="font-bold text-gray-800">{selectedMember.fromNo || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Admission Date:</span>
                    <p className="font-bold text-gray-800">{formatDate(selectedMember.admissionDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">User ID:</span>
                    <p className="font-bold text-gray-800">{selectedMember.userId}</p>
                  </div>
                </div>
              </div>

              {/* Personal & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                  <h4 className="font-bold text-gray-800 uppercase text-[11px]">Personal</h4>
                  <p><strong>Father:</strong> {selectedMember.fatherName}</p>
                  <p><strong>WhatsApp:</strong> {selectedMember.whatsapp}</p>
                  <p><strong>Email:</strong> {selectedMember.email}</p>
                  <p><strong>Blood Group:</strong> <span className="text-red-600 font-bold">{selectedMember.bloodGroup}</span></p>
                  <p><strong>DOB:</strong> {formatDate(selectedMember.dob)}</p>
                  <div className="pt-1">
                    <span className="text-gray-400 block mb-1">Aadhaar:</span>
                    <AadhaarMask aadhaar={selectedMember.aadhaar} />
                  </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                  <h4 className="font-bold text-gray-800 uppercase text-[11px]">Address</h4>
                  <p><strong>House:</strong> {selectedMember.houseNumber || '—'}</p>
                  <p><strong>Village/Town:</strong> {selectedMember.villageTown}</p>
                  <p><strong>Post Office:</strong> {selectedMember.postOffice || '—'}</p>
                  <p><strong>Police Station:</strong> {selectedMember.policeStation || '—'}</p>
                  <p><strong>City / Block:</strong> {selectedMember.city || '—'}</p>
                  <p><strong>District:</strong> <span className="text-[#3447AA] font-bold">{selectedMember.district || 'Purba Medinipur'}</span></p>
                  <p><strong>State:</strong> {selectedMember.state || 'West Bengal'}</p>
                  <p><strong>Pincode:</strong> {selectedMember.pincode}</p>
                </div>
              </div>

              {/* Account Controls */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">Account & Security</h4>
                  <p className="text-[11px] text-gray-500">
                    Status: <StatusTag status={selectedMember.status} />
                  </p>
                </div>
                <Button
                  size="small"
                  icon={<KeyOutlined />}
                  onClick={() => handlePasswordReset(selectedMember)}
                  loading={resettingPassword}
                  className="rounded-xl text-xs font-bold text-[#3447AA] border-[#3447AA]"
                >
                  Send Password Reset
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* 2. EDIT MEMBER MODAL */}
        <Modal
          title={
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#3447AA] uppercase">Full Control</span>
              <h3 className="text-lg font-black text-gray-900">
                Edit Member — {selectedMember?.name}
              </h3>
            </div>
          }
          open={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          onOk={handleSaveEdit}
          okText="Save Member Changes"
          okButtonProps={{ className: 'bg-[#3447AA] font-bold h-10 px-6 rounded-xl' }}
          cancelButtonProps={{ className: 'rounded-xl h-10' }}
          width={720}
        >
          {selectedMember && (
            <Form form={editForm} layout="vertical" className="py-2 space-y-4 text-xs">
              <div className="bg-[#FBEAEB] p-4 rounded-2xl border border-pink-200">
                <h4 className="font-bold text-[#3447AA] uppercase text-[11px] mb-2">
                  Membership Record (Admin Overrides)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Form.Item label="Member ID *" name="memberId" rules={[{ required: true }]}>
                    <Input className="rounded-xl" />
                  </Form.Item>
                  <Form.Item label="From No. *" name="fromNo">
                    <Input className="rounded-xl" />
                  </Form.Item>
                  <Form.Item label="User ID *" name="userId" rules={[{ required: true }]}>
                    <Input className="rounded-xl" />
                  </Form.Item>
                  <Form.Item label="Status" name="status">
                    <Select className="rounded-xl">
                      <Option value="ACTIVE">ACTIVE</Option>
                      <Option value="INACTIVE">INACTIVE</Option>
                      <Option value="PENDING">PENDING</Option>
                      <Option value="SUSPENDED">SUSPENDED</Option>
                      <Option value="RESIGNED">RESIGNED</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Form.Item label="Member Name *" name="name" rules={[{ required: true }]}>
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="Father's Name *" name="fatherName" rules={[{ required: true }]}>
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="WhatsApp Number *" name="whatsapp" rules={[{ required: true }]}>
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="Email ID *" name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="Blood Group *" name="bloodGroup" rules={[{ required: true }]}>
                  <Select className="rounded-xl">
                    {BLOOD_GROUPS.map((bg) => (
                      <Option key={bg} value={bg}>
                        {bg}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Aadhaar" name="aadhaar">
                  <Input className="rounded-xl" maxLength={12} />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Form.Item label="Village / Town *" name="villageTown" rules={[{ required: true }]}>
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="Post Office" name="postOffice">
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="Police Station" name="policeStation">
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="City / Block" name="city">
                  <Input className="rounded-xl" />
                </Form.Item>
                <Form.Item label="District *" name="district" rules={[{ required: true }]}>
                  <Select
                    showSearch
                    className="rounded-xl"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={WEST_BENGAL_DISTRICTS.map((d) => ({ label: d, value: d }))}
                  />
                </Form.Item>
                <Form.Item label="State *" name="state" rules={[{ required: true }]}>
                  <Select
                    showSearch
                    className="rounded-xl"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={INDIAN_STATES.map((s) => ({ label: s, value: s }))}
                  />
                </Form.Item>
                <Form.Item label="Pincode *" name="pincode" rules={[{ required: true }]}>
                  <Input className="rounded-xl" maxLength={6} />
                </Form.Item>
              </div>
            </Form>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
