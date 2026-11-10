import { cache } from 'react';
import defaults from '../../data/editable-content.json';
import { store } from './store';
export type EditableDocument = { label: string; texts: Record<string, string>; blocks: Record<string, any> };
export const EDITABLE_DEFAULTS = defaults as Record<string, EditableDocument>;
export const getEditableBundle = cache(async (): Promise<Record<string, EditableDocument>> => {
  const rows = await store.find('settings', { kind: 'editable_content' }, 1000);
  const bundle = { ...EDITABLE_DEFAULTS };
  for (const row of rows) {
    const key = String(row.documentKey || '');
    if (EDITABLE_DEFAULTS[key] && row.values) bundle[key] = {
      ...EDITABLE_DEFAULTS[key], ...row.values,
      texts: { ...EDITABLE_DEFAULTS[key].texts, ...row.values.texts },
      blocks: { ...EDITABLE_DEFAULTS[key].blocks, ...row.values.blocks },
    };
  }
  return bundle;
});
export const getEditableDocument = cache(async (key: string): Promise<EditableDocument> => {
  const document = (await getEditableBundle())[key];
  if (!document) throw new Error('Unknown editable content document');
  return document;
});
