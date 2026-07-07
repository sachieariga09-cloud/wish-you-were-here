import { memo, useEffect, useState } from 'react';

function LiveHeaderClockInner() {
  const [timeMark, setTimeMark] = useState<'moon' | 'sun'>(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return minutes >= 18 * 60 || minutes <= 4 * 60 ? 'moon' : 'sun';
  });
  const [localTime, setLocalTime] = useState(() =>
    new Date().toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
  );

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setTimeMark(minutes >= 18 * 60 || minutes <= 4 * 60 ? 'moon' : 'sun');
      setLocalTime(
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      );
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      className="font-instrument-serif shrink-0 text-sm font-normal tabular-nums tracking-wider transition-colors duration-700 ease-in-out [letter-spacing:0.06em]"
      style={{ color: 'var(--page-header-fg, #1e3a5f)' }}
      aria-live="polite"
    >
      <span aria-hidden className="mr-2 inline-block">
        {timeMark === 'moon' ? '⏾' : '☀︎'}
      </span>
      {localTime}
    </p>
  );
}

export const LiveHeaderClock = memo(LiveHeaderClockInner);

