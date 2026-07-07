import { useId } from 'react';
import { motion } from 'motion/react';
import worldMapPng from '../../assets/world-map.png';

const MAP_W = 512;
const MAP_H = 219;

function projectEquirectangular(lon: number, lat: number) {
  const x = ((lon + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return { x, y };
}

interface MiniWorldMapProps {
  lon: number;
  lat: number;
}

export function MiniWorldMap({ lon, lat }: MiniWorldMapProps) {
  const { x, y } = projectEquirectangular(lon, lat);
  const uid = useId().replace(/:/g, '');
  const pinGlowId = `pin-glow-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="h-[88px] w-full rounded-sm border border-white/15"
      aria-hidden
    >
      <defs>
        <filter id={pinGlowId} x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity="0.55" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fff" floodOpacity="0.85" />
        </filter>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="#152238" />
      <image
        href={worldMapPng}
        x={0}
        y={0}
        width={MAP_W}
        height={MAP_H}
        preserveAspectRatio="xMidYMid meet"
        style={{ mixBlendMode: 'lighten' }}
      />

      <g transform={`translate(${x}, ${y})`} filter={`url(#${pinGlowId})`}>
        <motion.circle
          r="52"
          fill="#ff2d2d"
          initial={{ opacity: 0.35, scale: 0.5 }}
          animate={{ opacity: [0.55, 0.2, 0.55], scale: [0.75, 1.35, 0.75] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          r="34"
          fill="#ff5c5c"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle r="24" fill="#faf8f5" stroke="#fff" strokeWidth="3" />
        <circle r="17" fill="#e32639" stroke="#faf8f5" strokeWidth="5" />
        <circle cx="3.5" cy="-3.5" r="4" fill="#fff" opacity="0.75" />
      </g>
    </svg>
  );
}
