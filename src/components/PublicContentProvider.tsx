'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { PublicContent } from '@/lib/public-content';
const PublicContext = createContext<PublicContent | null>(null);
export function PublicContentProvider({ value, children }: { value: PublicContent; children: ReactNode }) {
  return <PublicContext.Provider value={value}>{children}</PublicContext.Provider>;
}
export function usePublicContent() {
  const value = useContext(PublicContext);
  if (!value) throw new Error('Public content provider is missing');
  return value;
}
