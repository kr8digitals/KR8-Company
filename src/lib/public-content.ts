import { cache } from 'react';
import { getCmsNavigation, getCmsServices, getCmsPrograms, getCmsTeam, getCmsPartners } from './cms';
import { getSiteContent, getSiteCatalog, getPricingContent, getProgramContent } from './site-content';
import { getSettings } from './settings';

/** The single public projection. Never includes operational rows or server secrets. */
export const getPublicContent = cache(async () => {
  const [site, catalog, pricing, programmeData, settings, navigation, services, programmes, team, partners] = await Promise.all([
    getSiteContent(), getSiteCatalog(), getPricingContent(), getProgramContent(), getSettings(),
    getCmsNavigation(), getCmsServices(), getCmsPrograms(), getCmsTeam(), getCmsPartners(),
  ]);
  return {
    site: { ...site, settings, nav: navigation.headerLinks.filter(l => l.visible !== false).sort((a,b) => a.order-b.order)
      .map(({ label, href }) => ({ label, href })),
      company: { ...site.company, email: navigation.companyEmail, phone: navigation.companyPhone,
        whatsapp: navigation.companyWhatsapp, tagline: navigation.tagline, shortDescription: navigation.shortDescription,
        socials: navigation.socials } },
    catalog, pricing, services, programmes: { ...programmeData, programmes }, team: { ...team, founders: team.founders, team: team.team }, partners,
  };
});
export type PublicContent = Awaited<ReturnType<typeof getPublicContent>>;
