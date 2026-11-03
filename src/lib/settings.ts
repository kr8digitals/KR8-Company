import site from '../../data/site.json';
import { store } from './store';

/**
 * Effective site settings.
 *
 * The JSON file is the shipped default. Anything saved in the dashboard's
 * settings store wins over it, so a switch like `publicPriceDisplay` takes
 * effect on the next request instead of needing a rebuild.
 */

export type Settings = typeof site.settings;

export async function getSettings(): Promise<Settings> {
  const base = JSON.parse(JSON.stringify(site.settings)) as Settings;
  try {
    const doc = (await store.find('settings', { id: 'site' }, 1))[0];
    const values = (doc?.values || {}) as Record<string, unknown>;
    return { ...base, ...values } as Settings;
  } catch {
    return base;
  }
}
