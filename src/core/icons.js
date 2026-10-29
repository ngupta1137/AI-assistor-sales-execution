// Brand-neutral line icons (24x24, stroke). Packs refer to them by key.
const P = {
  cart: '<path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6.2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  pill: '<rect x="3" y="9" width="18" height="7" rx="3.5" transform="rotate(-35 12 12.5)"/><path d="M9.2 8.4l5.6 8"/>',
  pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  glass: '<path d="M7 3h10l-1.2 8.5a3.9 3.9 0 0 1-7.6 0z"/><path d="M12 15v6M8.5 21h7M7.6 8h8.8"/>',
  roller: '<rect x="4" y="3" width="13" height="5" rx="1.5"/><path d="M17 5.5h2.5V11H11v3"/><rect x="9.5" y="14" width="3" height="7" rx="1"/>',
  sprout: '<path d="M12 21v-9"/><path d="M12 12C12 7.5 9 5 4.5 5c0 4.5 3 7 7.5 7z"/><path d="M12 14c0-4 2.5-6.5 7.5-6.5 0 4-2.5 6.5-7.5 6.5z"/>',
  signal: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10 7h4M9.5 17h5"/><path d="M9 13v-2M12 13v-3.5M15 13V9"/>',
  screen: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-1.5 1.5-1.3-1.3L9 22.4 6.6 20 15.8 10.8l-1.3-1.3L16 8z" transform="translate(-2 -2)"/>',
  bank: '<path d="M3 9l9-5 9 5"/><path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8M3 20h18"/>',
  // UI icons
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
  brief: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v3h6V3M8.5 11h7M8.5 15h5"/>',
  agent: '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 3v4M9.5 12h.01M14.5 12h.01M9.5 15h5"/>',
  config: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  team: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.3A4.5 4.5 0 0 1 21 19"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  pen: '<path d="M3 21c3-1 5-3 7-5M14 4l6 6-8 8-6-6z"/>',
  note: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
  scan: '<path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M8 9v6M11 9v6M14 9v6M17 9v6"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
  play: '<path d="M8 5l11 7-11 7z"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  ask: '<path d="M4 5h16v11H9l-5 4z"/><path d="M10 9.3a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6 1v.3M12 14.5h.01"/>',
};

export function icon(name, size = 22, extra = '') {
  const body = P[name] || P.flag;
  return `<svg class="ic ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export const ICON_KEYS = Object.keys(P);
