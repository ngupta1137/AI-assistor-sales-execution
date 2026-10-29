// The single gate for all visible copy: vocabulary tokens, data values, spelling.

const US_TO_UK = {
  color: 'colour', colors: 'colours', center: 'centre', centers: 'centres',
  centered: 'centred', prioritize: 'prioritise', prioritized: 'prioritised',
  prioritizes: 'prioritises', organize: 'organise', organized: 'organised',
  organization: 'organisation', organizations: 'organisations', analyze: 'analyse',
  analyzed: 'analysed', catalog: 'catalogue', catalogs: 'catalogues', favorite: 'favourite',
  behavior: 'behaviour', behaviors: 'behaviours', recognize: 'recognise', recognized: 'recognised',
  personalize: 'personalise', personalized: 'personalised', optimize: 'optimise', optimized: 'optimised',
  authorize: 'authorise', authorized: 'authorised', authorization: 'authorisation',
  standardize: 'standardise', standardized: 'standardised', minimize: 'minimise', maximize: 'maximise',
  utilization: 'utilisation', summarize: 'summarise', inquiry: 'enquiry',
  inquiries: 'enquiries', liter: 'litre', liters: 'litres', meter: 'metre', meters: 'metres',
  fulfill: 'fulfil', canceled: 'cancelled', labeled: 'labelled', labeling: 'labelling',
  traveled: 'travelled', traveling: 'travelling', enrollment: 'enrolment', enroll: 'enrol',
  defense: 'defence', license: 'licence', licenses: 'licences',
  aluminum: 'aluminium', tire: 'tyre', tires: 'tyres', program: 'programme', programs: 'programmes',
  neighbor: 'neighbour', neighbors: 'neighbours', neighborhood: 'neighbourhood', neighborhoods: 'neighbourhoods', specialty: 'speciality', organizer: 'organiser', organizers: 'organisers',
  fertilizer: 'fertiliser', fertilizers: 'fertilisers', theater: 'theatre', theaters: 'theatres',
  gray: 'grey', finalize: 'finalise', finalizing: 'finalising', finalized: 'finalised',
   analyzer: 'analyser', analyzers: 'analysers', orthopedic: 'orthopaedic', orthopedics: 'orthopaedics',
   jewelry: 'jewellery', mold: 'mould', aging: 'ageing',
};

function matchCase(src, repl) {
  if (src === src.toUpperCase() && src.length > 1) return repl.toUpperCase();
  if (src[0] === src[0].toUpperCase()) return repl[0].toUpperCase() + repl.slice(1);
  return repl;
}

const UK_RE = new RegExp(`\\b(${Object.keys(US_TO_UK).join('|')})\\b`, 'gi');

export function toUkSpelling(s) {
  return s.replace(UK_RE, (m) => matchCase(m, US_TO_UK[m.toLowerCase()]));
}

export const capitalise = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * Creates the text function for one industry + country.
 * Tokens: {key} replaced from vars; {Key} gives the capitalised value.
 * Unknown tokens are left in place on purpose, so tests catch them.
 */
export function createText(vocab, spelling) {
  const fill = (template, vars = {}) => {
    if (template == null) return '';
    let out = String(template).replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (m, key) => {
      if (key in vars) return String(vars[key]);
      if (key in vocab) return vocab[key];
      const lower = key[0].toLowerCase() + key.slice(1);
      if (lower !== key) {
        if (lower in vars) return capitalise(String(vars[lower]));
        if (lower in vocab) return capitalise(vocab[lower]);
      }
      return m;
    });
    // Second pass: data values may themselves contain vocabulary tokens.
    if (out.includes('{')) out = out.replace(/\{([A-Za-z]+)\}/g, (m, key) => {
      const lower = key[0].toLowerCase() + key.slice(1);
      if (key in vocab) return vocab[key];
      if (lower in vocab) return capitalise(vocab[lower]);
      return m;
    });
    return spelling === 'uk' ? toUkSpelling(out) : out;
  };
  return fill;
}

/** HTML escaping for every dynamic value rendered into markup. */
export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
