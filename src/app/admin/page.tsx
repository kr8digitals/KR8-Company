import type { Metadata } from 'next';
import AdminApp from '@/components/AdminApp';
import { adminConfigured } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminApp configured={adminConfigured()} />;
}
