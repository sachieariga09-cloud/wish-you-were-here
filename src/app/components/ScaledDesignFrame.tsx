import { useEffect, useRef, useState, type ReactNode } from 'react';

export const POSTCARD_DESIGN_WIDTH = 1531;
export const POSTCARD_DESIGN_HEIGHT = 1026;

interface ScaledDesignFrameProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScaledDesignFrame({ children, className, style }: ScaledDesignFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frameId = 0;
    let lastScale = 0;

    const updateScale = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const { width, height } = container.getBoundingClientRect();
        if (width === 0 || height === 0) return;

        const nextScale = Math.max(
          width / POSTCARD_DESIGN_WIDTH,
          height / POSTCARD_DESIGN_HEIGHT,
        );

        if (Math.abs(nextScale - lastScale) < 0.002) return;
        lastScale = nextScale;
        setScale(nextScale);
      });
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className ?? ''}`}
      style={style}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: POSTCARD_DESIGN_WIDTH,
          height: POSTCARD_DESIGN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
