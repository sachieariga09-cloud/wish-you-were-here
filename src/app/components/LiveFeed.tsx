import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { LiveVideo } from './LiveVideo';
import { CityMapPopup } from './CityMapPopup';
import { getUtcOffsetHoursForTimezone } from '../utils/utcOffsetFromTimezone';
import { useIsMobile } from './ui/use-mobile';

interface LiveFeedProps {
  city: string;
  videoId: string;
  isLive?: boolean;
  embedShareId?: string;
  timezone: string;
  temperature: number;
  lat: number;
  lon: number;
  isFocused: boolean;
  onTap: () => void;
  onHover?: (isHovered: boolean) => void;
  onPressStart: () => void;
  onPressEnd: () => void;
  /** Tighter gap to footer on mobile when this is the last city in the feed */
  isLast?: boolean;
  /** @deprecated Mobile loads video when scrolled into view. */
  videoEnabled?: boolean;
  feedIndex?: number;
  onFeedVisibility?: (index: number, ratio: number) => void;
}
export function LiveFeed({
  city,
  videoId,
  isLive = false,
  embedShareId,
  timezone,
  temperature,
  lat,
  lon,
  isFocused,
  onTap,
  onHover,
  onPressStart,
  onPressEnd,
  isLast = false,
  feedIndex,
  onFeedVisibility,
}: LiveFeedProps) {
  const [time, setTime] = useState('');
  const [isFrozen, setIsFrozen] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [mountVideo, setMountVideo] = useState(false);
  const [mapPopupOpen, setMapPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cityAnchorRef = useRef<HTMLSpanElement>(null);
  const inViewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (inViewDebounceRef.current) clearTimeout(inViewDebounceRef.current);
        inViewDebounceRef.current = setTimeout(
          () => {
            setIsInView(entry.isIntersecting);
            if (feedIndex !== undefined) {
              onFeedVisibility?.(feedIndex, entry.intersectionRatio);
            }
          },
          isMobile ? 250 : 0,
        );
      },
      isMobile
        ? { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '0px 0px -10% 0px' }
        : { threshold: 0.55 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (inViewDebounceRef.current) clearTimeout(inViewDebounceRef.current);
    };
  }, [isMobile, feedIndex, onFeedVisibility]);

  useEffect(() => {
    if (isInView) setMountVideo(true);
  }, [isInView]);

  const showVideo = !isMobile || mountVideo;

  const isVisuallyFocused = isInView || isFocused;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
      const hours = String(localTime.getHours()).padStart(2, '0');
      const minutes = String(localTime.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const handlePressStart = () => {
    const timer = setTimeout(() => {
      setIsFrozen(true);
      onPressStart();
    }, 300);
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setIsFrozen(false);
    onPressEnd();
  };

  const utcOffsetHours = useMemo(
    () => getUtcOffsetHoursForTimezone(timezone),
    [timezone],
  );

  const captionStyle = {
    fontSize: '0.75rem',
    fontWeight: 300,
    color: 'var(--page-muted, #666666)',
    letterSpacing: '0.05em',
    transition: 'color 0.7s ease',
  } as const;

  const toggleMapPopup = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setMapPopupOpen((open) => !open);
  };

  return (
    <motion.div
      ref={containerRef}
      data-city-card
      data-utc-offset={String(utcOffsetHours)}
      className={`relative w-full flex-shrink-0 px-4 md:mb-0 md:w-auto md:px-0 ${isLast ? 'mb-0' : 'mb-8'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <div className="mb-3">
          <p className="pointer-events-auto tracking-wider" style={captionStyle}>
            <span
              ref={cityAnchorRef}
              role="button"
              tabIndex={0}
              className="cursor-pointer underline decoration-1 underline-offset-[3px] transition-colors duration-700 ease-in-out [text-decoration-color:var(--page-muted,#666)] hover:[color:var(--page-fg,#333)] hover:[text-decoration-color:var(--page-fg,#333)]"
              style={{ color: 'var(--page-muted, #666)' }}
              onClick={toggleMapPopup}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleMapPopup(e);
                }
              }}
            >
              {city}
            </span>
            {' · '}
            {time} · {temperature}°C
          </p>
        </div>

        <motion.div
          className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-sm md:h-[420px] md:w-[320px]"
          onClick={onTap}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => {
            onHover?.(false);
            handlePressEnd();
          }}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          animate={
            isMobile
              ? {
                  opacity: isVisuallyFocused ? 1 : 0.88,
                  scale: 1,
                }
              : {
                  filter: isVisuallyFocused
                    ? 'blur(0px) brightness(1)'
                    : 'blur(2px) brightness(0.88)',
                  scale: isVisuallyFocused ? 1 : 0.98,
                }
          }
          transition={{ duration: isMobile ? 0.25 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {showVideo ? (
            <LiveVideo
              videoId={videoId}
              city={city}
              isLive={isLive}
              embedShareId={embedShareId}
              isFrozen={isFrozen}
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-300/40" aria-hidden />
          )}

          {isFrozen && (
            <>
              <motion.div
                className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-white/30"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </>
          )}
        </motion.div>
      </div>

      <CityMapPopup
        isOpen={mapPopupOpen}
        city={city}
        lat={lat}
        lon={lon}
        anchorRef={cityAnchorRef}
        onClose={() => setMapPopupOpen(false)}
      />
    </motion.div>
  );
}
