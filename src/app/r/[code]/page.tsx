import { getEditableDocument } from '@/lib/editable-content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import RefCapture from '@/components/RefCapture';

type Params = { params: Promise<{ code: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:r:[code]:page")).blocks.metadata as Metadata;
}

export default async function ReferralLanding({ params }: Params) {
  const editableContent = await getEditableDocument("app:r:[code]:page");

  const { code } = await params;
  if (!code || code.length > 40) notFound();
  return <RefCapture code={code.toLowerCase()} />;
}
