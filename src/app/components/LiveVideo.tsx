import { memo, useMemo } from 'react';

interface LiveVideoProps {
  videoId: string;
  city: string;
  isLive?: boolean;
  /** YouTube `si` share param (used by some live streams). */
  embedShareId?: string;
  isFrozen?: boolean;
}

function LiveVideoInner({
  videoId,
  city,
  isLive = false,
  embedShareId,
  isFrozen,
}: LiveVideoProps) {
  const src = useMemo(() => {
    if (isLive) {
      const params = new URLSearchParams({
        autoplay: '1',
        mute: '1',
        playsinline: '1',
      });
      if (embedShareId) params.set('si', embedShareId);
      if (typeof window !== 'undefined') {
        params.set('origin', window.location.origin);
      }
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }

    const embedParams = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      controls: '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1',
      loop: '1',
      playlist: videoId,
    });
    return `https://www.youtube.com/embed/${videoId}?${embedParams.toString()}`;
  }, [videoId, isLive, embedShareId]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <iframe
        src={src}
        title={`Live feed from ${city}`}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          aspectRatio: '16 / 9',
          width: 'auto',
          height: 'auto',
          minWidth: '100%',
          minHeight: '100%',
          border: 'none',
          pointerEvents: isFrozen ? 'none' : 'auto',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export const LiveVideo = memo(LiveVideoInner);
