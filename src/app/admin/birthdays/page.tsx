'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Avatar, Button, Empty, message } from 'antd';
import {
  GiftOutlined,
  UserOutlined,
  HeartFilled,
  WhatsAppOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { usePortal } from '@/context/portal-context';
import { getBirthdayGroups } from '@/lib/utils';
import { KPNS_COLORS } from '@/lib/constants';
import confetti from 'canvas-confetti';

export default function AdminBirthdaysPage() {
  const { members } = usePortal();
  const [activeTab, setActiveTab] = useState('today');

  const { today, thisWeek, thisMonth } = getBirthdayGroups(members);

  useEffect(() => {
    if (today.length > 0) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [today]);

  const handleSendWish = (member: any) => {
    message.success(`Fraternal birthday wish dispatched to ${member.name} (${member.whatsapp})!`);
  };

  const renderBirthdayCard = (member: any, isToday = false) => {
    const bDate = new Date(member.dob);
    const day = bDate.getDate();
    const month = bDate.toLocaleString('default', { month: 'long' });

    return (
      <div
        key={member.id}
        className={`rounded-3xl p-6 text-center border transition relative flex flex-col items-center justify-center ${
          isToday
            ? 'bg-gradient-to-br from-[#FBEAEB] via-pink-50 to-white border-pink-200 shadow-md scale-100 sm:scale-105'
            : 'bg-white border-gray-100 shadow-xs hover:shadow-sm'
        }`}
      >
        {isToday && (
          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
            Today!
          </span>
        )}

        <div className="relative mb-3">
          <Avatar
            size={72}
            src={member.avatarUrl}
            style={{
              backgroundColor: isToday ? KPNS_COLORS.primary : '#94A3B8',
            }}
            icon={<UserOutlined />}
            className="shadow-md border-4 border-white"
          />
          {isToday && (
            <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1 text-sm leading-none">
              👑
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
          {member.name}
        </h3>
        <p className="text-xs font-bold text-[#3447AA] mt-0.5">
          {day} {month}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          ID: <strong className="font-mono text-gray-700">{member.memberId}</strong>
        </p>
        <p className="text-[11px] text-gray-400">{member.villageTown} • {member.whatsapp}</p>

        <div className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-2">
          <Button
            size="small"
            icon={<WhatsAppOutlined />}
            onClick={() => handleSendWish(member)}
            className="rounded-full text-xs font-bold bg-green-600 hover:bg-green-700 text-white border-none flex items-center gap-1"
          >
            Send WhatsApp Wish
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Member Milestones
          </span>
          <h1 className="text-2xl font-black text-gray-900">🎂 Birthday Dashboard</h1>
          <p className="text-xs text-gray-500">
            Track member birthdays and send fraternal greetings on behalf of the KPNS Committee.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'today',
                label: <span className="font-bold">🎉 Today's Birthdays ({today.length})</span>,
                children: (
                  <div className="py-4">
                    {today.length === 0 ? (
                      <div className="text-center py-10">
                        <Empty description="No member birthdays today" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {today.map((m) => renderBirthdayCard(m, true))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'thisWeek',
                label: <span className="font-bold">This Week ({thisWeek.length})</span>,
                children: (
                  <div className="py-4">
                    {thisWeek.length === 0 ? (
                      <div className="text-center py-10">
                        <Empty description="No upcoming birthdays this week" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {thisWeek.map((m) => renderBirthdayCard(m, today.some((t) => t.id === m.id)))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'thisMonth',
                label: <span className="font-bold">This Month ({thisMonth.length})</span>,
                children: (
                  <div className="py-4">
                    {thisMonth.length === 0 ? (
                      <div className="text-center py-10">
                        <Empty description="No birthdays this month" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {thisMonth.map((m) => renderBirthdayCard(m, today.some((t) => t.id === m.id)))}
                      </div>
                    )}
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
