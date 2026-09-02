'use client';

import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { maskAadhaar } from '@/lib/utils';

interface AadhaarMaskProps {
  aadhaar?: string;
  allowUnmask?: boolean;
}

export const AadhaarMask: React.FC<AadhaarMaskProps> = ({
  aadhaar,
  allowUnmask = true,
}) => {
  const [showFull, setShowFull] = useState(false);

  if (!aadhaar) {
    return <span className="text-gray-400 italic">Not Provided</span>;
  }

  const clean = aadhaar.replace(/\s+/g, '');
  const formattedFull = clean.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  const masked = maskAadhaar(clean);

  return (
    <div className="inline-flex items-center gap-2 font-mono text-gray-800 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 text-sm">
      <span className="tracking-wider">{showFull ? formattedFull : masked}</span>
      {allowUnmask && (
        <Tooltip title={showFull ? 'Hide Aadhaar' : 'Show full Aadhaar'}>
          <Button
            type="text"
            size="small"
            icon={showFull ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setShowFull(!showFull)}
            className="text-gray-500 hover:text-[#3447AA] flex items-center justify-center p-0.5"
          />
        </Tooltip>
      )}
    </div>
  );
};
