export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return 'Suppressed';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return parsed.toLocaleString('en-ZA');
}

export function formatPercent(value) {
  if (value === null || value === undefined || value === '') return 'Suppressed';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return `${parsed.toFixed(1)}%`;
}

export function formatMonths(value) {
  if (value === null || value === undefined || value === '') return 'Suppressed';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return `${parsed.toFixed(1).replace('.0', '')} months`;
}

export function safeValue(value, suffix = '') {
  if (value === null || value === undefined || value === '') return 'Suppressed';
  return `${value}${suffix}`;
}
