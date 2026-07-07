import { lazy, Suspense, useEffect, useState } from 'react';
import { PostcardLanding } from './components/PostcardLanding';

const Gallery = lazy(() =>
  import('./components/Gallery').then((m) => ({ default: m.Gallery })),
);
const LoadingScreen = lazy(() =>
  import('./components/LoadingScreen').then((m) => ({ default: m.LoadingScreen })),
);
const LiveFeedPage = lazy(() =>
  import('./components/LiveFeedPage').then((m) => ({ default: m.LiveFeedPage })),
);

type ViewState = 'entry' | 'loading' | 'live' | 'gallery';

function prefetchPostEntryBundles() {
  void import('./components/LoadingScreen');
  void import('./components/LiveFeedPage');
}

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('entry');
  const [landingKey, setLandingKey] = useState(0);

  useEffect(() => {
    if (viewState === 'loading') {
      const timer = setTimeout(() => {
        setViewState('live');
      }, 2700);
      return () => clearTimeout(timer);
    }
  }, [viewState]);

  const handleSendPostcard = () => {
    prefetchPostEntryBundles();
    setViewState('loading');
  };

  const handleReturnToLanding = () => {
    setViewState('entry');
    setLandingKey((prev) => prev + 1);
  };

  const handleNavigate = (page: 'entry' | 'gallery' | 'live') => {
    if (page === 'entry') {
      handleReturnToLanding();
      return;
    }
    if (page === 'gallery') {
      void import('./components/Gallery');
      setViewState('gallery');
      return;
    }
    void import('./components/LiveFeedPage');
    setViewState('live');
  };

  if (viewState === 'entry') {
    return <PostcardLanding key={landingKey} onSend={handleSendPostcard} />;
  }

  if (viewState === 'gallery') {
    return (
      <Suspense fallback={null}>
        <Gallery onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  if (viewState === 'loading') {
    return (
      <Suspense fallback={null}>
        <LoadingScreen />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <LiveFeedPage onNavigate={handleNavigate} />
    </Suspense>
  );
}
