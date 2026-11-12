'use client';

import React, { useState } from 'react';
import { Form, Input, Button, App, Card } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CompassOutlined,
  SendOutlined,
  CheckCircleFilled,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  XOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  HeartFilled,
  CopyOutlined,
  CheckOutlined,
  DownloadOutlined,
  QrcodeOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { SOCIAL_LINKS, CLUB_COORDINATES, DONATION_BANK_DETAILS } from '@/lib/constants';

const { TextArea } = Input;

export default function ContactPage() {
  const { message } = App.useApp();
  const { clubSettings, submitContactMessage } = usePortal();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    message.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => {
      setCopiedField((prev) => (prev === fieldName ? null : prev));
    }, 2000);
  };

  const handleSubmit = async (values: { name: string; phone: string; email: string; message: string }) => {
    setSubmitting(true);
    try {
      const success = await submitContactMessage({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });

      if (success) {
        setSubmitted(true);
        form.resetFields();
        message.success('Thank you! Your message has been sent to KPNS administrators.');
      } else {
        message.error('Failed to send message. Please try again or call us directly.');
      }
    } catch {
      message.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-12">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#3447AA] via-[#2A3B94] to-[#1E2C78] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-[#FBEAEB]/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-100">
            <MailOutlined /> Get In Touch With Us
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-pink-100 font-light max-w-2xl mx-auto">
            Have questions, feedback, or want to partner with us? Reach out to the KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA team.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 Cols): Address, Coordinates, Social Media */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Postal Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FBEAEB] text-[#3447AA] flex items-center justify-center text-2xl shrink-0">
                  <EnvironmentOutlined />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3447AA]">
                    Postal Address
                  </span>
                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    Headquarters
                  </h3>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                <p className="font-bold text-gray-900 text-sm">
                  খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ (KPNS)
                </p>
                <p>
                  <strong className="text-gray-900">Vill &amp; Post:</strong> Khejurda
                </p>
                <p>
                  <strong className="text-gray-900">P.S.:</strong> Egra
                </p>
                <p>
                  <strong className="text-gray-900">Dist:</strong> Purba Medinipur
                </p>
                <p>
                  <strong className="text-gray-900">State:</strong> West Bengal
                </p>
                <p>
                  <strong className="text-gray-900">PIN Code:</strong>{' '}
                  <span className="font-mono font-bold text-[#3447AA]">721422</span>
                </p>
              </div>

              {/* Direct Contact Links */}
              <div className="space-y-2.5 pt-1 text-xs">
                <a
                  href={`tel:${clubSettings.contactPhone || '+919475646111'}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition font-medium border border-gray-100"
                >
                  <PhoneOutlined className="text-[#3447AA] text-base" />
                  <span>{clubSettings.contactPhone || '+91 94756 46111'}</span>
                </a>
                <a
                  href={`mailto:${clubSettings.contactEmail || 'kpnsclub@gmail.com'}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition font-medium border border-gray-100"
                >
                  <MailOutlined className="text-[#3447AA] text-base" />
                  <span>{clubSettings.contactEmail || 'kpnsclub@gmail.com'}</span>
                </a>
              </div>
            </div>

            {/* 2. Geographic Coordinates (Lat, Long) & Google Map Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3447AA] flex items-center justify-center text-2xl shrink-0">
                    <CompassOutlined />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#3447AA]">
                      Location Coordinates
                    </span>
                    <h3 className="text-lg font-black text-gray-900 leading-snug">
                      Google Maps
                    </h3>
                  </div>
                </div>
              </div>

              {/* Coordinates Pill */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Latitude</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-gray-900">
                    {CLUB_COORDINATES.lat}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Longitude</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-gray-900">
                    {CLUB_COORDINATES.long}
                  </span>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner h-56 w-full relative">
                <iframe
                  title="KPNS Khejurda Location Map"
                  src={CLUB_COORDINATES.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <a
                href={CLUB_COORDINATES.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3447AA] hover:bg-[#283887] text-white font-bold text-xs shadow-xs transition"
              >
                <GlobalOutlined />
                Open in Google Maps App
              </a>
            </div>

            {/* 3. Social Media Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3447AA]">
                  Connect Online
                </span>
                <h3 className="text-lg font-black text-gray-900 leading-snug">
                  Official Social Media
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click any platform logo to visit our official page:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Facebook */}
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-blue-100 bg-blue-50/60 hover:bg-blue-100/70 text-blue-700 transition group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition">
                    <FacebookOutlined />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-gray-900">Facebook</span>
                    <span className="text-[10px] text-blue-600">@kpns.club</span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-pink-100 bg-pink-50/60 hover:bg-pink-100/70 text-pink-700 transition group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition">
                    <InstagramOutlined />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-gray-900">Instagram</span>
                    <span className="text-[10px] text-pink-600">@kpns.club</span>
                  </div>
                </a>

                {/* YouTube */}
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-red-100 bg-red-50/60 hover:bg-red-100/70 text-red-700 transition group"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition">
                    <YoutubeOutlined />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-gray-900">YouTube</span>
                    <span className="text-[10px] text-red-600">kpns1935</span>
                  </div>
                </a>

                {/* X.com */}
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 transition group"
                >
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-105 transition">
                    𝕏
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-gray-900">x.com</span>
                    <span className="text-[10px] text-gray-600">@KPNS_CLUB</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Leave a Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-9 border border-gray-100 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                  Feedback &amp; Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                  Leave a Message
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Send a message directly to our organization. Your inquiry will be securely stored in our records and forwarded to club administrators.
                </p>
              </div>

              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircleFilled className="text-green-600 text-lg mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-sm text-green-900">Message Delivered Successfully!</p>
                    <p>
                      Thank you for contacting KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS). Our administrative team will review your inquiry and get back to you soon.
                    </p>
                    <Button
                      size="small"
                      onClick={() => setSubmitted(false)}
                      className="mt-2 text-xs font-semibold"
                    >
                      Send Another Message
                    </Button>
                  </div>
                </div>
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark="optional"
                className="space-y-4"
              >
                {/* Name */}
                <Form.Item
                  label={<span className="text-xs font-bold text-gray-700">Full Name *</span>}
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter your full name' },
                    { min: 2, message: 'Name must be at least 2 characters' },
                  ]}
                >
                  <Input
                    placeholder="Enter your name"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                {/* Phone & Email in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Phone Number *</span>}
                    name="phone"
                    rules={[
                      { required: true, message: 'Please enter your contact phone number' },
                      {
                        pattern: /^[0-9+\s-]{8,15}$/,
                        message: 'Please enter a valid phone number',
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400 mr-1" />}
                      placeholder="e.g. 9876543210"
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Email Address *</span>}
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email address' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400 mr-1" />}
                      placeholder="e.g. yourname@example.com"
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>
                </div>

                {/* Message Box */}
                <Form.Item
                  label={<span className="text-xs font-bold text-gray-700">Your Message *</span>}
                  name="message"
                  rules={[
                    { required: true, message: 'Please write your message' },
                    { min: 10, message: 'Message must be at least 10 characters long' },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Type your message, inquiry, suggestion, or request here..."
                    className="rounded-xl"
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                {/* Send Button */}
                <div className="pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<SendOutlined />}
                    className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-12 px-8 rounded-xl shadow-md w-full sm:w-auto"
                  >
                    Send Message
                  </Button>
                </div>
              </Form>

              <div className="border-t border-gray-100 pt-4 flex items-center gap-2 text-xs text-gray-400">
                <ClockCircleOutlined />
                <span>Our committee typically responds within 24–48 hours.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Official Donation & Bank Account Details */}
        <section className="bg-white rounded-3xl p-6 sm:p-9 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA] flex items-center gap-1.5">
                <HeartFilled className="text-pink-500" /> Community Contribution &amp; Welfare
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                Official Bank Account for Donations
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Support Khejurda Palliunnyayan Narayan Sangha programs via Direct Bank Transfer (NEFT / RTGS / IMPS) or Instant UPI.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <img
                src={DONATION_BANK_DETAILS.bankLogoUrl}
                alt={DONATION_BANK_DETAILS.bankName}
                className="h-10 sm:h-12 object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left QR Code Card (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#F8FAFC] to-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col items-center text-center space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border-2 border-dashed border-[#3447AA]/30 shadow-md">
                <img
                  src={DONATION_BANK_DETAILS.qrCodeUrl}
                  alt="KPNS Donation UPI QR Code"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-gray-800 flex items-center justify-center gap-1.5">
                  <QrcodeOutlined className="text-[#3447AA]" />
                  <span>Scan to Donate via any UPI App</span>
                </p>
                <p className="text-[10px] text-gray-400">
                  Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED &bull; Any Bank App
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={DONATION_BANK_DETAILS.upiIntentUrl}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#3447AA] text-white text-xs font-bold sm:hidden"
                >
                  <MobileOutlined /> Open UPI App
                </a>
                <a
                  href={DONATION_BANK_DETAILS.qrCodeUrl}
                  download="KPNS-Donation-QR.png"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                >
                  <DownloadOutlined /> Save QR
                </a>
              </div>
            </div>

            {/* Right Account Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 pb-1 text-[#3447AA]">
                <BankOutlined className="text-base" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Verified Bank Transfer Credentials
                </span>
              </div>

              {/* Beneficiary Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Account / Beneficiary Name:</span>
                <span className="font-bold text-xs sm:text-sm text-gray-900 text-right">
                  {DONATION_BANK_DETAILS.accountName}
                </span>
              </div>

              {/* Bank Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Bank Name:</span>
                <span className="font-bold text-sm text-[#3447AA]">
                  {DONATION_BANK_DETAILS.bankName}
                </span>
              </div>

              {/* Account Number with Copy */}
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Account Number:</span>
                  <span className="font-mono font-black text-base text-gray-900 tracking-wider">
                    {DONATION_BANK_DETAILS.accountNumber}
                  </span>
                </div>
                <Button
                  size="middle"
                  icon={copiedField === 'Account Number' ? <CheckOutlined className="text-green-600" /> : <CopyOutlined />}
                  onClick={() => handleCopy(DONATION_BANK_DETAILS.accountNumber, 'Account Number')}
                  className="rounded-xl text-xs font-bold"
                >
                  {copiedField === 'Account Number' ? 'Copied' : 'Copy'}
                </Button>
              </div>

              {/* IFSC Code with Copy */}
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">IFSC Code:</span>
                  <span className="font-mono font-black text-base text-gray-900 tracking-wider">
                    {DONATION_BANK_DETAILS.ifscCode}
                  </span>
                </div>
                <Button
                  size="middle"
                  icon={copiedField === 'IFSC Code' ? <CheckOutlined className="text-green-600" /> : <CopyOutlined />}
                  onClick={() => handleCopy(DONATION_BANK_DETAILS.ifscCode, 'IFSC Code')}
                  className="rounded-xl text-xs font-bold"
                >
                  {copiedField === 'IFSC Code' ? 'Copied' : 'Copy'}
                </Button>
              </div>

              {/* UPI ID with Copy */}
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div>
                  <span className="text-xs text-blue-900 font-medium block">UPI ID / VPA:</span>
                  <span className="font-mono font-black text-sm sm:text-base text-[#3447AA] tracking-wide">
                    {DONATION_BANK_DETAILS.upiId}
                  </span>
                </div>
                <Button
                  size="middle"
                  type="primary"
                  icon={copiedField === 'UPI ID' ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={() => handleCopy(DONATION_BANK_DETAILS.upiId, 'UPI ID')}
                  className="bg-[#3447AA] hover:bg-[#283887] rounded-xl text-xs font-bold"
                >
                  {copiedField === 'UPI ID' ? 'Copied' : 'Copy UPI'}
                </Button>
              </div>

              <div className="pt-1 flex items-center gap-2 text-xs text-gray-500">
                <SafetyCertificateOutlined className="text-green-600 text-sm shrink-0" />
                <span>
                  Official registered NGO account under West Bengal Societies Registration Act, 1961 (Reg. No: SO168946).
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <MobileBottomNav />
    </div>
  );
}
