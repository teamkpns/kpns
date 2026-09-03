'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/context/portal-context';

export default function MemberBirthdaysRedirectPage() {
  const router = useRouter();
  const { currentRole } = usePortal();

  useEffect(() => {
    // Birthdays page is admin-only — redirect members away
    if (currentRole === 'ADMIN') {
      router.replace('/admin/birthdays');
    } else {
      router.replace('/member/dashboard');
    }
  }, [currentRole, router]);

  return null;
}
