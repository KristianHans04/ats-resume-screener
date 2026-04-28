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
