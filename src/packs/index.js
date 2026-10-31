// Pack registry. To add a pack: create the file, import it here, add it to the list.
// Order here is the order on the setup screen.

import cpg from './industries/cpg.js';
import pharma from './industries/pharma.js';
import meddevices from './industries/meddevices.js';
import beverages from './industries/beverages.js';
import building from './industries/building.js';
import agri from './industries/agri.js';
import telecom from './industries/telecom.js';
import electronics from './industries/electronics.js';
import autoparts from './industries/autoparts.js';
import finserv from './industries/finserv.js';
import foodservice from './industries/foodservice.js';
import industrial from './industries/industrial.js';
import apparel from './industries/apparel.js';
import energy from './industries/energy.js';
import insurance from './industries/insurance.js';
import animalhealth from './industries/animalhealth.js';
import hygiene from './industries/hygiene.js';
import logistics from './industries/logistics.js';
import education from './industries/education.js';

import US from './countries/US.js';
import UK from './countries/UK.js';
import DE from './countries/DE.js';
import IN from './countries/IN.js';
import BR from './countries/BR.js';
import ID from './countries/ID.js';
import MX from './countries/MX.js';
import AE from './countries/AE.js';
import FR from './countries/FR.js';
import AU from './countries/AU.js';
import NZ from './countries/NZ.js';

/** Vocabulary every pack gets unless it overrides the word. */
const DEFAULT_VOCAB = { territory: 'territory' };

export const INDUSTRIES = [cpg, pharma, meddevices, beverages, building, agri, telecom, electronics, autoparts, finserv, foodservice, industrial, apparel, energy, insurance, animalhealth, hygiene, logistics, education].map((p) => ({ ...p, vocab: { ...DEFAULT_VOCAB, ...p.vocab } }));
export const COUNTRIES = [US, UK, DE, FR, AU, NZ, IN, BR, ID, MX, AE];

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
