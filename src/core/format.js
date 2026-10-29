// Country-aware formatting. Intl does digits and symbol placement; the pack
// supplies compact units (lakh and crore, Mio., jt) so output is stable across browsers.

const DAY = 86400000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function createFormat(country, today = new Date()) {
  const decimals = country.decimals ?? 2;
  const cur = (maxFrac, minFrac = 0) => new Intl.NumberFormat(country.locale, {
    style: 'currency', currency: country.currency, currencyDisplay: country.currencyDisplay || 'symbol',
    maximumFractionDigits: maxFrac, minimumFractionDigits: minFrac,
  });
  const curWhole = cur(0);
  const curPrice = cur(decimals, decimals);
  const curCompact = cur(1);
  const num = new Intl.NumberFormat(country.locale, { maximumFractionDigits: 0 });
  const num1 = new Intl.NumberFormat(country.locale, { maximumFractionDigits: 1 });
  // value: divisor; min: smallest amount shown in that unit (defaults to value).
  const units = country.compactUnits || [{ value: 1e9, suffix: 'B' }, { value: 1e6, suffix: 'M' }, { value: 1e3, suffix: 'K', min: 1e4 }];

  /** Money with no minor units, for totals. */
  const money = (v) => curWhole.format(Math.round(v));
  /** Money with the currency's minor units, for unit prices. */
  const price = (v) => (decimals === 0 ? curWhole.format(Math.round(v)) : curPrice.format(v));
  /** Short money for tiles: 12.3 L, 1,2 Mio. €, Rp 12,3 jt. */
  const moneyShort = (v) => {
    const abs = Math.abs(v);
    const unit = units.find((u) => abs >= (u.min ?? u.value));
    if (!unit) return money(v);
    const parts = curCompact.formatToParts(v / unit.value);
    let out = '';
    let placed = false;
    const lastNumIdx = parts.map((p) => /integer|decimal|fraction|group/.test(p.type)).lastIndexOf(true);
    parts.forEach((p, i) => {
      out += p.value;
      if (i === lastNumIdx && !placed) { out += unit.suffix; placed = true; }
    });
    return out.replace(/ /g, ' ');
  };
  const number = (v) => num.format(v);
  const pct = (v) => `${num.format(v)}%`;
  const distance = (km) => (country.distance === 'mi'
    ? `${num1.format(km * 0.621371)} mi`
    : `${num1.format(km)} km`);

  const dayOffset = (offsetDays) => new Date(today.getTime() + offsetDays * DAY);
  const pad = (n) => String(n).padStart(2, '0');
  /** Short date: Oct 29 (US) or 29 Oct, or 29.10. (DE). */
  const dateShort = (d) => {
    if (country.dateOrder === 'mdy') return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
    if (country.dateSep === '.') return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`;
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };
  /** Full numeric date in the country's order. */
  const date = (d) => {
    const sep = country.dateSep || '/';
    const [dd, mm, yy] = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()];
    return country.dateOrder === 'mdy' ? `${mm}${sep}${dd}${sep}${yy}` : `${dd}${sep}${mm}${sep}${yy}`;
  };
  const weekday = (d) => WEEKDAYS[d.getDay()];
  const daysAgo = (n) => (n === 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`);
  /** Clock time from minutes after midnight. */
  const time = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = Math.round(mins % 60);
    if (country.clock === '12h') {
      const h12 = ((h + 11) % 12) + 1;
      return `${h12}:${pad(m)} ${h < 12 ? 'am' : 'pm'}`;
    }
    return `${pad(h)}:${pad(m)}`;
  };

  return { money, price, moneyShort, number, pct, distance, date, dateShort, weekday, daysAgo, time, dayOffset, today };
}

export { DAY };
