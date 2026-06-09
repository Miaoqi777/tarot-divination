import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import SplashPage from './components/splash/SplashPage';
import Sidebar from './components/layout/Sidebar';
import WeatherBar from './components/layout/WeatherBar';
import MainContent from './components/layout/MainContent';
import StarfieldBackground from './components/layout/StarfieldBackground';
import { storageService } from './services/storageService';

// Lazy-load pages for code splitting
const DivinationPage = lazy(() => import('./pages/DivinationPage'));
const EncyclopediaPage = lazy(() => import('./pages/EncyclopediaPage'));
const MoodPage = lazy(() => import('./pages/MoodPage'));
const WhiteNoisePage = lazy(() => import('./pages/WhiteNoisePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center" style={{ height: '60vh' }}>
      <div style={{ fontSize: 32 }} className="animate-pulse">🔮</div>
    </div>
  );
}

function AppLayout() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <StarfieldBackground />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <WeatherBar />
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const dismissed = storageService.get<boolean>('splash_dismissed');
    if (dismissed) {
      setShowSplash(false);
    }
  }, []);

  const handleDismiss = () => {
    storageService.set('splash_dismissed', true);
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashPage onDismiss={handleDismiss} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/divination" replace />} />
            <Route path="/divination" element={<Suspense fallback={<PageLoader />}><DivinationPage /></Suspense>} />
            <Route path="/encyclopedia" element={<Suspense fallback={<PageLoader />}><EncyclopediaPage /></Suspense>} />
            <Route path="/mood" element={<Suspense fallback={<PageLoader />}><MoodPage /></Suspense>} />
            <Route path="/whitenoise" element={<Suspense fallback={<PageLoader />}><WhiteNoisePage /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
