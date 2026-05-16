interface LiveVideoProps {
  videoId: string;
  city: string;
  isFrozen?: boolean;
}

export function LiveVideo({ videoId, city, isFrozen }: LiveVideoProps) {
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

  return (
    <div className="relative w-full h-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?${embedParams.toString()}`}
        title={`Live feed from ${city}`}
        className="absolute inset-0 w-full h-full"
        style={{
          border: 'none',
          pointerEvents: isFrozen ? 'none' : 'auto',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
