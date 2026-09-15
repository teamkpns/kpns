'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, Result, Alert } from 'antd';
import { MailOutlined, ArrowLeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import { KPNSLogo } from '@/components/common/KPNSLogo';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const onFinish = (values: { identifier: string }) => {
    setEmail(values.identifier);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <KPNSLogo size="md" />
          </div>
          <h1 className="text-xl font-black text-gray-900">Reset Your Password</h1>
          <p className="text-xs text-gray-500">
            Enter your registered Email or User ID to receive a secure password recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              <CheckCircleFilled />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Recovery Instructions Sent</h2>
            <p className="text-xs text-gray-600">
              We have sent password reset instructions to <strong>{email}</strong>.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button type="primary" block className="bg-[#3447AA] h-10 rounded-xl font-bold">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Form layout="vertical" onFinish={onFinish} className="space-y-4">
            <Form.Item
              label={<span className="text-xs font-bold text-gray-700">Registered Email / User ID</span>}
              name="identifier"
              rules={[{ required: true, message: 'Please enter your email or User ID' }]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400 mr-1" />}
                placeholder="e.g. pintu.patra@example.com"
                size="large"
                className="rounded-xl"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 rounded-xl shadow-md"
            >
              Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Login
              </Link>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
