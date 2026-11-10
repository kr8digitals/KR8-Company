import { cache } from 'react';
import siteSeed from '../../data/site.json';
import catalogSeed from '../../data/sites.json';
import pricingSeed from '../../data/pricing.json';
import programmesSeed from '../../data/programmes.json';
import { store } from './store';

// Existing settings collection holds versionable global content documents.
export const getSiteContent = cache(async (): Promise<typeof siteSeed> => {
  await store.seed('settings', []);
  const row = await store.findOne('settings', { id: 'content-site' });
  return row?.values || siteSeed;
});
export const getSiteCatalog = cache(async (): Promise<typeof catalogSeed> => {
  const row = await store.findOne('settings', { id: 'content-catalog' });
  return row?.values || catalogSeed;
});
export const HOME_DEFAULTS = {
  badge: 'A creative company',
  mobileTitle: 'We exist',
  mobileHighlight: 'because of you.',
  title: 'Whoever you are, whatever you do,',
  highlight: 'we exist because of you.',
  description: 'We design and engineer fast websites, unmistakable brand identities, scroll-stopping video, AI systems, and search authority for organisations ready to lead — while training the next generation of digital builders for free.',
};
export const getHomeContent = cache(async (): Promise<typeof HOME_DEFAULTS> => {
  const row = await store.findOne('settings', { id: 'content-home' });
  return { ...HOME_DEFAULTS, ...row?.values };
});

export const getPricingContent = cache(async (): Promise<typeof pricingSeed> => {
  const row = await store.findOne('settings', { id: 'content-pricing' });
  return row?.values || pricingSeed;
});
export const getProgramContent = cache(async (): Promise<typeof programmesSeed> => {
  const row = await store.findOne('settings', { id: 'content-programme-data' });
  return row?.values || programmesSeed;
});
