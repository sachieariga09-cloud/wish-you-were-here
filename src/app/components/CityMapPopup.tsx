import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { MiniWorldMap } from './MiniWorldMap';

interface CityMapPopupProps {
  isOpen: boolean;
  city: string;
  lat: number;
  lon: number;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

const POPUP_W = 236;

export function CityMapPopup({
  isOpen,
  city,
  lat,
  lon,
  anchorRef,
  onClose,
}: CityMapPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const margin = 8;
    let left = r.left;
    left = Math.max(margin, Math.min(left, window.innerWidth - POPUP_W - margin));
    setPos({ top: r.bottom + 6, left });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
    requestAnimationFrame(updatePosition);
  }, [isOpen, updatePosition, city]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (popupRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isOpen, onClose, anchorRef]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={city}
          ref={popupRef}
          role="dialog"
          aria-label={`Map for ${city}`}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[70] overflow-hidden rounded-[min(8px,1vw)] border border-black/10 bg-[#faf8f5] shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          style={{
            top: pos.top,
            left: pos.left,
            width: POPUP_W,
            pointerEvents: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-black/[0.06] px-3 py-2.5">
            <p className="font-instrument-serif text-[0.95rem] tracking-wide text-[#333]">{city}</p>
            <p
              className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#888]"
              style={{ fontFamily: '"Special Elite", monospace' }}
            >
              On the map
            </p>
          </div>
          <div className="p-2.5">
            <MiniWorldMap lat={lat} lon={lon} />
            <p
              className="mt-2 text-center text-[10px] tracking-wider text-[#999]"
              style={{ fontFamily: '"Special Elite", monospace' }}
            >
              Tap outside to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
