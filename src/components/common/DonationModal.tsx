'use client';

import React, { useState } from 'react';
import { Modal, Button, message, Tooltip } from 'antd';
import {
  HeartFilled,
  CopyOutlined,
  CheckOutlined,
  DownloadOutlined,
  QrcodeOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { DONATION_BANK_DETAILS, KPNS_COLORS } from '@/lib/constants';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ open, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    message.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => {
      setCopiedField((prev) => (prev === fieldName ? null : prev));
    }, 2000);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={560}
      destroyOnHidden
      closeIcon={
        <span className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
          <CloseOutlined className="text-sm" />
        </span>
      }
      className="rounded-3xl overflow-hidden"
      styles={{
        mask: {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
        },
        body: {
          padding: '4px 0',
        },
      }}
    >
      <div className="space-y-5">
        {/* Header with Badge & Bank Logo */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#3447AA] text-xs font-black shadow-2xs">
            <HeartFilled className="text-pink-500 animate-pulse" />
            <span>Support Community Welfare &amp; Child Health</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <img
              src={DONATION_BANK_DETAILS.bankLogoUrl}
              alt={DONATION_BANK_DETAILS.bankName}
              className="h-9 sm:h-10 object-contain drop-shadow-xs"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Official Donation Account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Your generous contribution fuels our free eye checkups, child nutrition drives, and community welfare programs.
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-gradient-to-b from-[#F8FAFC] to-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-full flex flex-col items-center justify-center text-center">
            {/* Center-aligned QR Frame */}
            <div className="w-fit mx-auto flex items-center justify-center p-3 sm:p-3.5 bg-white rounded-2xl border-2 border-dashed border-[#3447AA]/30 shadow-md">
              <img
                src={DONATION_BANK_DETAILS.qrCodeUrl}
                alt="KPNS UPI QR Code"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl block mx-auto aspect-square"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-black text-gray-800">
              <QrcodeOutlined className="text-[#3447AA]" />
              <span>Scan to Pay via any UPI App</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED &bull; Any Banking App
            </p>
          </div>

          {/* Quick Actions for Mobile / QR */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <a
              href={DONATION_BANK_DETAILS.upiIntentUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3447AA] hover:bg-[#283887] text-white text-xs font-bold shadow-xs transition active:scale-95 sm:hidden"
            >
              <MobileOutlined />
              <span>Pay with UPI App</span>
            </a>

            <a
              href={DONATION_BANK_DETAILS.qrCodeUrl}
              download="KPNS-Donation-QR.png"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition active:scale-95"
            >
              <DownloadOutlined />
              <span>Save QR Code</span>
            </a>
          </div>
        </div>

        {/* Bank & UPI Details List */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200/80">
            <BankOutlined className="text-[#3447AA] text-base" />
            <span className="text-xs font-black uppercase tracking-wider text-gray-800">
              Bank Transfer (NEFT / RTGS / IMPS) &amp; UPI
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Beneficiary Name */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-white border border-gray-100">
              <span className="text-gray-500 font-medium">Account Name:</span>
              <span className="font-bold text-gray-900 text-right break-all">
                {DONATION_BANK_DETAILS.accountName}
              </span>
            </div>

            {/* Bank Name */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-white border border-gray-100">
              <span className="text-gray-500 font-medium">Bank Name:</span>
              <span className="font-bold text-[#3447AA]">{DONATION_BANK_DETAILS.bankName}</span>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-gray-100">
              <div>
                <span className="text-gray-500 font-medium block">Account Number:</span>
                <span className="font-mono font-black text-sm text-gray-900 tracking-wider">
                  {DONATION_BANK_DETAILS.accountNumber}
                </span>
              </div>
              <Tooltip title={copiedField === 'Account Number' ? 'Copied!' : 'Copy Account Number'}>
                <Button
                  size="small"
                  icon={copiedField === 'Account Number' ? <CheckOutlined className="text-green-600" /> : <CopyOutlined />}
                  onClick={() => handleCopy(DONATION_BANK_DETAILS.accountNumber, 'Account Number')}
                  className="rounded-lg text-xs font-bold"
                >
                  {copiedField === 'Account Number' ? 'Copied' : 'Copy'}
                </Button>
              </Tooltip>
            </div>

            {/* IFSC Code */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-gray-100">
              <div>
                <span className="text-gray-500 font-medium block">IFSC Code:</span>
                <span className="font-mono font-black text-sm text-gray-900 tracking-wider">
                  {DONATION_BANK_DETAILS.ifscCode}
                </span>
              </div>
              <Tooltip title={copiedField === 'IFSC Code' ? 'Copied!' : 'Copy IFSC Code'}>
                <Button
                  size="small"
                  icon={copiedField === 'IFSC Code' ? <CheckOutlined className="text-green-600" /> : <CopyOutlined />}
                  onClick={() => handleCopy(DONATION_BANK_DETAILS.ifscCode, 'IFSC Code')}
                  className="rounded-lg text-xs font-bold"
                >
                  {copiedField === 'IFSC Code' ? 'Copied' : 'Copy'}
                </Button>
              </Tooltip>
            </div>

            {/* UPI ID */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-blue-50/70 border border-blue-100">
              <div>
                <span className="text-blue-900 font-medium block">UPI ID / VPA:</span>
                <span className="font-mono font-black text-xs sm:text-sm text-[#3447AA] tracking-wide break-all">
                  {DONATION_BANK_DETAILS.upiId}
                </span>
              </div>
              <Tooltip title={copiedField === 'UPI ID' ? 'Copied!' : 'Copy UPI ID'}>
                <Button
                  size="small"
                  type="primary"
                  icon={copiedField === 'UPI ID' ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={() => handleCopy(DONATION_BANK_DETAILS.upiId, 'UPI ID')}
                  className="bg-[#3447AA] hover:bg-[#283887] rounded-lg text-xs font-bold shrink-0"
                >
                  {copiedField === 'UPI ID' ? 'Copied' : 'Copy'}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Security & Verification Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1 text-center">
          <SafetyCertificateOutlined className="text-green-600 text-sm shrink-0" />
          <span>
            Verified Official Account of Khejurda Palliunnyayan Narayan Sangha (Reg. No: SO168946).
          </span>
        </div>
      </div>
    </Modal>
  );
};
