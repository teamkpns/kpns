'use client';

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp } from 'antd';
import { KPNS_COLORS } from '@/lib/constants';

export const AntdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: KPNS_COLORS.primary,
            colorLink: KPNS_COLORS.primary,
            colorSuccess: KPNS_COLORS.success,
            colorWarning: KPNS_COLORS.warning,
            colorError: KPNS_COLORS.error,
            borderRadius: 8,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Bengali", sans-serif',
          },
          components: {
            Button: {
              colorPrimary: KPNS_COLORS.primary,
              algorithm: true,
              borderRadius: 8,
              controlHeight: 40,
            },
            Card: {
              borderRadiusLG: 12,
            },
            Input: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Select: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Table: {
              borderRadiusLG: 10,
            },
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </AntdRegistry>
  );
};
