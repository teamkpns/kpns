'use client';

import React from 'react';
import { Button, message, Empty } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  InfoCircleFilled,
  CheckCircleFilled,
  WarningFilled,
} from '@ant-design/icons';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { usePortal } from '@/context/portal-context';

export default function MemberNotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = usePortal();

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    message.success('All notifications marked as read.');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleFilled className="text-green-500 text-lg" />;
      case 'warning':
        return <WarningFilled className="text-amber-500 text-lg" />;
      default:
        return <InfoCircleFilled className="text-[#3447AA] text-lg" />;
    }
  };

  return (
    <MemberLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
              Updates & Alerts
            </span>
            <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
          </div>
          {notifications.some((n) => !n.read) && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={handleMarkAll}
              className="text-xs font-semibold rounded-xl text-[#3447AA] border-[#3447AA]"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Empty description="No notifications right now" />
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition cursor-pointer flex items-start gap-3.5 relative ${
                  notif.read
                    ? 'border-gray-100 opacity-80'
                    : 'border-blue-200/80 shadow-xs bg-blue-50/20'
                }`}
              >
                {/* Unread dot indicator (Specification Section 14) */}
                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3447AA] absolute top-4 right-4 animate-pulse" />
                )}

                <div className="mt-0.5">{getIcon(notif.type)}</div>

                <div className="space-y-1 pr-6 flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        notif.read ? 'text-gray-800' : 'text-gray-950 font-black'
                      }`}
                    >
                      {notif.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{notif.description}</p>
                  <p className="text-[10px] text-gray-400 font-medium pt-1">{notif.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MemberLayout>
  );
}
