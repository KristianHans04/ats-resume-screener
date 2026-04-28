const COMPANY_BRANDING = {
  'safaricom plc': {
    name: 'Safaricom PLC',
    logoSrc: '/company-logos/safaricom.png',
    industry: 'Telecommunications',
    headline: 'Digital platforms, connectivity, and fintech at national scale.',
  },
  andela: {
    name: 'Andela',
    logoSrc: '/company-logos/andela.svg',
    industry: 'Global Talent Network',
    headline: 'Distributed engineering teams building for global clients.',
  },
  'm-kopa': {
    name: 'M-KOPA',
    logoSrc: '/company-logos/m-kopa.svg',
    industry: 'Fintech',
    headline: 'Asset financing, payments, and data products across Africa.',
  },
  'absa bank kenya plc': {
    name: 'Absa Bank Kenya PLC',
    logoSrc: '/company-logos/absa.jpg',
    industry: 'Banking',
    headline: 'Retail, corporate, and digital banking for East Africa.',
  },
  'kcb group': {
    name: 'KCB Group',
    logoSrc: null,
    industry: 'Banking',
    headline: 'Kenya\'s largest bank, serving millions across East Africa.',
  },
  'equity bank kenya': {
    name: 'Equity Bank Kenya',
    logoSrc: null,
    industry: 'Banking & Fintech',
    headline: 'Financial inclusion and digital banking across Africa.',
  },
  'co-operative bank of kenya': {
    name: 'Co-operative Bank of Kenya',
    logoSrc: null,
    industry: 'Banking',
    headline: 'Trusted partner in financial services for cooperatives and individuals.',
  },
  'ncba bank kenya': {
    name: 'NCBA Bank Kenya',
    logoSrc: null,
    industry: 'Banking',
    headline: 'Digital-first banking and financial solutions for modern Kenya.',
  },
  'standard chartered kenya': {
    name: 'Standard Chartered Kenya',
    logoSrc: null,
    industry: 'Banking',
    headline: 'International banking for global and local corporate clients.',
  },
  'airtel kenya': {
    name: 'Airtel Kenya',
    logoSrc: null,
    industry: 'Telecommunications',
    headline: 'Affordable connectivity and mobile money for Kenyan households.',
  },
  'kenya power': {
    name: 'Kenya Power',
    logoSrc: null,
    industry: 'Energy & Utilities',
    headline: 'National electricity distribution and grid management.',
  },
  'nation media group': {
    name: 'Nation Media Group',
    logoSrc: null,
    industry: 'Media & Publishing',
    headline: 'East Africa\'s leading independent media house.',
  },
  'deloitte kenya': {
    name: 'Deloitte Kenya',
    logoSrc: null,
    industry: 'Professional Services',
    headline: 'Audit, consulting, and advisory for leading organisations.',
  },
  'pwc kenya': {
    name: 'PwC Kenya',
    logoSrc: null,
    industry: 'Professional Services',
    headline: 'Assurance, tax, and consulting for East Africa\'s top firms.',
  },
  'ernst & young kenya': {
    name: 'Ernst & Young Kenya',
    logoSrc: null,
    industry: 'Professional Services',
    headline: 'Building a better working world through assurance and advisory.',
  },
  'twiga foods': {
    name: 'Twiga Foods',
    logoSrc: null,
    industry: 'Agri-tech & Logistics',
    headline: 'Digitising food supply chains to reduce cost for Africa.',
  },
  'sendy': {
    name: 'Sendy',
    logoSrc: null,
    industry: 'Logistics & Delivery',
    headline: 'On-demand logistics and last-mile delivery across Africa.',
  },
  'kenya airways': {
    name: 'Kenya Airways',
    logoSrc: null,
    industry: 'Aviation',
    headline: 'Africa\'s leading airline, connecting the continent to the world.',
  },
  'flutterwave kenya': {
    name: 'Flutterwave Kenya',
    logoSrc: null,
    industry: 'Fintech',
    headline: 'Simplifying payments for businesses across Africa.',
  },
  'cellulant': {
    name: 'Cellulant',
    logoSrc: null,
    industry: 'Fintech',
    headline: 'Pan-African digital payments and agri-commerce platform.',
  },
  'unilever kenya': {
    name: 'Unilever Kenya',
    logoSrc: null,
    industry: 'FMCG',
    headline: 'Consumer goods, personal care, and sustainable development.',
  },
  'dhl kenya': {
    name: 'DHL Kenya',
    logoSrc: null,
    industry: 'Logistics',
    headline: 'Global express delivery and supply chain solutions.',
  },
  'radisson blu nairobi': {
    name: 'Radisson Blu Nairobi',
    logoSrc: null,
    industry: 'Hospitality',
    headline: 'Award-winning hospitality in the heart of Nairobi.',
  },
  'path kenya': {
    name: 'PATH Kenya',
    logoSrc: null,
    industry: 'Global Health & NGO',
    headline: 'Accelerating health equity through innovation and data.',
  },
  'aga khan foundation': {
    name: 'Aga Khan Foundation',
    logoSrc: null,
    industry: 'Development & NGO',
    headline: 'Creating lasting solutions to problems of poverty and marginalisation.',
  },
  'bidco africa': {
    name: 'Bidco Africa',
    logoSrc: null,
    industry: 'Manufacturing & FMCG',
    headline: 'Pan-African consumer goods manufacturing and distribution.',
  },
  'i&m bank': {
    name: 'I&M Bank',
    logoSrc: null,
    industry: 'Banking',
    headline: 'Personal and business banking with a personal touch.',
  },
};

export function normalizeCompanyName(companyName = '') {
  return companyName.trim().toLowerCase();
}

export function getCompanyBranding(companyName = '') {
  const normalized = normalizeCompanyName(companyName);
  return COMPANY_BRANDING[normalized] ?? {
    name: companyName || 'Company',
    logoSrc: null,
    industry: 'Employer',
    headline: 'Professional opportunities across product, data, and engineering teams.',
  };
}

export function extractRequirementTags(requirements = '', maxTags = 4) {
  return requirements
    .split('\n')
    .map((line) => line.replace(/^[\-\*\u2022]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, maxTags);
}

export function makeExcerpt(text = '', maxLength = 160) {
  if (!text) return '';
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}
