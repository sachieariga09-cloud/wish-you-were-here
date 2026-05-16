import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const fragments = [
  'you would have liked this',
  'i stayed longer than i planned',
  'the light was different today',
  'it reminded me of you',
];

export function RareTextFragment() {
  const [showFragment, setShowFragment] = useState(false);
  const [currentFragment, setCurrentFragment] = useState('');

  useEffect(() => {
    const checkForFragment = () => {
      if (Math.random() < 0.08) {
        const fragment = fragments[Math.floor(Math.random() * fragments.length)];
        setCurrentFragment(fragment);
        setShowFragment(true);

        setTimeout(() => {
          setShowFragment(false);
        }, 3000);
      }
    };

    const interval = setInterval(checkForFragment, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {showFragment && (
        <motion.div
          className="fixed bottom-12 right-12 z-10 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.25, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="tracking-wider italic transition-colors duration-700 ease-in-out"
            style={{
              fontSize: '0.875rem',
              fontWeight: 300,
              color: 'var(--page-fg, #333)',
              letterSpacing: '0.05em',
            }}
          >
            {currentFragment}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
