'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Popconfirm,
  message,
  Empty,
  Badge,
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { usePortal } from '@/context/portal-context';
import { ContactMessage } from '@/types';

const { Option } = Select;

export default function AdminMessagesPage() {
  const { contactMessages, markContactMessageAsRead, deleteContactMessage, refreshData } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = contactMessages.filter((m) => !m.read).length;
  const readCount = contactMessages.filter((m) => m.read).length;

  const filteredMessages = contactMessages.filter((m) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNREAD' && !m.read) ||
      (statusFilter === 'READ' && m.read);

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      m.name.toLowerCase().includes(term) ||
      m.phone.includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const handleOpenView = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setViewModalOpen(true);
    if (!msg.read) {
      markContactMessageAsRead(msg.id);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
    message.success('Fetched latest messages from database!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
              Public Inquiries
            </span>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <MessageOutlined /> Contact Form Messages
            </h1>
            <p className="text-xs text-gray-500">
              Inquiries and messages submitted by visitors through the public Contact Us page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<ReloadOutlined spin={refreshing} />}
              onClick={handleRefresh}
              className="rounded-xl text-xs h-10 border-gray-300 font-semibold"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Total Inquiries</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{contactMessages.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3447AA] flex items-center justify-center text-lg">
              <MailOutlined />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-500 font-bold uppercase">Unread Messages</p>
              <h3 className="text-2xl font-black text-amber-600 mt-0.5">{unreadCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <ClockCircleOutlined />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-bold uppercase">Reviewed / Read</p>
              <h3 className="text-2xl font-black text-green-600 mt-0.5">{readCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg">
              <CheckCircleOutlined />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search by sender, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="rounded-xl"
              size="middle"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500 shrink-0">Filter Status:</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full sm:w-40 rounded-xl"
            >
              <Option value="ALL">All Messages ({contactMessages.length})</Option>
              <Option value="UNREAD">Unread ({unreadCount})</Option>
              <Option value="READ">Read ({readCount})</Option>
            </Select>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredMessages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Sender</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Message Preview</th>
                    <th className="py-3 px-4">Received On</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={`hover:bg-gray-50/60 transition ${
                        !msg.read ? 'bg-amber-50/20 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        {!msg.read ? (
                          <Tag color="orange" className="font-bold text-[10px] rounded-full">
                            UNREAD
                          </Tag>
                        ) : (
                          <Tag color="default" className="text-gray-400 text-[10px] rounded-full">
                            READ
                          </Tag>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block text-sm">{msg.name}</span>
                      </td>
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <PhoneOutlined className="text-gray-400" />
                          <a href={`tel:${msg.phone}`} className="hover:text-[#3447AA]">
                            {msg.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <MailOutlined className="text-gray-400" />
                          <a href={`mailto:${msg.email}`} className="hover:text-[#3447AA]">
                            {msg.email}
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-gray-600 text-xs">{msg.message}</p>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap text-[11px]">
                        {new Date(msg.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <Button
                          size="small"
                          type="primary"
                          icon={<EyeOutlined />}
                          onClick={() => handleOpenView(msg)}
                          className="bg-[#3447AA] rounded-lg text-xs font-bold"
                        >
                          View
                        </Button>
                        <Popconfirm
                          title="Delete Message"
                          description="Are you sure you want to delete this inquiry?"
                          onConfirm={() => deleteContactMessage(msg.id)}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true, className: 'bg-red-600 font-bold' }}
                        >
                          <Button size="small" danger icon={<DeleteOutlined />} className="rounded-lg text-xs">
                            Delete
                          </Button>
                        </Popconfirm>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Empty description="No contact form messages found" />
            </div>
          )}
        </div>

        {/* View Message Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-base">Inquiry Details</span>
              {selectedMessage && !selectedMessage.read ? (
                <Tag color="orange">New</Tag>
              ) : (
                <Tag color="green">Reviewed</Tag>
              )}
            </div>
          }
          open={viewModalOpen}
          onCancel={() => setViewModalOpen(false)}
          width={650}
          footer={[
            <Popconfirm
              key="delete"
              title="Delete this message?"
              onConfirm={() => {
                if (selectedMessage) {
                  deleteContactMessage(selectedMessage.id);
                  setViewModalOpen(false);
                }
              }}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true, className: 'bg-red-600' }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>,
            <Button key="close" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedMessage && (
            <div className="space-y-4 py-2 text-xs">
              {/* Sender Info Card */}
              <div className="bg-[#FBEAEB] p-4 rounded-2xl border border-pink-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-gray-500 block text-[11px]">Sender Name:</span>
                  <p className="font-bold text-gray-900 text-sm">{selectedMessage.name}</p>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Phone Number:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="font-bold text-[#3447AA] hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                    <a
                      href={`https://wa.me/91${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                      title="WhatsApp"
                    >
                      <WhatsAppOutlined />
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Email Address:</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-bold text-[#3447AA] hover:underline block truncate mt-0.5"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              {/* Message Content */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Message Content
                </span>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>
                  Received:{' '}
                  {new Date(selectedMessage.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Regarding your message to KPNS&body=Dear ${encodeURIComponent(
                      selectedMessage.name
                    )},%0D%0A%0D%0A`}
                    className="inline-flex items-center gap-1 text-xs text-[#3447AA] font-bold hover:underline"
                  >
                    <MailOutlined /> Reply via Email
                  </a>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
