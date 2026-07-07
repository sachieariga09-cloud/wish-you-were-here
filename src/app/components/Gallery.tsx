import { TopNav } from './TopNav';

interface GalleryProps {
  onNavigate: (page: 'entry' | 'gallery' | 'live') => void;
}

export function Gallery({ onNavigate }: GalleryProps) {
  return (
    <div className="starry-sky relative flex min-h-full flex-col overflow-auto">
      <TopNav current="gallery" onNavigate={onNavigate} variant="dark" />
      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-16 md:px-12">
        <p
          className="font-instrument-serif max-w-md text-center text-[23px] font-normal leading-snug text-[#f0ece4] md:max-w-lg md:text-[24px]"
        >
          Send in a postcard from the exhibit to be featured on this page!
        </p>
        <button
          type="button"
          onClick={() => onNavigate('live')}
          className="font-instrument-serif mt-10 flex cursor-pointer items-center justify-center rounded-[76px] border border-white/50 bg-[#edeae4]/40 px-10 py-4 text-center text-[23px] font-normal leading-snug text-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-[background-color,filter] duration-300 hover:bg-[#edeae4]/55 md:px-14 md:py-5 md:text-[24px]"
        >
          Return to live stream
        </button>
      </main>
    </div>
  );
}
