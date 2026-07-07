import type { CSSProperties } from 'react';
import { useState, useEffect, useRef } from 'react';
import { PostcardLanding } from './components/PostcardLanding';
import { LoadingScreen } from './components/LoadingScreen';
import { LiveFeed } from './components/LiveFeed';
import { Gallery } from './components/Gallery';
import { TopNav } from './components/TopNav';
import { LiveHeaderClock } from './components/LiveHeaderClock';
import { RareTextFragment } from './components/RareTextFragment';
import { IdleState } from './components/IdleState';
import { useScrollPhasedPageTheme } from './hooks/useScrollPhasedPageTheme';
import { getUtcOffsetHoursForTimezone } from './utils/utcOffsetFromTimezone';
import { useIsMobile } from './components/ui/use-mobile';

type ViewState = 'entry' | 'loading' | 'live' | 'gallery';

/** Source list; scroll order is derived by sorting on current UTC offset (east → west). */
const cityDefinitions = [
  {
    name: 'Tokyo',
    videoId: '8H3nRCFVR6Y',
    timezone: 'Asia/Tokyo',
    temperature: 18,
    lat: 35.6595,
    lon: 139.7004,
  },
  {
    name: 'Paris',
    videoId: 'OzYp4NRZlwQ',
    timezone: 'Europe/Paris',
    temperature: 12,
    lat: 48.8566,
    lon: 2.3522,
  },
  {
    name: 'New York',
    videoId: 'z-jYdOIKcTQ',
    timezone: 'America/New_York',
    temperature: 8,
    lat: 40.7128,
    lon: -74.006,
  },
  {
    name: 'Los Angeles',
    videoId: 'EO_1LWqsCNE',
    timezone: 'America/Los_Angeles',
    temperature: 16,
    lat: 34.0522,
    lon: -118.2437,
  },
  {
    name: 'Dublin',
    videoId: '3nyPER2kzqk',
    timezone: 'Europe/Dublin',
    temperature: 10,
    lat: 53.3498,
    lon: -6.2603,
  },
  {
    name: 'Cape Town',
    // https://www.youtube.com/live/khhdEM2Q_68?si=lUpGuh1r6KhxEnYY
    videoId: 'khhdEM2Q_68',
    isLive: true,
    embedShareId: 'lUpGuh1r6KhxEnYY',
    timezone: 'Africa/Johannesburg',
    temperature: 22,
    lat: -33.9249,
    lon: 18.4241,
  },
  {
    name: 'Sydney',
    videoId: '5uZa3-RMFos',
    timezone: 'Australia/Sydney',
    temperature: 24,
    lat: -33.8688,
    lon: 151.2093,
  },
  {
    name: 'Taipei',
    videoId: 'Ndo_8RuefH4',
    timezone: 'Asia/Taipei',
    temperature: 20,
    lat: 25.033,
    lon: 121.5654,
  },
];

const cities = [...cityDefinitions].sort((a, b) => {
  const offA = getUtcOffsetHoursForTimezone(a.timezone);
  const offB = getUtcOffsetHoursForTimezone(b.timezone);
  if (offB !== offA) return offB - offA;
  return a.name.localeCompare(b.name);
});

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('entry');
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [landingKey, setLandingKey] = useState(0);
  const liveScrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useScrollPhasedPageTheme(liveScrollRef, viewState === 'live');

  useEffect(() => {
    if (viewState !== 'live' || !isMobile) return;

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
  }, [viewState, isMobile]);

  useEffect(() => {
    if (viewState !== 'live') return;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [viewState]);

  useEffect(() => {
    if (viewState === 'loading') {
      const timer = setTimeout(() => {
        setViewState('live');
      }, 2700);
      return () => clearTimeout(timer);
    }
  }, [viewState]);

  const handleSendPostcard = () => {
    setViewState('loading');
  };

  const handleReturnToLanding = () => {
    setViewState('entry');
    setLandingKey((prev) => prev + 1);
  };

  const handleNavigate = (page: 'entry' | 'gallery' | 'live') => {
    if (page === 'entry') {
      handleReturnToLanding();
      return;
    }
    if (page === 'gallery') {
      setViewState('gallery');
      return;
    }
    setViewState('live');
  };

  if (viewState === 'entry') {
    return <PostcardLanding key={landingKey} onSend={handleSendPostcard} />;
  }

  if (viewState === 'gallery') {
    return <Gallery onNavigate={handleNavigate} />;
  }

  if (viewState === 'loading') {
    return <LoadingScreen />;
  }

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
        onNavigate={handleNavigate}
        variant="live"
        trailing={
          <LiveHeaderClock />
        }
      />

      {/* Mobile: vertical feed */}
      <div className="md:hidden pt-24 pb-2 px-0">
        {cities.map((city, index) => (
          <LiveFeed
            key={city.name}
            city={city.name}
            videoId={city.videoId}
            isLive={city.isLive}
            embedShareId={city.embedShareId}
            timezone={city.timezone}
            temperature={city.temperature}
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

      {/* Desktop: one stream per row */}
      <div className="hidden md:flex flex-col items-center pt-24 pb-4 px-12">
        {cities.map((city, index) => (
          <div key={city.name} className="w-full max-w-[520px] mb-10 last:mb-16">
            <LiveFeed
              city={city.name}
              videoId={city.videoId}
              isLive={city.isLive}
              embedShareId={city.embedShareId}
              timezone={city.timezone}
              temperature={city.temperature}
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

      {/* Rare text fragments */}
      <RareTextFragment />

      {/* Idle state (optional) */}
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