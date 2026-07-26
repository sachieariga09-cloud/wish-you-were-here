import { useEffect, useRef, useState } from 'react';
import { TopNav } from './TopNav';

import postcard8055 from '../../assets/gallery/postcard-8055.png';
import postcard8056 from '../../assets/gallery/postcard-8056.png';
import postcard8057 from '../../assets/gallery/postcard-8057.png';
import postcard8058 from '../../assets/gallery/postcard-8058.png';
import postcard8060 from '../../assets/gallery/postcard-8060.png';
import postcard8061 from '../../assets/gallery/postcard-8061.png';
import postcard8062 from '../../assets/gallery/postcard-8062.png';
import postcard8063 from '../../assets/gallery/postcard-8063.png';
import postcard8064 from '../../assets/gallery/postcard-8064.png';
import postcard8066 from '../../assets/gallery/postcard-8066.png';
import postcard8067 from '../../assets/gallery/postcard-8067.png';
import postcard8068 from '../../assets/gallery/postcard-8068.png';
import postcard8069 from '../../assets/gallery/postcard-8069.png';

const POSTCARDS = [
  { src: postcard8055, alt: 'Postcard to grandpa' },
  { src: postcard8056, alt: 'Postcard to my mom' },
  { src: postcard8057, alt: 'Postcard to Everyone' },
  { src: postcard8058, alt: 'Postcard to everyone' },
  { src: postcard8060, alt: 'Postcard to my future self' },
  { src: postcard8061, alt: 'Postcard to my cute grandma' },
  { src: postcard8062, alt: 'Postcard to my dear friend' },
  { src: postcard8063, alt: 'Postcard to someone who feels alone' },
  { src: postcard8064, alt: 'Postcard to my future self' },
  { src: postcard8066, alt: 'Postcard to a friend lost in childhood' },
  { src: postcard8067, alt: 'Postcard to my teacher from school' },
  { src: postcard8068, alt: 'Japanese postcard message' },
  { src: postcard8069, alt: 'Japanese postcard to people who are worried' },
] as const;

interface GalleryProps {
  onNavigate: (page: 'entry' | 'gallery' | 'live') => void;
}

export function Gallery({ onNavigate }: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dimOpacity, setDimOpacity] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const updateDim = () => {
      const maxScroll = Math.max(1, root.scrollHeight - root.clientHeight);
      const progress = Math.min(1, root.scrollTop / Math.min(maxScroll, root.clientHeight * 1.25));
      // Soft spotlight: starts clear, deepens as you scroll through postcards.
      setDimOpacity(0.08 + progress * 0.62);
    };

    updateDim();
    root.addEventListener('scroll', updateDim, { passive: true });
    window.addEventListener('resize', updateDim);
    return () => {
      root.removeEventListener('scroll', updateDim);
      window.removeEventListener('resize', updateDim);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="starry-sky relative h-full overflow-auto"
    >
      <div
        className="pointer-events-none fixed inset-0 z-[1] transition-[opacity] duration-500 ease-out"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 42%, transparent 0%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.88) 100%)',
          opacity: dimOpacity,
        }}
        aria-hidden
      />

      <TopNav current="gallery" onNavigate={onNavigate} variant="dark" />

      <main className="relative z-[2] mx-auto flex w-full max-w-[720px] flex-col items-center px-5 pb-20 pt-28 md:px-10">
        <h1 className="font-instrument-serif max-w-xl text-center text-[23px] font-normal leading-snug text-white md:text-[24px]">
          Postcards from{' '}
          <span className="gallery-glow-word">Here</span>
          {' '}to{' '}
          <span className="gallery-glow-word">There</span>
          .
        </h1>

        <p className="font-special-elite mt-6 max-w-xl whitespace-pre-line text-center text-[13px] font-normal leading-relaxed text-white md:text-[14px]">
          During the weekend-long exhibition of{' '}
          <em className="italic">Wish You Were Here</em>
          , visitors were invited to anonymously write a postcard. These are the
          words they left behind.
          {'\n\n'}
          A big thank you to everyone who took a moment to share something of
          themselves. :)
        </p>

        <ul className="mt-12 flex w-full list-none flex-col gap-10 p-0 md:gap-14">
          {POSTCARDS.map((postcard, index) => (
            <li key={postcard.src} className="w-full">
              <img
                src={postcard.src}
                alt={postcard.alt}
                width={1024}
                height={731}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="block h-auto w-full rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
