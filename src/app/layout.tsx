import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AntdProvider } from '@/components/theme/AntdProvider';
import { PortalProvider } from '@/context/portal-context';

export const metadata: Metadata = {
  title: 'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ (KPNS) — KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA',
  description:
    'Official Portal for KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS) — Reg. No. SO168946 under West Bengal Societies Registration Act, 1961',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn-IN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#1F2937] font-sans selection:bg-[#FBEAEB] selection:text-[#3447AA]">
        <AntdProvider>
          <PortalProvider>{children}</PortalProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
