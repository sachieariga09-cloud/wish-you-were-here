import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IdleStateProps {
  timeout?: number;
}

export function IdleState({ timeout = 120000 }: IdleStateProps) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, timeout);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
      clearTimeout(idleTimer);
    };
  }, [timeout]);

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--page-bg, #F7F5F2) 90%, transparent)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-instrument-serif tracking-wider text-sm font-normal opacity-30 transition-colors duration-700 ease-in-out [letter-spacing:0.08em]"
            style={{ color: 'var(--page-fg, #333)' }}
          >
            Wish You Were Here
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
