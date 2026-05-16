import { motion } from 'motion/react';
import { LiveVideo } from './LiveVideo';

interface PostcardProps {
  videoId: string;
  city: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Postcard({ videoId, city, isFlipped, onFlip }: PostcardProps) {
  return (
    <div
      className="relative cursor-pointer"
      onClick={onFlip}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <motion.div
          className="w-[340px] h-[480px] md:w-[400px] md:h-[560px] bg-white rounded-sm overflow-hidden relative"
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <LiveVideo videoId={videoId} city={city} />
          <div className="absolute bottom-6 left-6 z-10">
            <p className="font-instrument-serif tracking-wider text-sm font-normal text-white/90 [letter-spacing:0.08em] [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
              Wish You Were Here
            </p>
          </div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 w-[340px] h-[480px] md:w-[400px] md:h-[560px] bg-white rounded-sm flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="px-12">
            <p className="font-instrument-serif mb-16 text-center text-[1.125rem] leading-[1.8] font-normal tracking-wider text-[#333] [letter-spacing:0.08em]">
              Wish You Were Here
            </p>
            <p
              className="text-right tracking-wider"
              style={{
                fontSize: '0.75rem',
                fontWeight: 300,
                color: '#999',
                letterSpacing: '0.05em',
              }}
            >
              {city}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
