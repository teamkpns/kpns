'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Avatar, Button, Empty } from 'antd';
import { GiftOutlined, UserOutlined, SmileFilled, HeartFilled } from '@ant-design/icons';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { usePortal } from '@/context/portal-context';
import { getBirthdayGroups, formatDate } from '@/lib/utils';
import { KPNS_COLORS } from '@/lib/constants';
import confetti from 'canvas-confetti';

export default function MemberBirthdaysPage() {
  const { members } = usePortal();
  const [activeTab, setActiveTab] = useState('today');

  const { today, thisWeek, thisMonth } = getBirthdayGroups(members);

  // Trigger celebration confetti on mount if today has birthdays
  useEffect(() => {
    if (today.length > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [today]);

  const renderMemberCard = (member: any, isToday = false) => {
    const bDate = new Date(member.dob);
    const day = bDate.getDate();
    const month = bDate.toLocaleString('default', { month: 'long' });

    return (
      <div
        key={member.id}
        className={`rounded-3xl p-6 text-center border transition relative overflow-hidden flex flex-col items-center justify-center ${
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

        {/* Member Avatar */}
        <div className="relative mb-3">
          <Avatar
            size={72}
            style={{
              backgroundColor: isToday ? KPNS_COLORS.primary : '#94A3B8',
            }}
            icon={<UserOutlined />}
            className="shadow-md border-4 border-white"
          />
          {isToday && (
            <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1 text-sm leading-none shadow-xs">
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

        {member.villageTown && (
          <p className="text-[11px] text-gray-400 mt-1">{member.villageTown}</p>
        )}

        {isToday && (
          <div className="mt-4 pt-3 border-t border-pink-200/80 w-full space-y-2">
            <p className="text-xs font-black text-pink-600 tracking-wide flex items-center justify-center gap-1">
              <span>🎉 Happy Birthday!</span>
            </p>
            <Button
              size="small"
              icon={<HeartFilled className="text-red-500" />}
              onClick={() => {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.7 },
                });
              }}
              className="rounded-full text-xs font-bold bg-white text-gray-700 border-pink-200 hover:bg-pink-50"
            >
              Send Celebration Wishes
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <MemberLayout>
      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Member Celebrations
          </span>
          <h1 className="text-2xl font-black text-gray-900">🎂 Member Birthdays</h1>
          <p className="text-xs text-gray-500">
            Celebrate community birthdays and share heartfelt fraternal wishes.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'today',
                label: (
                  <span className="font-bold">
                    🎉 Today's Birthdays ({today.length})
                  </span>
                ),
                children: (
                  <div className="py-4">
                    {today.length === 0 ? (
                      <div className="text-center py-10">
                        <Empty description="No member birthdays today" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {today.map((m) => renderMemberCard(m, true))}
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
                        {thisWeek.map((m) => renderMemberCard(m, today.some((t) => t.id === m.id)))}
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
                        {thisMonth.map((m) => renderMemberCard(m, today.some((t) => t.id === m.id)))}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </MemberLayout>
  );
}
