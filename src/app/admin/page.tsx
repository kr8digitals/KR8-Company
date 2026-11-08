import type { Metadata } from 'next';
import { adminConfigured } from '@/lib/auth';
import AdminApp from '@/components/AdminApp';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Executive CMS & Admin Studio | KR8 DIGITALS',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp configured={adminConfigured()} />;
}
