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
} from 'antd';
import {
  IdcardOutlined,
  UserOutlined,
  HomeOutlined,
  SaveOutlined,
  LockOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { StatusTag } from '@/components/common/StatusTag';
import { AadhaarMask } from '@/components/common/AadhaarMask';
import { usePortal } from '@/context/portal-context';
import { BLOOD_GROUPS, INDIAN_STATES, WEST_BENGAL_DISTRICTS, KPNS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import dayjs from 'dayjs';

const { Option } = Select;

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'membership';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { currentUser, updateMemberProfile } = usePortal();
  const [saving, setSaving] = useState(false);
  const [personalForm] = Form.useForm();
  const [addressForm] = Form.useForm();

  const user = currentUser || {
    memberId: 'KPNS75PP26',
    fromNo: '75',
    userId: 'PINTU75',
    status: 'ACTIVE',
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Member Profile
          </span>
          <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusTag status={user.status} />
          <span className="font-mono text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-700">
            {user.memberId}
          </span>
        </div>
      </div>

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
