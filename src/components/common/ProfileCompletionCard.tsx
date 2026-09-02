'use client';

import React from 'react';
import Link from 'next/link';
import { Progress, Button } from 'antd';
import { WarningOutlined, CheckCircleFilled, ArrowRightOutlined } from '@ant-design/icons';
import { KPNS_COLORS } from '@/lib/constants';

interface ProfileCompletionCardProps {
  score: number;
  missingFields: string[];
  editHref?: string;
  className?: string;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  score,
  missingFields,
  editHref = '/member/profile',
  className = '',
}) => {
  const isComplete = score === 100 || missingFields.length === 0;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Background soft accent */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3447AA]">
            Profile Completion
          </span>
          <h3 className="text-2xl font-black text-gray-900 mt-0.5">{score}%</h3>
        </div>
        <div className="w-12 h-12 flex items-center justify-center">
          <Progress
            type="circle"
            percent={score}
            size={46}
            strokeColor={score >= 80 ? KPNS_COLORS.primary : score >= 50 ? '#F59E0B' : '#DC2626'}
            format={() => ''}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <Progress
        percent={score}
        strokeColor={{
          '0%': '#3447AA',
          '100%': '#5B6ED4',
        }}
        showInfo={false}
        className="mb-3"
      />

      {isComplete ? (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-xl text-xs font-medium">
          <CheckCircleFilled className="text-sm" />
          <span>Your profile is 100% complete and up to date!</span>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">
            {missingFields.length} information {missingFields.length === 1 ? 'field' : 'fields'} remaining
          </p>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 space-y-1.5 max-h-32 overflow-y-auto">
            {missingFields.map((field, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                <WarningOutlined className="text-amber-500 flex-shrink-0" />
                <span>{field}</span>
              </div>
            ))}
          </div>

          <Link href={editHref} className="block pt-1">
            <Button
              type="primary"
              block
              icon={<ArrowRightOutlined />}
              className="bg-[#3447AA] hover:bg-[#283887] font-semibold text-xs h-9 rounded-xl flex items-center justify-center"
            >
              Complete Profile
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
