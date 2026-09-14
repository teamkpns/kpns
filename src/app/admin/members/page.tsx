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
  CrownOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CameraOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatusTag } from '@/components/common/StatusTag';
import { AadhaarMask } from '@/components/common/AadhaarMask';
import { usePortal } from '@/context/portal-context';
import { Member, PhotoApprovalRequest } from '@/types';
import { BLOOD_GROUPS, INDIAN_STATES, WEST_BENGAL_DISTRICTS, KPNS_COLORS, COMMITTEE_ROLES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import dayjs from 'dayjs';

const { Option } = Select;

export default function AdminMembersPage() {
  const {
    members,
    updateMemberProfile,
    deleteMember,
    addActivityLog,
    assignCommitteeRole,
    refreshData,
    photoRequests,
    approvePhotoRequest,
    rejectPhotoRequest,
  } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [bloodFilter, setBloodFilter] = useState<string>('ALL');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [pendingVision, setPendingVision] = useState<string>('');
  const [editForm] = Form.useForm();
  const [resettingPassword, setResettingPassword] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [approvingPhotoId, setApprovingPhotoId] = useState<string | null>(null);
  const [rejectingPhotoId, setRejectingPhotoId] = useState<string | null>(null);

  const pendingPhotoRequests = photoRequests.filter((r) => r.status === 'PENDING');

  const handleApprovePhoto = async (req: PhotoApprovalRequest) => {
    setApprovingPhotoId(req.id);
    try {
      await approvePhotoRequest(req.id, req.memberId, req.photoUrl);
    } finally {
      setApprovingPhotoId(null);
    }
  };

  const handleRejectPhoto = async (req: PhotoApprovalRequest, reason?: string) => {
    setRejectingPhotoId(req.id);
    try {
      await rejectPhotoRequest(req.id, req.memberId, reason);
    } finally {
      setRejectingPhotoId(null);
    }
  };

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

  const handleOpenRoleModal = (member: Member) => {
    setSelectedMember(member);
    setPendingRole(member.committeeRole ?? null);
    setPendingVision(member.committeeVision ?? '');
    setRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedMember) return;
    assignCommitteeRole(selectedMember.memberId, pendingRole);
    // Also save the vision text
    updateMemberProfile(selectedMember.memberId, {
      committeeVision: pendingVision.trim() || undefined,
    });
    if (pendingRole) {
      message.success(`${selectedMember.name} assigned as ${pendingRole} in Managing Committee.`);
    } else {
      message.success(`${selectedMember.name} reverted to normal Member.`);
    }
    setRoleModalOpen(false);
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

          <div className="flex items-center gap-2">
            <Button
              icon={<ReloadOutlined spin={syncing} />}
              onClick={async () => {
                setSyncing(true);
                await refreshData();
                setSyncing(false);
                message.success('Refreshed member list from database!');
              }}
              className="rounded-xl text-xs h-10 border-gray-300 font-semibold"
            >
              Refresh Data
            </Button>
            <Link href="/admin/members/import">
              <Button
                type="primary"
                icon={<UploadOutlined />}
                className="bg-[#3447AA] font-bold text-xs h-10 px-5 rounded-xl shadow-xs"
              >
                Import Members
              </Button>
            </Link>
          </div>
        </div>

        {/* Pending Photo Approvals Card */}
        {pendingPhotoRequests.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                  <CameraOutlined />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-gray-900 leading-tight">
                      Member Profile Photo Approvals
                    </h2>
                    <Tag color="gold" className="font-extrabold text-xs px-2 py-0.5 rounded-full">
                      {pendingPhotoRequests.length} PENDING
                    </Tag>
                  </div>
                  <p className="text-xs text-gray-600">
                    Review and verify member submitted profile photos before they go live across the portal and Team KPNS page.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPhotoRequests.map((req) => {
                const member = members.find((m) => m.memberId === req.memberId);
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                        <div>
                          <p className="font-black text-gray-900 text-sm">{req.memberName}</p>
                          <p className="font-mono text-xs font-bold text-[#3447AA]">{req.memberId}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {req.requestedAt ? dayjs(req.requestedAt).format('DD MMM, hh:mm A') : 'Recent'}
                        </span>
                      </div>

                      {/* Photo Comparison: Current vs New */}
                      <div className="flex items-center justify-around bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current</p>
                          <Avatar
                            size={56}
                            src={req.currentPhotoUrl || member?.avatarUrl}
                            icon={<UserOutlined />}
                            className="border border-gray-200"
                          />
                        </div>

                        <div className="text-gray-300 font-black text-base">➔</div>

                        <div className="text-center">
                          <p className="text-[10px] font-extrabold text-amber-700 uppercase mb-1">
                            New Crop
                          </p>
                          <Avatar
                            size={56}
                            src={req.photoUrl}
                            icon={<UserOutlined />}
                            className="border-2 border-green-500 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        loading={approvingPhotoId === req.id}
                        onClick={() => handleApprovePhoto(req)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl h-9 shadow-xs"
                      >
                        Approve
                      </Button>

                      <Popconfirm
                        title="Reject Photo Request"
                        description="Are you sure you want to reject this photo request?"
                        onConfirm={() => handleRejectPhoto(req, 'Photo does not meet identity guidelines')}
                        okText="Yes, Reject"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true, className: 'bg-red-600 font-bold' }}
                      >
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          loading={rejectingPhotoId === req.id}
                          className="font-bold text-xs rounded-xl h-9"
                        >
                          Reject
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={44}
                        src={member.avatarUrl}
                        icon={<UserOutlined />}
                        className="bg-[#3447AA] text-white shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-black text-gray-900 text-sm sm:text-base">
                            {member.name}
                          </h3>
                          {member.pendingAvatarUrl && (
                            <Tag color="orange" className="text-[9px] font-bold px-1.5 py-0">
                              Photo Pending
                            </Tag>
                          )}
                        </div>
                        <p className="font-mono text-xs text-[#3447AA] font-bold mt-0.5">
                          {member.memberId}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
                          <PhoneOutlined /> {member.whatsapp}
                        </p>
                      </div>
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

                  {/* Committee Role indicator on Mobile */}
                  {member.committeeRole && (
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs text-amber-800 font-semibold">
                      <CrownOutlined className="text-amber-600" />
                      <span>Role: <strong>{member.committeeRole}</strong></span>
                    </div>
                  )}

                  {/* Action Buttons: View, Edit, Set Role, Delete */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      icon={<EyeOutlined />}
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
                      icon={<EditOutlined />}
                      onClick={() => handleOpenEdit(member)}
                      className="bg-[#3447AA] rounded-xl font-bold text-xs h-9"
                    >
                      Edit
                    </Button>
                    <Button
                      icon={<CrownOutlined />}
                      onClick={() => handleOpenRoleModal(member)}
                      className={`rounded-xl font-bold text-xs h-9 ${
                        member.committeeRole
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {member.committeeRole ? 'Role: ' + member.committeeRole : 'Set Role'}
                    </Button>
                    <Popconfirm
                      title="Delete Member"
                      description={`Are you sure you want to delete ${member.name} (${member.memberId}) permanently?`}
                      onConfirm={() => deleteMember(member.memberId)}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true, className: 'bg-red-600 font-bold' }}
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        className="rounded-xl font-bold text-xs h-9"
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[1080px]">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4 whitespace-nowrap">Member ID</th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">Member Name</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">From No.</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Mobile / WhatsApp</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Blood</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Village</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Profile %</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap sticky right-0 bg-gray-50 z-10 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)] min-w-[280px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="group hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3447AA] whitespace-nowrap">
                        {member.memberId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            size={32}
                            src={member.avatarUrl}
                            icon={<UserOutlined />}
                            className="bg-[#3447AA] text-white shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-gray-900">
                              <span className="truncate">{member.name}</span>
                              {member.pendingAvatarUrl && (
                                <Tag color="orange" className="text-[9px] font-bold px-1.5 py-0 leading-tight shrink-0">
                                  Photo Pending
                                </Tag>
                              )}
                            </div>
                            {member.fatherName && (
                              <span className="text-[10px] text-gray-400 font-normal block truncate">
                                S/o {member.fatherName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">{member.fromNo || '—'}</td>
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">{member.whatsapp}</td>
                      <td className="py-3.5 px-3 font-bold text-red-600 whitespace-nowrap">{member.bloodGroup}</td>
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">{member.villageTown}</td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
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
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusTag status={member.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-gray-50/80 z-10 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => {
                              setSelectedMember(member);
                              setViewModalOpen(true);
                            }}
                            className="rounded-lg text-xs hover:border-[#3447AA] hover:text-[#3447AA]"
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenEdit(member)}
                            className="bg-[#3447AA] hover:bg-[#283887] rounded-lg text-xs font-bold"
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            icon={<CrownOutlined />}
                            onClick={() => handleOpenRoleModal(member)}
                            className={`rounded-lg text-xs font-bold ${
                              member.committeeRole
                                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {member.committeeRole ? 'Role ✓' : 'Set Role'}
                          </Button>
                          <Popconfirm
                            title="Delete Member"
                            description={`Are you sure you want to delete ${member.name} (${member.memberId}) permanently?`}
                            onConfirm={() => deleteMember(member.memberId)}
                            okText="Yes, Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true, className: 'bg-red-600 font-bold' }}
                          >
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              className="rounded-lg text-xs font-semibold"
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        </div>
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
            <Popconfirm
              key="delete"
              title="Delete Member"
              description={`Are you sure you want to permanently delete ${selectedMember?.name}?`}
              onConfirm={() => {
                if (selectedMember) {
                  deleteMember(selectedMember.memberId);
                  setViewModalOpen(false);
                }
              }}
              okText="Delete Permanently"
              cancelText="Cancel"
              okButtonProps={{ danger: true, className: 'bg-red-600 font-bold' }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete Member
              </Button>
            </Popconfirm>,
            <Button
              key="role"
              icon={<CrownOutlined />}
              className={
                selectedMember?.committeeRole
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold'
                  : 'font-bold'
              }
              onClick={() => {
                if (selectedMember) {
                  handleOpenRoleModal(selectedMember);
                }
              }}
            >
              {selectedMember?.committeeRole ? `Role: ${selectedMember.committeeRole}` : 'Set Role'}
            </Button>,
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
              {/* Profile Avatar & Member Header */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Avatar
                  size={72}
                  src={selectedMember.avatarUrl}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: KPNS_COLORS.primary }}
                  className="shadow-sm border-2 border-white shrink-0 text-2xl font-bold"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-gray-900">{selectedMember.name}</h3>
                    <StatusTag status={selectedMember.status} />
                  </div>
                  <p className="text-xs font-mono font-bold text-[#3447AA] mt-0.5">{selectedMember.memberId}</p>
                  {selectedMember.committeeRole && (
                    <Tag color="gold" className="text-[10px] font-bold mt-1">
                      {selectedMember.committeeRole}
                    </Tag>
                  )}
                </div>
              </div>

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

        {/* 3. COMMITTEE ROLE ASSIGNMENT MODAL */}
        <Modal
          title={
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5">
                <CrownOutlined /> Managing Committee Role
              </span>
              <h3 className="text-base font-black text-gray-900">
                Assign Role — {selectedMember?.name}
              </h3>
              <p className="text-[11px] text-gray-500 font-normal">
                Member ID: {selectedMember?.memberId}
              </p>
            </div>
          }
          open={roleModalOpen}
          onCancel={() => setRoleModalOpen(false)}
          onOk={handleSaveRole}
          okText={pendingRole ? `Assign as ${pendingRole}` : 'Revert to Normal Member'}
          okButtonProps={{
            className: pendingRole
              ? 'bg-amber-500 hover:bg-amber-600 font-bold h-10 px-6 rounded-xl border-0'
              : 'bg-gray-600 hover:bg-gray-700 font-bold h-10 px-6 rounded-xl border-0',
            type: 'primary',
          }}
          cancelButtonProps={{ className: 'rounded-xl h-10' }}
          width={520}
        >
          {selectedMember && (
            <div className="space-y-5 py-3">
              {/* Current status */}
              <div className="bg-[#FBEAEB] p-4 rounded-2xl border border-pink-200 text-xs text-gray-700 space-y-1">
                <p>
                  <strong>Current Committee Role:</strong>{' '}
                  {selectedMember.committeeRole ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                      <CrownOutlined /> {selectedMember.committeeRole}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">No committee role (Normal Member)</span>
                  )}
                </p>
              </div>

              {/* Role selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Select New Committee Role:
                </label>
                <Select
                  value={pendingRole ?? undefined}
                  onChange={(val) => setPendingRole(val)}
                  placeholder="Pick a role..."
                  className="w-full"
                  size="large"
                  allowClear
                  onClear={() => setPendingRole(null)}
                >
                  {COMMITTEE_ROLES.map((r) => (
                    <Option key={r} value={r}>
                      <span className="flex items-center gap-2">
                        <CrownOutlined className="text-amber-500" />
                        {r}
                      </span>
                    </Option>
                  ))}
                </Select>
                <p className="text-[11px] text-gray-400">
                  Clearing the selection will revert this member to a normal member with no committee
                  role.
                </p>
              </div>

              {/* Vision field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Vision / Message for the Club{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <Input.TextArea
                  value={pendingVision}
                  onChange={(e) => setPendingVision(e.target.value)}
                  placeholder={`Enter ${selectedMember?.name?.split(' ')[0] || 'their'}'s vision or message for KPNS…`}
                  rows={3}
                  maxLength={300}
                  showCount
                  className="rounded-xl text-sm"
                />
                <p className="text-[11px] text-gray-400">
                  This message will appear on hover over their card on the Team page and home page.
                </p>
              </div>

              {/* Revert button shortcut */}
              {selectedMember.committeeRole && (
                <button
                  onClick={() => setPendingRole(null)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition text-xs font-bold"
                >
                  <MinusCircleOutlined />
                  Remove Role &amp; Revert to Normal Member
                </button>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
