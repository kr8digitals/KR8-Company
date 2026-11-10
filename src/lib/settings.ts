import site from '../../data/site.json';
import { store } from './store';
import { getSiteContent } from './site-content';

/**
 * Effective site settings.
 *
 * The JSON file is the shipped default. Anything saved in the dashboard's
 * settings store wins over it, so a switch like `publicPriceDisplay` takes
 * effect on the next request instead of needing a rebuild.
 */

export type Settings = typeof site.settings;

export async function getSettings(): Promise<Settings> {
  const base = (await getSiteContent()).settings;
  const doc = await store.findOne('settings', { id: 'site' });
  const allowed = Object.fromEntries(Object.keys(base).filter(key => key in (doc?.values || {})).map(key => [key, doc!.values[key]]));
  return { ...base, ...allowed } as Settings;
}
