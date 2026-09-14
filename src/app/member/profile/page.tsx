'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Tabs,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Card,
  Tag,
  Alert,
  Avatar,
} from 'antd';
import {
  IdcardOutlined,
  UserOutlined,
  HomeOutlined,
  SaveOutlined,
  LockOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { StatusTag } from '@/components/common/StatusTag';
import { AadhaarMask } from '@/components/common/AadhaarMask';
import { ImageCropModal } from '@/components/common/ImageCropModal';
import { usePortal } from '@/context/portal-context';
import { BLOOD_GROUPS, INDIAN_STATES, WEST_BENGAL_DISTRICTS, KPNS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import dayjs from 'dayjs';

const { Option } = Select;

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'membership';
  const [activeTab, setActiveTab] = useState(initialTab);
  const {
    currentUser,
    updateMemberProfile,
    photoRequests,
    submitPhotoApprovalRequest,
    cancelPhotoRequest,
  } = usePortal();
  const [saving, setSaving] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [submittingPhoto, setSubmittingPhoto] = useState(false);
  const [personalForm] = Form.useForm();
  const [addressForm] = Form.useForm();

  const user = currentUser || {
    memberId: 'KPNS75PP26',
    fromNo: '75',
    userId: 'PINTU75',
    status: 'ACTIVE' as const,
    admissionDate: '2026-08-15',
    name: 'Pintu Patra',
    fatherName: 'Subhas Patra',
    whatsapp: '9876543210',
    altMobile: '9123456780',
    email: 'pintu.patra@example.com',
    aadhaar: '541278901234',
    bloodGroup: 'O+',
    dob: '1995-09-02',
    houseNumber: 'KP-124',
    villageTown: 'Khejurda',
    postOffice: 'Khejurda',
    policeStation: 'Khejuri',
    city: 'Contai',
    district: 'Purba Medinipur',
    state: 'West Bengal',
    country: 'India',
    pincode: '721401',
    avatarUrl: undefined as string | undefined,
    pendingAvatarUrl: undefined as string | undefined,
    committeeRole: undefined as string | undefined,
  };

  const handleSavePersonal = async () => {
    try {
      const values = await personalForm.validateFields();
      setSaving(true);
      setTimeout(() => {
        updateMemberProfile(user.memberId, {
          ...values,
          dob: values.dob ? values.dob.format('YYYY-MM-DD') : user.dob,
        });
        setSaving(false);
        message.success('✓ Profile updated successfully');
      }, 500);
    } catch {
      message.error('Please verify all required personal fields.');
    }
  };

  const handleSaveAddress = async () => {
    try {
      const values = await addressForm.validateFields();
      setSaving(true);
      setTimeout(() => {
        updateMemberProfile(user.memberId, values);
        setSaving(false);
        message.success('✓ Profile updated successfully');
      }, 500);
    } catch {
      message.error('Please verify address fields.');
    }
  };

  const pendingPhotoRequest = photoRequests.find(
    (r) => (r.memberId === user.memberId || r.memberId === currentUser?.memberId) && r.status === 'PENDING'
  );

  const handleCropComplete = async (croppedDataUrl: string) => {
    setSubmittingPhoto(true);
    try {
      await submitPhotoApprovalRequest(user.memberId, croppedDataUrl);
      setIsCropModalOpen(false);
    } catch {
      message.error('Failed to submit photo. Please try again.');
    } finally {
      setSubmittingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Member Profile Hero / Avatar Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar
              size={84}
              src={user.avatarUrl}
              icon={<UserOutlined />}
              style={{ backgroundColor: KPNS_COLORS.primary }}
              className="border-4 border-pink-100 shadow-md text-3xl font-bold"
            />
            <button
              onClick={() => setIsCropModalOpen(true)}
              className="absolute -bottom-1 -right-1 bg-[#3447AA] hover:bg-[#202E7A] text-white p-2 rounded-full shadow-md border-2 border-white transition flex items-center justify-center cursor-pointer"
              title="Change Profile Photo"
            >
              <CameraOutlined className="text-xs" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {user.name}
              </h1>
              {user.committeeRole && (
                <Tag color="gold" className="font-bold text-[10px] rounded-full uppercase">
                  {user.committeeRole}
                </Tag>
              )}
            </div>
            <p className="text-xs font-mono font-bold text-[#3447AA] mt-0.5">{user.memberId}</p>
            <p className="text-xs text-gray-500 mt-1">
              Member since {formatDate(user.admissionDate)} &bull; {user.villageTown || 'Khejurda'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
          <StatusTag status={user.status} />
          <Button
            type="primary"
            icon={<CameraOutlined />}
            onClick={() => setIsCropModalOpen(true)}
            className="bg-[#3447AA] hover:bg-[#283887] rounded-xl font-bold text-xs h-9 px-4"
          >
            Change Photo
          </Button>
        </div>
      </div>

      {/* Pending Photo Approval Alert Card (if waiting for admin review) */}
      {(pendingPhotoRequest || user.pendingAvatarUrl) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-xl shrink-0 mt-0.5">
                <ClockCircleOutlined />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-900 text-sm">
                    New Profile Picture Pending Admin Approval
                  </span>
                  <Tag color="orange" className="font-bold text-[10px] rounded-md uppercase">
                    Under Review
                  </Tag>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed max-w-2xl">
                  You uploaded a new cropped profile picture on{' '}
                  <strong>{pendingPhotoRequest?.requestedAt ? dayjs(pendingPhotoRequest.requestedAt).format('DD MMM YYYY, hh:mm A') : 'recent request'}</strong>.
                  It is currently awaiting review by KPNS club administrators. Once approved, it will automatically update across your account, member dashboard, and the Team KPNS directory.
                </p>
              </div>
            </div>

            {/* Comparison Preview */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-200/60 self-stretch md:self-auto justify-around">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current</p>
                <Avatar
                  size={42}
                  src={user.avatarUrl}
                  icon={<UserOutlined />}
                  className="border border-gray-200"
                />
              </div>

              <div className="text-gray-300 font-bold text-xs">➔</div>

              <div className="text-center">
                <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Requested</p>
                <Avatar
                  size={42}
                  src={pendingPhotoRequest?.photoUrl || user.pendingAvatarUrl}
                  icon={<UserOutlined />}
                  className="border-2 border-amber-500 shadow-xs"
                />
              </div>

              <div className="pl-2 border-l border-amber-200">
                <Button
                  size="small"
                  onClick={() => setIsCropModalOpen(true)}
                  className="text-[11px] font-bold rounded-lg block w-full mb-1"
                >
                  Re-Crop
                </Button>
                {pendingPhotoRequest && (
                  <Button
                    size="small"
                    danger
                    onClick={() => cancelPhotoRequest(pendingPhotoRequest.id, user.memberId)}
                    className="text-[10px] font-bold rounded-lg block w-full"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'membership',
              label: (
                <span className="flex items-center gap-2 font-bold">
                  <IdcardOutlined />
                  Membership Information
                </span>
              ),
              children: (
                <div className="space-y-6 pt-2">
                  {/* Royal Blue Read-Only Header (Specification Section 12) */}
                  <div className="bg-gradient-to-r from-[#3447AA] to-[#24358F] text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <LockOutlined className="text-pink-200" />
                        <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
                          READ ONLY INFORMATION
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white">Official Membership Record</h2>
                    </div>
                    <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-pink-100 border border-white/20">
                      Managed by Admin
                    </span>
                  </div>

                  {/* Read Only Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Member ID</p>
                      <p className="text-base font-extrabold text-[#3447AA] mt-1">{user.memberId}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">From No.</p>
                      <p className="text-base font-extrabold text-gray-800 mt-1">{user.fromNo || '—'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Date of Admission</p>
                      <p className="text-base font-extrabold text-gray-800 mt-1">
                        {formatDate(user.admissionDate)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">User ID</p>
                      <p className="text-base font-extrabold text-gray-800 mt-1">{user.userId}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Membership Status</p>
                      <div className="mt-1">
                        <StatusTag status={user.status} />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Aadhaar Security</p>
                      <div className="mt-1">
                        <AadhaarMask aadhaar={user.aadhaar} />
                      </div>
                    </div>
                  </div>

                  <Alert
                    message="Official Records Protected"
                    description="Member ID, Form Number, and Date of Admission are official club records and can only be altered by the KPNS Administrator."
                    type="info"
                    showIcon
                    className="rounded-2xl"
                  />
                </div>
              ),
            },
            {
              key: 'personal',
              label: (
                <span className="flex items-center gap-2 font-bold">
                  <UserOutlined />
                  Personal Information ✏️
                </span>
              ),
              children: (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Edit Personal Details</h2>
                      <p className="text-xs text-gray-500">
                        Update your personal and contact details.
                      </p>
                    </div>
                  </div>

                  <Form
                    form={personalForm}
                    layout="vertical"
                    initialValues={{
                      name: user.name,
                      fatherName: user.fatherName,
                      whatsapp: user.whatsapp,
                      altMobile: user.altMobile,
                      email: user.email,
                      aadhaar: user.aadhaar,
                      bloodGroup: user.bloodGroup,
                      dob: user.dob ? dayjs(user.dob) : undefined,
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Member Name *</span>}
                        name="name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Father's Name *</span>}
                        name="fatherName"
                        rules={[{ required: true, message: "Please enter father's name" }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">WhatsApp Number *</span>}
                        name="whatsapp"
                        rules={[{ required: true, message: 'Please enter WhatsApp number' }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Alternative Mobile</span>}
                        name="altMobile"
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Email ID *</span>}
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter email' }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Aadhaar Number</span>}
                        name="aadhaar"
                      >
                        <Input size="large" className="rounded-xl" maxLength={12} />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Blood Group *</span>}
                        name="bloodGroup"
                        rules={[{ required: true, message: 'Select blood group' }]}
                      >
                        <Select size="large" className="rounded-xl">
                          {BLOOD_GROUPS.map((bg) => (
                            <Option key={bg} value={bg}>
                              {bg}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Date of Birth *</span>}
                        name="dob"
                        rules={[{ required: true, message: 'Select date of birth' }]}
                      >
                        <DatePicker
                          className="w-full rounded-xl"
                          size="large"
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="primary"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={saving}
                        onClick={handleSavePersonal}
                        className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 px-7 rounded-xl shadow-sm"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                </div>
              ),
            },
            {
              key: 'address',
              label: (
                <span className="flex items-center gap-2 font-bold">
                  <HomeOutlined />
                  Address Information ✏️
                </span>
              ),
              children: (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Edit Address Details</h2>
                      <p className="text-xs text-gray-500">
                        Update your village, post office, city, and pincode.
                      </p>
                    </div>
                  </div>

                  <Form
                    form={addressForm}
                    layout="vertical"
                    initialValues={{
                      houseNumber: user.houseNumber,
                      villageTown: user.villageTown,
                      postOffice: user.postOffice,
                      policeStation: user.policeStation,
                      city: user.city,
                      district: user.district || 'Purba Medinipur',
                      state: user.state || 'West Bengal',
                      country: user.country || 'India',
                      pincode: user.pincode,
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">House Number</span>}
                        name="houseNumber"
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Village / Town *</span>}
                        name="villageTown"
                        rules={[{ required: true, message: 'Please enter Village/Town' }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Post Office</span>}
                        name="postOffice"
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Police Station</span>}
                        name="policeStation"
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">City / Block</span>}
                        name="city"
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">District *</span>}
                        name="district"
                        rules={[{ required: true, message: 'Please select District' }]}
                      >
                        <Select
                          showSearch
                          size="large"
                          className="rounded-xl"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={WEST_BENGAL_DISTRICTS.map((d) => ({ label: d, value: d }))}
                        />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">State *</span>}
                        name="state"
                        rules={[{ required: true, message: 'Please select State' }]}
                      >
                        <Select
                          showSearch
                          size="large"
                          className="rounded-xl"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={INDIAN_STATES.map((s) => ({ label: s, value: s }))}
                        />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Country</span>}
                        name="country"
                      >
                        <Input size="large" className="rounded-xl" disabled />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Pincode *</span>}
                        name="pincode"
                        rules={[{ required: true, message: 'Please enter pincode' }]}
                      >
                        <Input size="large" className="rounded-xl" maxLength={6} />
                      </Form.Item>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="primary"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={saving}
                        onClick={handleSaveAddress}
                        className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 px-7 rounded-xl shadow-sm"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Interactive Image Crop Modal */}
      <ImageCropModal
        open={isCropModalOpen}
        onCancel={() => setIsCropModalOpen(false)}
        onCropComplete={handleCropComplete}
        loading={submittingPhoto}
      />
    </div>
  );
}

export default function MemberProfilePage() {
  return (
    <MemberLayout>
      <Suspense fallback={<div className="py-10 text-center">Loading profile...</div>}>
        <ProfileContent />
      </Suspense>
    </MemberLayout>
  );
}
