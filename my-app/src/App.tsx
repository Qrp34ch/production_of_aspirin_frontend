import { useEffect, type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
// import { BreadCrumbs } from './components/BreadCrumbs';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { HomePage } from './pages/HomePage';
import { ReactionsPage } from './pages/ReactionsPage';
import { ReactionDetailPage } from './pages/ReactionDetailPage';
import { ROUTES } from '../Routes';
import { BASE_PATH } from './target_config';
import './App.css';

const App: FC = () => {
  useEffect(() => {
    if (window.__TAURI__) {
      console.log('Running in Tauri environment');
    }
  }, []);
  return (
    <BrowserRouter basename={BASE_PATH}>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.REACTION} element={<ReactionsPage />} />
          <Route path={ROUTES.REACTION_DETAIL} element={<ReactionDetailPage />} />
        </Routes>
        
        {/* PWA Install Prompt */}
        {!window.__TAURI__ && <PWAInstallPrompt />}
      </div>
    </BrowserRouter>
  );
};

export default App;