'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Steps,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Checkbox,
  message,
  Card,
  Divider,
  Alert,
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { usePortal } from '@/context/portal-context';
import { BLOOD_GROUPS, KPNS_COLORS } from '@/lib/constants';
import { maskAadhaar, formatDate } from '@/lib/utils';
import dayjs from 'dayjs';

const { Option } = Select;

export default function RegisterPage() {
  const router = useRouter();
  const { submitApplication, members } = usePortal();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    country: 'India',
    state: 'West Bengal',
    villageTown: 'Khejurdaha',
  });
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Step 1 -> Step 2 validation
  const handleNextStep = async () => {
    try {
      if (currentStep === 0) {
        const values = await form.validateFields([
          'name',
          'fatherName',
          'whatsapp',
          'altMobile',
          'email',
          'aadhaar',
          'bloodGroup',
          'dob',
        ]);

        // Duplicate check
        const isDuplicateMobile = members.some((m) => m.whatsapp === values.whatsapp);
        const isDuplicateEmail = members.some(
          (m) => m.email && m.email.toLowerCase() === values.email.toLowerCase()
        );

        if (isDuplicateMobile) {
          setDuplicateWarning(`⚠️ Mobile number ${values.whatsapp} is already registered with an existing member.`);
          message.warning('This mobile number is already registered.');
          return;
        }
        if (isDuplicateEmail) {
          setDuplicateWarning(`⚠️ Email address ${values.email} is already registered.`);
          message.warning('This email ID is already registered.');
          return;
        }

        setDuplicateWarning(null);
        setFormData((prev: any) => ({
          ...prev,
          ...values,
          dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
        }));
        setCurrentStep(1);
      } else if (currentStep === 1) {
        const values = await form.validateFields([
          'houseNumber',
          'villageTown',
          'postOffice',
          'policeStation',
          'city',
          'state',
          'country',
          'pincode',
        ]);
        setFormData((prev: any) => ({ ...prev, ...values }));
        setCurrentStep(2);
      }
    } catch {
      message.error('Please fill in all required fields marked with *');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    if (!confirmed) {
      message.warning('Please confirm that the information provided is correct.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newApp = submitApplication({
        name: formData.name,
        fatherName: formData.fatherName,
        whatsapp: formData.whatsapp,
        altMobile: formData.altMobile || '',
        email: formData.email,
        aadhaar: formData.aadhaar || '',
        bloodGroup: formData.bloodGroup,
        dob: formData.dob,
        houseNumber: formData.houseNumber || '',
        villageTown: formData.villageTown,
        postOffice: formData.postOffice || '',
        policeStation: formData.policeStation || '',
        city: formData.city || '',
        state: formData.state || 'West Bengal',
        country: formData.country || 'India',
        pincode: formData.pincode,
      });

      setSubmitting(false);
      message.success('Application submitted successfully!');
      router.push(
        `/register/success?appId=${newApp.id}&name=${encodeURIComponent(
          newApp.name
        )}&email=${encodeURIComponent(newApp.email)}`
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 lg:pb-12">
      <Header />

      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header Title */}
        <div className="text-center mb-6 sm:mb-8 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            New Member Enrollment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            KPNS Membership Application
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Join খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ in 4 easy steps.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6">
          <Steps
            current={currentStep}
            size="small"
            items={[
              { title: 'Personal', icon: <UserOutlined /> },
              { title: 'Address', icon: <HomeOutlined /> },
              { title: 'Review', icon: <CheckCircleOutlined /> },
              { title: 'Submit', icon: <SendOutlined /> },
            ]}
          />
        </div>

        {duplicateWarning && (
          <Alert
            message="Duplicate Detection"
            description={duplicateWarning}
            type="warning"
            showIcon
            closable
            className="mb-6 rounded-xl"
            onClose={() => setDuplicateWarning(null)}
          />
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              country: 'India',
              state: 'West Bengal',
              villageTown: 'Khejurdaha',
              pincode: '721401',
              bloodGroup: 'O+',
              dob: dayjs('1998-01-01'),
            }}
          >
            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3 mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#3447AA] text-white text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    Personal Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Please provide your authentic identification details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Member Name *</span>}
                    name="name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input placeholder="e.g. Pintu Patra" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Father's Name *</span>}
                    name="fatherName"
                    rules={[{ required: true, message: "Please enter father's name" }]}
                  >
                    <Input placeholder="e.g. Subhas Patra" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">WhatsApp Number *</span>}
                    name="whatsapp"
                    rules={[
                      { required: true, message: 'Please enter 10-digit WhatsApp number' },
                      { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' },
                    ]}
                  >
                    <Input
                      placeholder="10 digit mobile"
                      maxLength={10}
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Alternative Mobile</span>}
                    name="altMobile"
                  >
                    <Input
                      placeholder="Optional alternative number"
                      maxLength={10}
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Email ID *</span>}
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email address' },
                    ]}
                  >
                    <Input
                      placeholder="e.g. pintu.patra@example.com"
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <SafetyCertificateOutlined className="text-[#3447AA]" />
                        Aadhaar Number
                      </span>
                    }
                    name="aadhaar"
                    extra={<span className="text-[11px] text-gray-400">Masked securely in portal</span>}
                  >
                    <Input
                      placeholder="12 digit Aadhaar number"
                      maxLength={12}
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Blood Group *</span>}
                    name="bloodGroup"
                    rules={[{ required: true, message: 'Please select blood group' }]}
                  >
                    <Select placeholder="Select Blood Group" size="large" className="rounded-xl">
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
                    rules={[{ required: true, message: 'Please select date of birth' }]}
                  >
                    <DatePicker
                      className="w-full rounded-xl"
                      size="large"
                      format="DD-MM-YYYY"
                      placeholder="DD-MM-YYYY"
                    />
                  </Form.Item>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={handleNextStep}
                    className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 px-6 rounded-xl flex items-center gap-2"
                  >
                    Proceed to Address Details
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3 mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#3447AA] text-white text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    Address Details
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your permanent / communication residential address.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">House Number</span>}
                    name="houseNumber"
                  >
                    <Input placeholder="e.g. KP-124" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Village / Town *</span>}
                    name="villageTown"
                    rules={[{ required: true, message: 'Please enter Village or Town' }]}
                  >
                    <Input placeholder="e.g. Khejurdaha" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Post Office</span>}
                    name="postOffice"
                  >
                    <Input placeholder="e.g. Khejurdaha" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Police Station</span>}
                    name="policeStation"
                  >
                    <Input placeholder="e.g. Khejuri" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">City</span>}
                    name="city"
                  >
                    <Input placeholder="e.g. Contai" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">State</span>}
                    name="state"
                  >
                    <Input placeholder="e.g. West Bengal" size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Country *</span>}
                    name="country"
                    rules={[{ required: true, message: 'Please select Country' }]}
                  >
                    <Select size="large" className="rounded-xl">
                      <Option value="India">India</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs font-bold text-gray-700">Pincode *</span>}
                    name="pincode"
                    rules={[{ required: true, message: 'Please enter 6-digit Pincode' }]}
                  >
                    <Input
                      placeholder="e.g. 721401"
                      maxLength={6}
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    size="large"
                    icon={<ArrowLeftOutlined />}
                    onClick={handlePrevStep}
                    className="font-semibold text-sm h-11 px-5 rounded-xl"
                  >
                    Back
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={handleNextStep}
                    className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 px-6 rounded-xl flex items-center gap-2"
                  >
                    Review Application
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & SUBMIT */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-3 mb-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#3447AA] text-white text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    Review Your Application
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Please verify all information before official submission.
                  </p>
                </div>

                {/* Personal Information Review Box */}
                <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-200/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                      Personal Information
                    </span>
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => setCurrentStep(0)}
                      className="text-[#3447AA] font-semibold text-xs"
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400 font-medium">Member Name</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Father's Name</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formData.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">WhatsApp</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formData.whatsapp}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Email</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Blood Group</p>
                      <p className="font-bold text-[#DC2626] text-sm mt-0.5">{formData.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Date of Birth</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formatDate(formData.dob)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Aadhaar</p>
                      <p className="font-mono text-gray-800 mt-0.5">{maskAadhaar(formData.aadhaar)}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information Review Box */}
                <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-200/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
                      Address Details
                    </span>
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => setCurrentStep(1)}
                      className="text-[#3447AA] font-semibold text-xs"
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400 font-medium">Village / Town</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formData.villageTown}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Post Office</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">
                        {formData.postOffice || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Police Station</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">
                        {formData.policeStation || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">City</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formData.city || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">State & Country</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">
                        {formData.state}, {formData.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Pincode</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{formData.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="bg-[#FBEAEB] p-4 rounded-2xl border border-pink-200">
                  <Checkbox
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    I confirm that the information provided above is true and correct to the best of
                    my knowledge.
                  </Checkbox>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    size="large"
                    icon={<ArrowLeftOutlined />}
                    onClick={handlePrevStep}
                    className="font-semibold text-sm h-11 px-5 rounded-xl"
                  >
                    Back
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    icon={<SendOutlined />}
                    loading={submitting}
                    disabled={!confirmed}
                    onClick={handleSubmit}
                    className="bg-[#3447AA] hover:bg-[#283887] font-bold text-sm h-11 px-7 rounded-xl shadow-md"
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
