import type { ReactNode } from 'react';

type NavPage = 'entry' | 'gallery' | 'live';

interface TopNavProps {
  current: NavPage;
  onNavigate: (page: NavPage) => void;
  trailing?: ReactNode;
  /** Hide the home link (e.g. live feed intro overlay). */
  hideHome?: boolean;
  variant?: 'light' | 'dark' | 'live';
}

const linkBase =
  'font-instrument-serif cursor-pointer text-sm font-normal tracking-wider transition-colors duration-300 [letter-spacing:0.08em]';

export function TopNav({
  current,
  onNavigate,
  trailing,
  hideHome = false,
  variant = 'light',
}: TopNavProps) {
  const isDark = variant === 'dark' || variant === 'live';
  const homeColor =
    variant === 'live'
      ? 'var(--page-header-fg, #1e3a5f)'
      : isDark
        ? '#f0ece4'
        : '#1e3a5f';
  const mutedColor =
    variant === 'live'
      ? 'var(--page-header-fg, #1e3a5f)'
      : isDark
        ? 'rgba(240, 236, 228, 0.55)'
        : 'rgba(30, 58, 95, 0.55)';
  const activeColor =
    variant === 'live' ? 'var(--page-header-fg-strong, #0d1b2a)' : isDark ? '#ffffff' : '#0d1b2a';

  const navLink = (page: NavPage, label: string) => {
    const isActive = current === page;
    return (
      <button
        type="button"
        onClick={() => onNavigate(page)}
        className={`${linkBase} border-0 bg-transparent p-0`}
        style={{
          color: isActive ? activeColor : mutedColor,
          opacity: isActive ? 1 : 0.85,
        }}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </button>
    );
  };

  return (
    <nav
      className="pointer-events-none fixed top-6 left-0 right-0 z-50 flex items-baseline justify-between gap-4 px-4 md:px-12"
      aria-label="Main"
    >
      <div className="pointer-events-auto flex min-w-0 flex-1 items-baseline gap-5 md:gap-8">
        {!hideHome && (
          <button
            type="button"
            onClick={() => onNavigate('entry')}
            className={`${linkBase} border-0 bg-transparent p-0`}
            style={{ color: homeColor, opacity: current === 'entry' ? 1 : 0.85 }}
            aria-current={current === 'entry' ? 'page' : undefined}
          >
            Wish You Were Here
          </button>
        )}
        {navLink('gallery', 'Gallery')}
      </div>
      {trailing && (
        <div className="pointer-events-auto shrink-0">{trailing}</div>
      )}
    </nav>
  );
}
