'use client';

import React from 'react';
import { Tag } from 'antd';
import { MembershipStatus } from '@/types';

interface StatusTagProps {
  status: MembershipStatus | string;
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  let color = 'default';
  let label = status;

  switch (norm) {
    case 'ACTIVE':
      color = 'success';
      label = '● ACTIVE';
      break;
    case 'PENDING':
      color = 'warning';
      label = '● PENDING';
      break;
    case 'INACTIVE':
      color = 'default';
      label = '● INACTIVE';
      break;
    case 'SUSPENDED':
      color = 'error';
      label = '● SUSPENDED';
      break;
    case 'RESIGNED':
      color = 'default';
      label = '● RESIGNED';
      break;
    case 'REJECTED':
      color = 'error';
      label = '● REJECTED';
      break;
    case 'APPROVED':
      color = 'success';
      label = '● APPROVED';
      break;
    default:
      color = 'default';
      label = status;
  }

  return (
    <Tag
      color={color}
      className={`font-semibold px-2.5 py-0.5 rounded-full uppercase text-xs tracking-wide ${className}`}
    >
      {label}
    </Tag>
  );
};
