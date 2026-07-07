import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cities } from '../cityDefinitions';
import { useScrollPhasedPageTheme } from '../hooks/useScrollPhasedPageTheme';
import { useIsMobile } from './ui/use-mobile';
import { LiveFeed } from './LiveFeed';
import { TopNav } from './TopNav';
import { LiveHeaderClock } from './LiveHeaderClock';
import { RareTextFragment } from './RareTextFragment';
import { IdleState } from './IdleState';

type NavigateFn = (page: 'entry' | 'gallery' | 'live') => void;

interface LiveFeedPageProps {
  onNavigate: NavigateFn;
}

export function LiveFeedPage({ onNavigate }: LiveFeedPageProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const liveScrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useScrollPhasedPageTheme(liveScrollRef, true);

  useEffect(() => {
    if (!isMobile) return;

    const root = liveScrollRef.current;
    if (!root) return;

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (root.scrollTop > 2) return;
      const y = e.touches[0]?.clientY ?? 0;
      if (y > touchStartY + 20) {
        e.preventDefault();
      }
    };

    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchmove', onTouchMove);
    };
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={liveScrollRef}
      className="live-feed-shell size-full overflow-auto"
      style={
        {
          '--page-bg': '#E8F1F8',
          '--page-fg': '#333333',
          '--page-fg-strong': '#111111',
          '--page-muted': '#666666',
          '--page-header-fg': '#1e3a5f',
          '--page-header-fg-strong': '#0d1b2a',
          '--page-footer-fg': '#1e3a5f',
          backgroundColor: 'var(--page-bg)',
          color: 'var(--page-fg)',
          scrollBehavior: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        } as CSSProperties
      }
    >
      <TopNav
        current="live"
        onNavigate={onNavigate}
        variant="live"
        trailing={<LiveHeaderClock />}
      />

      <div className="md:hidden pt-24 pb-2 px-0">
        {cities.map((city, index) => (
          <LiveFeed
            key={city.name}
            city={city.name}
            videoId={city.videoId}
            isLive={'isLive' in city ? city.isLive : undefined}
            embedShareId={'embedShareId' in city ? city.embedShareId : undefined}
            timezone={city.timezone}
            lat={city.lat}
            lon={city.lon}
            isFocused={focusedIndex === index}
            onTap={() => setFocusedIndex(focusedIndex === index ? null : index)}
            onPressStart={() => {}}
            onPressEnd={() => {}}
            isLast={index === cities.length - 1}
          />
        ))}
      </div>

      <div className="hidden md:flex flex-col items-center pt-24 pb-4 px-12">
        {cities.map((city, index) => (
          <div key={city.name} className="w-full max-w-[520px] mb-12 last:mb-16">
            <LiveFeed
              city={city.name}
              videoId={city.videoId}
              isLive={'isLive' in city ? city.isLive : undefined}
              embedShareId={'embedShareId' in city ? city.embedShareId : undefined}
              timezone={city.timezone}
              lat={city.lat}
              lon={city.lon}
              isFocused={focusedIndex === index || hoveredIndex === index}
              onTap={() => setFocusedIndex(focusedIndex === index ? null : index)}
              onHover={(isHovered) => setHoveredIndex(isHovered ? index : null)}
              onPressStart={() => {}}
              onPressEnd={() => {}}
              isLast={index === cities.length - 1}
            />
          </div>
        ))}
      </div>

      <RareTextFragment />
      <IdleState timeout={180000} />

      <footer
        className="live-feed-footer shrink-0 px-4 pb-10 pt-2 text-center md:px-12"
        aria-label="Credits"
      >
        <p
          className="font-instrument-serif mx-auto max-w-md text-[1.0625rem] font-normal leading-relaxed tracking-wide transition-colors duration-700 ease-in-out md:text-[1.1875rem]"
          style={{ color: 'var(--page-footer-fg, #1e3a5f)' }}
        >
          Made in Tokyo, sent to wherever you are.
          <br />
          <span className="mt-1.5 inline-block text-[0.9375rem] font-normal tracking-wide md:text-[1.0625rem]">
            Love, Sachie
          </span>
        </p>
      </footer>
    </div>
  );
}
