import type { CSSProperties } from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PostcardLanding } from './components/PostcardLanding';
import { LoadingScreen } from './components/LoadingScreen';
import { LiveFeed } from './components/LiveFeed';
import { RareTextFragment } from './components/RareTextFragment';
import { IdleState } from './components/IdleState';
import { useScrollPhasedPageTheme } from './hooks/useScrollPhasedPageTheme';
import { getUtcOffsetHoursForTimezone } from './utils/utcOffsetFromTimezone';

type ViewState = 'entry' | 'loading' | 'live';

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
    videoId: 'IGu55JrxyHU',
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
  const [showNarrativeText, setShowNarrativeText] = useState(true);
  const [landingKey, setLandingKey] = useState(0);
  const [localTime, setLocalTime] = useState(() =>
    new Date().toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
  );
  const liveScrollRef = useRef<HTMLDivElement>(null);
  useScrollPhasedPageTheme(liveScrollRef, viewState === 'live');

  useEffect(() => {
    if (viewState !== 'live') return;

    const tick = () => {
      setLocalTime(
        new Date().toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [viewState]);

  useEffect(() => {
    if (viewState === 'loading') {
      const timer = setTimeout(() => {
        setViewState('live');
      }, 2700);
      return () => clearTimeout(timer);
    }
  }, [viewState]);

  useEffect(() => {
    if (viewState === 'live') {
      const timer = setTimeout(() => {
        setShowNarrativeText(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [viewState]);

  const handleSendPostcard = () => {
    setViewState('loading');
  };

  const handleReturnToLanding = () => {
    setViewState('entry');
    setShowNarrativeText(true);
    setLandingKey((prev) => prev + 1);
  };

  if (viewState === 'entry') {
    return <PostcardLanding key={landingKey} onSend={handleSendPostcard} />;
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
          '--page-bg': '#F7F5F2',
          '--page-fg': '#333333',
          '--page-fg-strong': '#111111',
          '--page-muted': '#666666',
          '--page-header-fg': '#1e3a5f',
          '--page-header-fg-strong': '#0d1b2a',
          '--page-footer-fg': '#1e3a5f',
          backgroundColor: 'var(--page-bg)',
          color: 'var(--page-fg)',
          transition: 'background-color 0.7s ease, color 0.7s ease',
          scrollBehavior: 'smooth',
        } as CSSProperties
      }
    >
      {/* Narrative text overlay */}
      <AnimatePresence>
        {showNarrativeText && (
          <motion.div
            className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.12 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-instrument-serif tracking-wider text-[1.125rem] font-normal [letter-spacing:0.08em] transition-colors duration-700 ease-in-out"
              style={{ color: 'var(--page-fg, #333)' }}
            >
              Wish You Were Here
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar: ghost link (left) + local time (right), same row */}
      <div className="pointer-events-none fixed top-6 left-0 right-0 z-30 flex items-baseline justify-between gap-4 px-4 md:px-12">
        <div className="min-w-0 flex-1">
          {!showNarrativeText && (
            <motion.div
              className="pointer-events-auto inline-block cursor-pointer group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={handleReturnToLanding}
            >
              <p
                className="font-instrument-serif tracking-wider text-sm font-normal transition-colors duration-700 ease-in-out [letter-spacing:0.08em] group-hover:[color:var(--page-header-fg-strong,#0d1b2a)]"
                style={{ color: 'var(--page-header-fg, #1e3a5f)' }}
              >
                Wish You Were Here
              </p>
            </motion.div>
          )}
        </div>
        <p
          className="font-instrument-serif shrink-0 text-sm font-normal tabular-nums tracking-wider transition-colors duration-700 ease-in-out [letter-spacing:0.06em]"
          style={{ color: 'var(--page-header-fg, #1e3a5f)' }}
          aria-live="polite"
        >
          {localTime}
        </p>
      </div>

      {/* Mobile: Vertical feed - limit initial render for performance */}
      <div className="md:hidden pt-24 pb-2 px-0">
        {cities.slice(0, 3).map((city, index) => (
          <LiveFeed
            key={city.name}
            city={city.name}
            videoId={city.videoId}
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
        {cities.slice(3).map((city, index) => (
          <LiveFeed
            key={city.name}
            city={city.name}
            videoId={city.videoId}
            timezone={city.timezone}
            temperature={city.temperature}
            lat={city.lat}
            lon={city.lon}
            isFocused={focusedIndex === index + 3}
            onTap={() => setFocusedIndex(focusedIndex === index + 3 ? null : index + 3)}
            onPressStart={() => {}}
            onPressEnd={() => {}}
            isLast={index + 3 === cities.length - 1}
          />
        ))}
      </div>

      {/* Desktop: Loose grid */}
      <div className="hidden md:flex flex-wrap justify-center items-start pt-24 pb-4 px-12">
        {cities.map((city, index) => (
          <div
            key={city.name}
            style={{
              marginLeft: index % 2 === 0 ? '0' : '2rem',
              marginRight: index % 2 === 0 ? '2rem' : '0',
              marginTop: index === 0 ? '0' : index % 3 === 0 ? '3rem' : '1rem',
              marginBottom: '1rem',
            }}
          >
            <LiveFeed
              city={city.name}
              videoId={city.videoId}
              timezone={city.timezone}
              temperature={city.temperature}
              lat={city.lat}
              lon={city.lon}
              isFocused={focusedIndex === index || hoveredIndex === index}
              onTap={() => setFocusedIndex(focusedIndex === index ? null : index)}
              onHover={(isHovered) => setHoveredIndex(isHovered ? index : null)}
              onPressStart={() => {}}
              onPressEnd={() => {}}
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