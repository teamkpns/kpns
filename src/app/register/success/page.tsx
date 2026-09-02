'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Result, Card } from 'antd';
import {
  CheckCircleFilled,
  HomeOutlined,
  LoginOutlined,
  CopyOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { StatusTag } from '@/components/common/StatusTag';
import { message } from 'antd';

function SuccessContent() {
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId') || 'KPNS-APP-2026-0001';
  const name = searchParams.get('name') || 'Applicant';
  const email = searchParams.get('email') || 'your registered email';

  const handleCopy = () => {
    navigator.clipboard.writeText(appId);
    message.success('Application ID copied to clipboard!');
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-center">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
        {/* Checkmark animation icon */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner shadow-green-200">
          <CheckCircleFilled />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Application Submitted</h1>
          <p className="text-sm text-gray-600">
            Thank you, <strong className="text-gray-900">{name}</strong>, for applying for
            membership at <strong>খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ</strong>.
          </p>
        </div>

        {/* Application ID Card */}
        <div className="bg-[#FBEAEB] p-5 rounded-2xl border border-pink-200 space-y-2 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Your Application ID is
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl sm:text-2xl font-black text-[#3447AA] tracking-wider">
              {appId}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-600 hover:text-[#3447AA] transition"
              title="Copy ID"
            >
              <CopyOutlined />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs">
            <span className="text-gray-600">Application Status:</span>
            <StatusTag status="PENDING" />
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          You will receive further verification details and admission status on your registered
          email: <span className="font-semibold text-gray-700">{email}</span>.
        </p>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="large"
              icon={<HomeOutlined />}
              className="w-full sm:w-auto font-semibold text-xs sm:text-sm h-11 px-6 rounded-xl"
            >
              Back to Home
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              className="w-full sm:w-auto bg-[#3447AA] hover:bg-[#283887] font-bold text-xs sm:text-sm h-11 px-6 rounded-xl shadow-md"
            >
              Member Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-12">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="text-center py-20 text-gray-500">Loading submission status...</div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <MobileBottomNav />
    </div>
  );
}
