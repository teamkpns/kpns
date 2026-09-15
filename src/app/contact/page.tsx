'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
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
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { SOCIAL_LINKS, CLUB_COORDINATES } from '@/lib/constants';

const { TextArea } = Input;

export default function ContactPage() {
  const { clubSettings, submitContactMessage } = usePortal();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      </main>

      <Footer />

      <MobileBottomNav />
    </div>
  );
}
