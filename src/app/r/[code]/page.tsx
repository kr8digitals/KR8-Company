import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import RefCapture from '@/components/RefCapture';

type Params = { params: Promise<{ code: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ReferralLanding({ params }: Params) {
  const { code } = await params;
  if (!code || code.length > 40) notFound();
  return <RefCapture code={code.toLowerCase()} />;
}
