import React from 'react';
import { getCompanyBranding } from '../../data/companyBranding';

export default function CompanyLogo({
  company,
  className = '',
  imgClassName = '',
  compact = false,
}) {
  const brand = getCompanyBranding(company);
  const fallbackLabel = (brand.name || company || 'Company')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`company-logo-shell ${compact ? 'company-logo-shell-compact' : ''} ${className}`.trim()}
      aria-label={brand.name}
      title={brand.name}
    >
      {brand.logoSrc ? (
        <img src={brand.logoSrc} alt={`${brand.name} logo`} className={`company-logo-image ${imgClassName}`.trim()} />
      ) : (
        <span className="company-logo-fallback">{fallbackLabel}</span>
      )}
    </div>
  );
}
