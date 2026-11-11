// Capture overlay for the narrated demo video. Injected with page.addInitScript.
// Draws: enlarged phone, chapter panel (left), caption panel (right), cursor,
// focus ring that tracks its target, click ripple, full-screen cards.
// It changes presentation only. App behaviour and data are untouched.
(() => {
  if (window.__demo) return;
  const CSS = `
  .phone { transform: scale(var(--demo-scale, 1.15)); transform-origin: top center; }
  .try-case-btn, .lab-btn { visibility: hidden !important; }
  html.demo-compact .acting-as-bar { display: none !important; }
  html.demo-show-lab .lab-btn { visibility: visible !important; }
  html, body { scrollbar-width: none; }
  ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
  #demo-layer { position: fixed; inset: 0; pointer-events: none; z-index: 2147483000; font-family: var(--font-ui, Inter, system-ui, sans-serif); color: #17212F; }
  #demo-chapter { position: absolute; left: 96px; top: 50%; transform: translateY(-50%); width: 560px; transition: opacity .45s ease; }
  #demo-chapter .k { font-size: 18px; letter-spacing: .14em; text-transform: uppercase; color: #0F766E; font-weight: 700; }
  #demo-chapter .t { font-size: 46px; line-height: 1.12; font-weight: 750; margin-top: 14px; letter-spacing: -.01em; }
  #demo-chapter .p { font-size: 22px; line-height: 1.4; color: #4B5768; margin-top: 18px; }
  #demo-foot { position: absolute; left: 96px; bottom: 48px; font-size: 16px; color: #5B6778; letter-spacing: .02em; }
  #demo-foot b { color: #17212F; }
  #demo-cap { position: absolute; left: 1262px; top: 50%; transform: translateY(-50%); width: 580px; font-size: 30px; line-height: 1.42; font-weight: 500; border-left: 4px solid #0F766E; padding: 6px 0 6px 26px; transition: opacity .25s ease; }
  #demo-cap:empty { opacity: 0; }
  #demo-cursor { position: absolute; left: 0; top: 0; width: 30px; height: 30px; transform: translate(960px, 1200px); transition: transform .62s cubic-bezier(.45,.05,.25,1); filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
  #demo-ring { position: absolute; border: 3px solid #0F766E; border-radius: 14px; box-shadow: 0 0 0 6px rgba(15,118,110,.18), 0 0 0 9999px rgba(15,23,42,.14); opacity: 0; transition: opacity .3s ease; }
  #demo-ripple { position: absolute; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; border: 3px solid #0F766E; opacity: 0; }
  #demo-ripple.go { animation: demoRip .5s ease-out; }
  @keyframes demoRip { from { opacity: .9; transform: scale(1); } to { opacity: 0; transform: scale(3.2); } }
  #demo-card { position: absolute; inset: 0; background: #0E1B24; color: #fff; display: flex; flex-direction: column; justify-content: center; padding: 0 160px; opacity: 0; transition: opacity .6s ease; }
  #demo-card.on { opacity: 1; }
  #demo-card .k { font-size: 22px; letter-spacing: .16em; text-transform: uppercase; color: #5EEAD4; font-weight: 700; }
  #demo-card .t { font-size: 76px; font-weight: 780; line-height: 1.05; margin-top: 22px; letter-spacing: -.02em; }
  #demo-card .s { font-size: 32px; line-height: 1.4; color: #C9D6E2; margin-top: 26px; max-width: 1300px; }
  #demo-card .f { font-size: 22px; color: #8FA3B6; margin-top: 56px; }
  `;
  const style = document.createElement('style');
  style.textContent = CSS;
  const layer = document.createElement('div');
  layer.id = 'demo-layer';
  layer.innerHTML = `
    <div id="demo-ring"></div>
    <div id="demo-chapter"><div class="k"></div><div class="t"></div><div class="p"></div></div>
    <div id="demo-foot"><b>AI Assistor</b> · working prototype · synthetic data</div>
    <div id="demo-cap"></div>
    <div id="demo-ripple"></div>
    <svg id="demo-cursor" viewBox="0 0 24 24"><path d="M4 2.5 L4 19.5 L8.6 15.4 L11.7 22 L14.6 20.7 L11.6 14.2 L17.8 14.2 Z" fill="#fff" stroke="#17212F" stroke-width="1.6" stroke-linejoin="round"/></svg>
    <div id="demo-card"></div>`;
  const mount = () => {
    if (!document.documentElement) return;
    if (!style.isConnected) document.documentElement.appendChild(style);
    if (!layer.isConnected) document.documentElement.appendChild(layer);
  };
  new MutationObserver(mount).observe(document, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', mount);
  mount();

  const $ = (id) => layer.querySelector('#' + id);
  let target = null, pad = 6;
  const tick = () => {
    const ring = $('demo-ring');
    if (target && target.isConnected) {
      const r = target.getBoundingClientRect();
      Object.assign(ring.style, { left: (r.left - pad) + 'px', top: (r.top - pad) + 'px', width: (r.width + pad * 2) + 'px', height: (r.height + pad * 2) + 'px', opacity: 1 });
    } else ring.style.opacity = 0;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const scrollParent = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 2) return n;
    }
    return null;
  };

  window.__demo = {
    chapter(k, t, p) { mount(); $('demo-chapter').querySelector('.k').textContent = k || ''; $('demo-chapter').querySelector('.t').textContent = t || ''; $('demo-chapter').querySelector('.p').textContent = p || ''; },
    caption(text) { mount(); $('demo-cap').textContent = text || ''; },
    cursor(x, y) { $('demo-cursor').style.transform = `translate(${x - 5}px, ${y - 3}px)`; },
    ripple(x, y) { const r = $('demo-ripple'); r.classList.remove('go'); r.style.left = x + 'px'; r.style.top = y + 'px'; void r.offsetWidth; r.classList.add('go'); },
    focus(el, p = 6) { target = el || null; pad = p; },
    // Eased scroll of the element's scroll container so the element sits at `align` of the visible area.
    scrollTo(el, align = 0.32, ms = 750) {
      const sp = scrollParent(el);
      if (!sp) return 0;
      const pr = sp.getBoundingClientRect(), er = el.getBoundingClientRect();
      const scale = pr.height / sp.clientHeight || 1;
      const delta = ((er.top - pr.top) - pr.height * align) / scale;
      const from = sp.scrollTop, to = Math.max(0, Math.min(sp.scrollHeight - sp.clientHeight, from + delta));
      if (Math.abs(to - from) < 4) return 0;
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        sp.scrollTop = from + (to - from) * e;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      return ms;
    },
    card(html) { const c = $('demo-card'); if (html) { c.innerHTML = html; c.classList.add('on'); } else c.classList.remove('on'); },
    compact(on) { document.documentElement.classList.toggle('demo-compact', !!on); },
    showLab(on) { document.documentElement.classList.toggle('demo-show-lab', !!on); },
  };
})();
