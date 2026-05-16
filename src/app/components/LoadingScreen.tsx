import { motion } from 'motion/react';
import GlyphsPlane from '../../imports/GlyphsPlane/GlyphsPlane';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex size-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#F7F5F2' }}
    >
      <div className="relative z-10 text-center">
        <div className="relative mx-auto mb-6 h-16 w-80 max-w-[90vw] overflow-hidden rounded-sm">
          <motion.div
            className="absolute top-1/2 flex -translate-y-1/2 flex-row items-center"
            initial={{ x: -150 }}
            animate={{ x: 380 }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              aria-hidden
              className="h-[3px] w-32 shrink-0 rounded-full"
              style={{
                boxShadow: '0 0 12px rgba(56, 98, 116, 0.2)',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(56, 98, 116, 0.08) 18%, rgba(56, 98, 116, 0.32) 78%, rgba(56, 98, 116, 0.42) 100%)',
              }}
            />
            <div className="relative z-10 -ml-0.5 h-12 w-12 shrink-0">
              <GlyphsPlane />
            </div>
          </motion.div>
        </div>

        <p
          style={{
            fontFamily: '"Special Elite", monospace',
            fontSize: '12px',
            letterSpacing: '2px',
            color: '#666',
            textTransform: 'uppercase',
          }}
        >
          Sending postcard...
        </p>
      </div>
    </motion.div>
  );
}
