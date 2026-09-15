const EXACT_RESOURCE_LABELS = new Map([
  ['mussina hospital', 'Musina Hospital'],
  ['roman catholic womens shelter', "Roman Catholic Women's Shelter"],
  ['red cross', 'Red Cross'],
  ['musina clinic (nancefield clinic)', 'Musina Clinic (Nancefield Clinic)'],
  ['iom', 'IOM'],
  ['tvet college', 'TVET College'],
]);

const ACRONYMS = new Map([
  ['ngo', 'NGO'],
  ['iom', 'IOM'],
  ['tvet', 'TVET'],
  ['zcc', 'ZCC'],
  ['rhi', 'RHI'],
  ['hiv', 'HIV'],
  ['tb', 'TB'],
  ['phc', 'PHC'],
  ['saps', 'SAPS'],
  ['msf', 'MSF'],
  ['unhcr', 'UNHCR'],
  ['sassa', 'SASSA'],
  ['lhr', 'LHR'],
  ['acms', 'ACMS'],
  ['npo', 'NPO'],
]);

const SMALL_WORDS = new Set(['and', 'of', 'the', 'for', 'in', 'at', 'to', 'on', 'with']);

function titleWord(word, index) {
  const lower = word.toLowerCase();
  if (ACRONYMS.has(lower)) return ACRONYMS.get(lower);
  if (lower === 'womens') return "Women's";
  if (lower === 'mens') return "Men's";
  if (lower === 'boys') return "Boys'";
  if (lower === 'girls') return "Girls'";
  if (index > 0 && SMALL_WORDS.has(lower)) return lower;
  return lower ? lower[0].toUpperCase() + lower.slice(1) : lower;
}

function titleToken(token, index) {
  const match = token.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/);
  if (!match) return token;
  const [, prefix, core, suffix] = match;
  if (!core) return token;
  const parts = core.split('-').map((part, partIndex) => titleWord(part, index + partIndex));
  return `${prefix}${parts.join('-')}${suffix}`;
}

export function publicationResourceLabel(value) {
  const text = String(value ?? '').trim().replace(/\s+/g, ' ');
  if (!text) return '';
  const exact = EXACT_RESOURCE_LABELS.get(text.toLowerCase());
  if (exact) return exact;

  return text
    .split(/(\s+)/)
    .map((token, index, tokens) => {
      if (/^\s+$/.test(token)) return token;
      const wordIndex = tokens.slice(0, index).filter((part) => part && !/^\s+$/.test(part)).length;
      return titleToken(token, wordIndex);
    })
    .join('');
}

export function publicationGroupLabel(value) {
  const text = String(value ?? '').trim();
  if (!text) return 'Workshop participants';
  return text
    .split(';')
    .map((part) => publicationResourceLabel(part.trim()))
    .filter(Boolean)
    .join('; ');
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
