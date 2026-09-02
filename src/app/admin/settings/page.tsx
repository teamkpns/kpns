'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Switch, Tabs, message, Card, Divider } from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { KPNSLogo } from '@/components/common/KPNSLogo';
import { usePortal } from '@/context/portal-context';

export default function AdminSettingsPage() {
  const { clubSettings, updateClubSettings } = usePortal();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('club');

  const onFinish = (values: any) => {
    setSaving(true);
    setTimeout(() => {
      updateClubSettings(values);
      setSaving(false);
      message.success('Club settings updated successfully!');
    }, 500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Organization & Portal Configuration
          </span>
          <h1 className="text-2xl font-black text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500">
            Manage official club information, logo branding, email templates, and registration rules.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'club',
                label: (
                  <span className="font-bold flex items-center gap-1.5">
                    <InfoCircleOutlined /> Club Information
                  </span>
                ),
                children: (
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={clubSettings}
                    onFinish={onFinish}
                    className="space-y-4 pt-2 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        label={
                          <span className="text-xs font-bold text-gray-700">
                            Club Name (Bengali) *
                          </span>
                        }
                        name="clubNameBengali"
                        rules={[{ required: true }]}
                      >
                        <Input size="large" className="rounded-xl font-bold" />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span className="text-xs font-bold text-gray-700">
                            Club Name (English) *
                          </span>
                        }
                        name="clubNameEnglish"
                        rules={[{ required: true }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Tagline / Motto</span>}
                        name="tagline"
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Contact Email *</span>}
                        name="contactEmail"
                        rules={[{ required: true, type: 'email' }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Contact Mobile *</span>}
                        name="contactPhone"
                        rules={[{ required: true }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-xs font-bold text-gray-700">Address *</span>}
                        name="address"
                        rules={[{ required: true }]}
                      >
                        <Input size="large" className="rounded-xl" />
                      </Form.Item>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={saving}
                        className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 px-7 rounded-xl shadow-xs"
                      >
                        Save Club Information
                      </Button>
                    </div>
                  </Form>
                ),
              },
              {
                key: 'logo',
                label: (
                  <span className="font-bold flex items-center gap-1.5">
                    <PictureOutlined /> Organization Logo
                  </span>
                ),
                children: (
                  <div className="space-y-6 pt-2">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Current Emblem / Logo</h3>
                      <p className="text-xs text-gray-500">
                        Official insignia used on cards, reports, and public portals.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200/80 inline-flex flex-col items-center gap-4">
                      <KPNSLogo size="lg" />
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-800">
                          {clubSettings.clubNameBengali}
                        </p>
                        <p className="text-[11px] text-gray-500">Official Logo (/img/logo.png) Active</p>
                      </div>
                    </div>

                    <div>
                      <Button
                        onClick={() => message.info('Logo change dialog ready.')}
                        className="rounded-xl font-bold text-xs h-9 border-[#3447AA] text-[#3447AA]"
                      >
                        Change / Upload New Logo
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                key: 'email',
                label: (
                  <span className="font-bold flex items-center gap-1.5">
                    <MailOutlined /> Email Notifications Preview
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-2">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Official Member Email Template (Specification Section 34)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Preview of automated emails dispatched upon membership approval.
                      </p>
                    </div>

                    {/* Email Mockup Box matching Specification Section 34 */}
                    <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden text-xs text-gray-800">
                      <div className="bg-[#3447AA] p-4 text-white text-center space-y-1">
                        <div className="flex justify-center mb-1">
                          <KPNSLogo size="sm" variant="white" />
                        </div>
                        <h4 className="font-bold text-white text-sm">
                          {clubSettings.clubNameBengali}
                        </h4>
                        <p className="text-[10px] text-pink-100">Membership Approved</p>
                      </div>

                      <div className="p-6 space-y-4">
                        <p>Dear <strong>Pintu Patra</strong>,</p>
                        <p className="text-gray-600 leading-relaxed">
                          Congratulations! Your membership application has been officially approved.
                        </p>

                        <div className="bg-[#FBEAEB] p-4 rounded-xl border border-pink-200 space-y-1.5 font-mono text-xs">
                          <p><strong>Member ID:</strong> KPNS75PP26</p>
                          <p><strong>From No.:</strong> 75</p>
                          <p><strong>Date of Admission:</strong> 15-08-2026</p>
                          <p><strong>User ID:</strong> PINTU75</p>
                        </div>

                        <p className="text-gray-600 leading-relaxed text-[11px]">
                          Please use the secure password setup / login process to access your member account.
                        </p>

                        <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                          <p>Regards,</p>
                          <p className="font-bold text-gray-800">KPNS Administration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
