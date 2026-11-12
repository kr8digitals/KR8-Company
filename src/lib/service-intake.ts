export type ServiceIntakeField = {
  key: string;
  label: string;
  kind: 'select' | 'text' | 'url' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export type ServiceIntake = {
  slug: string;
  name: string;
  heading: string;
  intro: string;
  fields: ServiceIntakeField[];
};

export const SERVICE_INTAKES: Record<string, ServiceIntake> = {
  'website-design': {
    slug: 'website-design', name: 'Website Design & Development',
    heading: 'Website project brief',
    intro: 'A few details about your website help our engineering lead recommend the right build and timeline.',
    fields: [
      { key: 'siteType', label: 'What are we building?', kind: 'select', required: true, options: ['Business or organisation website', 'Online store or booking site', 'School / learning platform', 'Web app, portal or custom workflow', 'Redesign or repair of an existing site', 'Not sure yet'] },
      { key: 'currentSite', label: 'Current website (if any)', kind: 'url', placeholder: 'https://yourwebsite.com' },
      { key: 'primaryAction', label: 'What should visitors be able to do?', kind: 'text', placeholder: 'Book, enquire, buy, apply, learn…' },
      { key: 'mustHaveFeatures', label: 'Must-have pages or features', kind: 'textarea', placeholder: 'For example: booking calendar, payments, admissions form…' },
    ],
  },
  branding: {
    slug: 'branding', name: 'Branding', heading: 'Brand identity brief',
    intro: 'Tell our brand team where the business is now and what your identity needs to do next.',
    fields: [
      { key: 'brandStage', label: 'Where is the brand today?', kind: 'select', required: true, options: ['Launching a new business', 'Rebrand or repositioning', 'Refresh an existing identity', 'New product or sub-brand', 'Exploring options'] },
      { key: 'brandDeliverables', label: 'What do you need?', kind: 'select', options: ['Logo and core identity', 'Full brand guidelines', 'Strategy, positioning and messaging', 'Packaging or collateral', 'Complete identity system', 'Not sure yet'] },
      { key: 'audience', label: 'Who should the brand connect with?', kind: 'text', placeholder: 'Your ideal customer, member, or audience' },
      { key: 'brandReferences', label: 'Style, references, or existing assets', kind: 'textarea', placeholder: 'Share links or describe what you like (and what you want to avoid).' },
    ],
  },
  'graphic-design': {
    slug: 'graphic-design', name: 'Graphic Design', heading: 'Graphic design brief',
    intro: 'Share the campaign and formats so Motionverse can scope the right creative package.',
    fields: [
      { key: 'assetType', label: 'What are you commissioning?', kind: 'select', required: true, options: ['Campaign / event flyer', 'Product launch visuals', 'Social media content set', 'Pitch deck or presentation', 'Print collateral', 'Ongoing design support', 'Not sure yet'] },
      { key: 'assetCount', label: 'How many designs or formats?', kind: 'select', options: ['One key visual', '2–5 assets', '6–12 assets', 'Ongoing monthly work', 'Not sure yet'] },
      { key: 'campaignDate', label: 'Launch or event date', kind: 'text', placeholder: 'Date or “not fixed yet”' },
      { key: 'designInputs', label: 'Brand assets and campaign details', kind: 'textarea', placeholder: 'Tell us about the offer, audience, copy, logo, and any references.' },
    ],
  },
  'video-editing': {
    slug: 'video-editing', name: 'Video Editing', heading: 'Video production brief',
    intro: 'Help Chigoma understand your footage, intended platform, and delivery needs.',
    fields: [
      { key: 'videoType', label: 'What are we making?', kind: 'select', required: true, options: ['Short-form Reels / TikToks', 'Commercial or product video', 'Brand film or documentary', 'Event highlights', 'Motion graphics / titles', 'Other'] },
      { key: 'footageStatus', label: 'Where is the footage?', kind: 'select', options: ['Footage is ready to share', 'Still planning a shoot', 'Need help with both filming and editing', 'No footage yet'] },
      { key: 'targetPlatform', label: 'Where will people watch it?', kind: 'text', placeholder: 'Instagram, TikTok, YouTube, website…' },
      { key: 'videoNotes', label: 'Approximate length, volume, or reference', kind: 'textarea', placeholder: 'Share a link or describe the result you have in mind.' },
    ],
  },
  seo: {
    slug: 'seo', name: 'SEO Optimization', heading: 'Search growth brief',
    intro: 'A little context on your website and target market lets our search team identify the best starting point.',
    fields: [
      { key: 'websiteUrl', label: 'Website to review', kind: 'url', placeholder: 'https://yourwebsite.com', required: true },
      { key: 'seoPriority', label: 'What matters most right now?', kind: 'select', options: ['Local search visibility', 'More qualified enquiries or sales', 'Technical health and site speed', 'Content and keyword strategy', 'A complete SEO programme', 'Not sure yet'] },
      { key: 'targetMarket', label: 'Where do you want to be found?', kind: 'text', placeholder: 'City, country, or customer market' },
      { key: 'searchNotes', label: 'Search competitors or current challenges', kind: 'textarea', placeholder: 'What should people find you for? Any competitors we should review?' },
    ],
  },
  'ai-automation': {
    slug: 'ai-automation', name: 'AI Agent & Automation', heading: 'AI and automation brief',
    intro: 'Describe the repetitive work or customer journey you want to improve; our team will suggest a practical first workflow.',
    fields: [
      { key: 'automationGoal', label: 'What would you like to automate?', kind: 'select', required: true, options: ['Website enquiries and lead qualification', 'Customer support / FAQs', 'Bookings, orders or follow-ups', 'Internal admin and repetitive tasks', 'Connect existing tools or systems', 'Explore an AI agent', 'Not sure yet'] },
      { key: 'currentTools', label: 'Tools you currently use', kind: 'text', placeholder: 'WhatsApp, CRM, forms, calendar, spreadsheets…' },
      { key: 'workflowVolume', label: 'Approximate workload or enquiry volume', kind: 'select', options: ['Under 20 per week', '20–100 per week', 'More than 100 per week', 'Internal workflow only', 'Not sure yet'] },
      { key: 'workflowNotes', label: 'How does the process work today?', kind: 'textarea', placeholder: 'What triggers it, who handles it, and what should happen next?' },
    ],
  },
};

export function resolveServiceIntake(value?: string): ServiceIntake | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return SERVICE_INTAKES[normalized] || Object.values(SERVICE_INTAKES).find((item) => item.name.toLowerCase() === normalized);
}
