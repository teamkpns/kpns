'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Progress, message, Alert } from 'antd';
import {
  LockOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleFilled,
} from '@ant-design/icons';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { evaluatePasswordStrength } from '@/lib/utils';
import { usePortal } from '@/context/portal-context';

export default function MemberPasswordPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { addActivityLog, currentUser } = usePortal();

  const strength = evaluatePasswordStrength(newPassword);

  const onFinish = (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New password and confirmation do not match!');
      return;
    }

    if (strength.score < 40) {
      message.warning('Please choose a stronger password for security.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addActivityLog('Password Changed', currentUser?.memberId, 'Updated account security password');
      message.success('Password changed successfully!');
      form.resetFields();
      setNewPassword('');
    }, 600);
  };

  return (
    <MemberLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Account Security
          </span>
          <h1 className="text-2xl font-black text-gray-900">Change Password</h1>
          <p className="text-xs text-gray-500">
            Ensure your account is using a secure password to protect member data.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
            <Form.Item
              label={<span className="text-xs font-bold text-gray-700">Current Password</span>}
              name="currentPassword"
              rules={[{ required: true, message: 'Please enter current password' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 mr-1" />}
                placeholder="Enter current password"
                size="large"
                className="rounded-xl"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-bold text-gray-700">New Password</span>}
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined className="text-gray-400 mr-1" />}
                placeholder="Enter new strong password"
                size="large"
                className="rounded-xl"
                onChange={(e) => setNewPassword(e.target.value)}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            {/* Password strength indicator (Specification Section 13) */}
            {newPassword && (
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-500">Password Strength:</span>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <Progress
                  percent={strength.score}
                  strokeColor={strength.color}
                  showInfo={false}
                  size="small"
                />
              </div>
            )}

            <Form.Item
              label={<span className="text-xs font-bold text-gray-700">Confirm New Password</span>}
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your new password' }]}
            >
              <Input.Password
                prefix={<KeyOutlined className="text-gray-400 mr-1" />}
                placeholder="Re-enter new password"
                size="large"
                className="rounded-xl"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 rounded-xl shadow-md"
            >
              Change Password
            </Button>
          </Form>

          <Alert
            message="Security Tip"
            description="Use a mix of uppercase letters, numbers, and symbols. Never share your KPNS member password with anyone."
            type="info"
            showIcon
            className="rounded-2xl text-xs"
          />
        </div>
      </div>
    </MemberLayout>
  );
}
