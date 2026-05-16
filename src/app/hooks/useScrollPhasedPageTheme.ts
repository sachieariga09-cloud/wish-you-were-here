import { useEffect, useRef, type RefObject } from 'react';

type Phase = 'night' | 'dawn' | 'day' | 'dusk';

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
  day: '#F7F5F2',
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

/** Top bar only: navy on light “day” background; elsewhere matches body foreground. */
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

/** Live footer: navy on light/orange backgrounds, white on navy night. */
const FOOTER_FG: Record<Phase, string> = {
  night: '#ffffff',
  dawn: '#1e3a5f',
  day: '#1e3a5f',
  dusk: '#1e3a5f',
};

function applyVars(root: HTMLElement, phase: Phase) {
  root.dataset.scrollPhase = phase;
  root.style.setProperty('--page-bg', BG[phase]);
  root.style.setProperty('--page-fg', FG[phase]);
  root.style.setProperty('--page-fg-strong', FG_STRONG[phase]);
  root.style.setProperty('--page-muted', MUTED[phase]);
  root.style.setProperty('--page-header-fg', HEADER_FG[phase]);
  root.style.setProperty('--page-header-fg-strong', HEADER_FG_STRONG[phase]);
  root.style.setProperty('--page-footer-fg', FOOTER_FG[phase]);
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
}

function findDominantCityCard(scrollRoot: HTMLElement): HTMLElement | null {
  const cards = scrollRoot.querySelectorAll<HTMLElement>('[data-city-card]');
  if (!cards.length) return null;

  const vh = window.innerHeight;
  const mid = vh / 2;
  let best: HTMLElement | null = null;
  let bestScore = -1;

  cards.forEach((el) => {
    const r = el.getBoundingClientRect();
    const visible = r.bottom > 8 && r.top < vh - 8;
    if (!visible) return;
    const center = r.top + r.height / 2;
    const dist = Math.abs(center - mid);
    const score = (1 / (1 + dist)) * Math.min(r.height, vh);
    if (score > bestScore) {
      bestScore = score;
      best = el;
    }
  });

  return best;
}

export function useScrollPhasedPageTheme(
  scrollRoot: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const lastPhaseRef = useRef<Phase | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = scrollRoot.current;
    if (!root) return;

    const recompute = () => {
      const dominant = findDominantCityCard(root);
      if (!dominant) return;

      const raw = dominant.dataset.utcOffset;
      if (raw === undefined || raw === '') return;

      const offset = parseFloat(raw);
      if (Number.isNaN(offset)) return;

      const localM = localMinutesSinceMidnight(offset);
      const phase = phaseFromLocalMinutes(localM);

      if (lastPhaseRef.current === phase) return;
      lastPhaseRef.current = phase;
      applyVars(root, phase);
    };

    let raf = 0;
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        recompute();
      });
    };

    root.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const clockId = window.setInterval(schedule, 30_000);

    schedule();
    requestAnimationFrame(recompute);

    return () => {
      root.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.clearInterval(clockId);
      if (raf) cancelAnimationFrame(raf);
      lastPhaseRef.current = null;
      clearVars(root);
    };
  }, [enabled, scrollRoot]);
}
