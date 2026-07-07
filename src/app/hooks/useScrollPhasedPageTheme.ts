import { useEffect, useRef, type RefObject } from 'react';

type Phase = 'night' | 'dawn' | 'day' | 'dusk';

type ThemeVars = {
  phase: Phase;
  bg: string;
  fg: string;
  fgStrong: string;
  muted: string;
  headerFg: string;
  headerFgStrong: string;
  footerFg: string;
};

function localMinutesSinceMidnight(utcOffsetHours: number, d = new Date()): number {
  const utcMin = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
  let local = utcMin + utcOffsetHours * 60;
  local = ((local % (24 * 60)) + 24 * 60) % (24 * 60);
  return local;
}

function phaseFromLocalMinutes(m: number): Phase {
  if (m < 300) return 'night';
  if (m < 450) return 'dawn';
  if (m < 1080) return 'day';
  if (m < 1230) return 'dusk';
  return 'night';
}

const BG: Record<Phase, string> = {
  night: '#0d1b2a',
  dawn: '#ffc39c',
  day: '#E8F1F8',
  dusk: '#ffc39c',
};

const FG: Record<Phase, string> = {
  night: '#f0ece4',
  dawn: '#2f2926',
  day: '#333333',
  dusk: '#2f2926',
};

const FG_STRONG: Record<Phase, string> = {
  night: '#ffffff',
  dawn: '#1a1614',
  day: '#111111',
  dusk: '#1a1614',
};

const MUTED: Record<Phase, string> = {
  night: 'rgba(240, 236, 228, 0.72)',
  dawn: 'rgba(47, 41, 38, 0.62)',
  day: '#666666',
  dusk: 'rgba(47, 41, 38, 0.62)',
};

const HEADER_FG: Record<Phase, string> = {
  night: '#f0ece4',
  dawn: '#2f2926',
  day: '#1e3a5f',
  dusk: '#2f2926',
};

const HEADER_FG_STRONG: Record<Phase, string> = {
  night: '#ffffff',
  dawn: '#1a1614',
  day: '#0d1b2a',
  dusk: '#1a1614',
};

const FOOTER_FG: Record<Phase, string> = {
  night: '#ffffff',
  dawn: '#1e3a5f',
  day: '#1e3a5f',
  dusk: '#1e3a5f',
};

function themeForUtcOffset(offset: number): ThemeVars {
  const phase = phaseFromLocalMinutes(localMinutesSinceMidnight(offset));
  return {
    phase,
    bg: BG[phase],
    fg: FG[phase],
    fgStrong: FG_STRONG[phase],
    muted: MUTED[phase],
    headerFg: HEADER_FG[phase],
    headerFgStrong: HEADER_FG_STRONG[phase],
    footerFg: FOOTER_FG[phase],
  };
}

function parseCssColor(input: string): [number, number, number, number] {
  const s = input.trim();
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    const full =
      hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgba = s.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (rgba) {
    return [+rgba[1], +rgba[2], +rgba[3], rgba[4] !== undefined ? +rgba[4] : 1];
  }
  return [0, 0, 0, 1];
}

function lerpColor(c1: string, c2: string, t: number): string {
  if (t <= 0) return c1;
  if (t >= 1) return c2;
  const [r1, g1, b1, a1] = parseCssColor(c1);
  const [r2, g2, b2, a2] = parseCssColor(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  const a = a1 + (a2 - a1) * t;
  if (a >= 0.999 && a1 >= 0.999 && a2 >= 0.999) {
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function nightStarsOpacity(phase: Phase): number {
  return phase === 'night' ? 1 : 0;
}

function applyBlended(root: HTMLElement, a: ThemeVars, b: ThemeVars, t: number) {
  const blend = smoothstep(t);
  const phase = blend < 0.5 ? a.phase : b.phase;
  root.dataset.scrollPhase = phase;
  root.style.setProperty('--page-bg', lerpColor(a.bg, b.bg, blend));
  root.style.setProperty('--page-fg', lerpColor(a.fg, b.fg, blend));
  root.style.setProperty('--page-fg-strong', lerpColor(a.fgStrong, b.fgStrong, blend));
  root.style.setProperty('--page-muted', lerpColor(a.muted, b.muted, blend));
  root.style.setProperty('--page-header-fg', lerpColor(a.headerFg, b.headerFg, blend));
  root.style.setProperty(
    '--page-header-fg-strong',
    lerpColor(a.headerFgStrong, b.headerFgStrong, blend),
  );
  root.style.setProperty('--page-footer-fg', lerpColor(a.footerFg, b.footerFg, blend));
  root.style.setProperty(
    '--stars-opacity',
    String(
      nightStarsOpacity(a.phase) + (nightStarsOpacity(b.phase) - nightStarsOpacity(a.phase)) * blend,
    ),
  );
}

function clearVars(root: HTMLElement) {
  delete root.dataset.scrollPhase;
  root.style.removeProperty('--page-bg');
  root.style.removeProperty('--page-fg');
  root.style.removeProperty('--page-fg-strong');
  root.style.removeProperty('--page-muted');
  root.style.removeProperty('--page-header-fg');
  root.style.removeProperty('--page-header-fg-strong');
  root.style.removeProperty('--page-footer-fg');
  root.style.removeProperty('--stars-opacity');
}

function getCardTheme(card: HTMLElement): ThemeVars | null {
  const raw = card.dataset.utcOffset;
  if (raw === undefined || raw === '') return null;
  const offset = parseFloat(raw);
  if (Number.isNaN(offset)) return null;
  return themeForUtcOffset(offset);
}

type CardEntry = {
  centerY: number; // relative to scrollRoot scrollTop coordinates
  theme: ThemeVars;
};

function buildCardEntries(scrollRoot: HTMLElement): CardEntry[] {
  const cards = scrollRoot.querySelectorAll<HTMLElement>('[data-city-card]');
  if (!cards.length) return [];

  const entries: CardEntry[] = [];

  cards.forEach((el) => {
    const theme = getCardTheme(el);
    if (!theme) return;
    // offsetTop/offsetHeight are relative to the scroll container and avoid
    // per-scroll viewport layout reads.
    const top = el.offsetTop;
    const height = el.offsetHeight || 0;
    entries.push({ centerY: top + height / 2, theme });
  });

  entries.sort((a, b) => a.centerY - b.centerY);
  return entries;
}

function findScrollBlendFromEntries(
  entries: CardEntry[],
  scrollRoot: HTMLElement,
): { a: ThemeVars; b: ThemeVars; t: number } | null {
  if (!entries.length) return null;
  const midY = scrollRoot.scrollTop + scrollRoot.clientHeight / 2;

  if (entries.length === 1) {
    return { a: entries[0].theme, b: entries[0].theme, t: 0 };
  }

  // Find the pair of entries surrounding midY.
  for (let i = 0; i < entries.length - 1; i++) {
    const y0 = entries[i].centerY;
    const y1 = entries[i + 1].centerY;
    if (midY >= y0 && midY <= y1) {
      const span = y1 - y0;
      const t = span <= 0 ? 0 : (midY - y0) / span;
      return { a: entries[i].theme, b: entries[i + 1].theme, t };
    }
  }

  if (midY < entries[0].centerY) {
    return { a: entries[0].theme, b: entries[0].theme, t: 0 };
  }

  const last = entries[entries.length - 1];
  return { a: last.theme, b: last.theme, t: 0 };
}

export function useScrollPhasedPageTheme(
  scrollRoot: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const entriesRef = useRef<CardEntry[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const root = scrollRoot.current;
    if (!root) return;

    const recompute = () => {
      const blend = findScrollBlendFromEntries(entriesRef.current, root);
      if (!blend) return;
      applyBlended(root, blend.a, blend.b, blend.t);
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        recompute();
      });
    };

    const rebuildEntries = () => {
      entriesRef.current = buildCardEntries(root);
      schedule();
    };

    root.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', rebuildEntries);
    const clockId = window.setInterval(schedule, 30_000);

    rebuildEntries();
    recompute();

    // Fonts and late-loading embeds can shift layout after first paint.
    // Rebuild once shortly after mount to keep blending accurate.
    const lateLayoutId = window.setTimeout(rebuildEntries, 800);

    return () => {
      root.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', rebuildEntries);
      window.clearInterval(clockId);
      window.clearTimeout(lateLayoutId);
      if (raf) cancelAnimationFrame(raf);
      clearVars(root);
    };
  }, [enabled, scrollRoot]);
}
