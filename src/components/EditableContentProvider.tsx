'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { EditableDocument } from '@/lib/editable-content';
const ContentContext = createContext<Record<string, EditableDocument>>({});
export function EditableContentProvider({ value, children }: { value: Record<string, EditableDocument>; children: ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
export function useEditableContent(key: string): EditableDocument {
  const document = useContext(ContentContext)[key];
  if (!document) throw new Error('Editable content provider is missing');
  return document;
}
