// Pack registry. To add a pack: create the file, import it here, add it to the list.
// Order here is the order on the setup screen.

import cpg from './industries/cpg.js';

import US from './countries/US.js';

/** Vocabulary every pack gets unless it overrides the word. */
const DEFAULT_VOCAB = { territory: 'territory' };

export const INDUSTRIES = [cpg].map((p) => ({ ...p, vocab: { ...DEFAULT_VOCAB, ...p.vocab } }));
export const COUNTRIES = [US];

/** Accepts common aliases so shared links are forgiving (GB for UK, case-insensitive). */
const COUNTRY_ALIASES = { GB: 'UK', UAE: 'AE' };

export function findIndustry(id) {
  if (!id) return null;
  const key = String(id).toLowerCase();
  return INDUSTRIES.find((p) => p.id === key || (p.aliases || []).includes(key)) || null;
}

export function findCountry(id) {
  if (!id) return null;
  const key = String(id).toUpperCase();
  return COUNTRIES.find((c) => c.id === (COUNTRY_ALIASES[key] || key)) || null;
}
