// App.tsx
import { useEffect, type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { HomePage } from './pages/HomePage';
import { ReactionsPage } from './pages/ReactionsPage';
import { ReactionDetailPage } from './pages/ReactionDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { SynthesisPage } from './pages/SynthesisPage';
import SynthesesPage from './pages/SynthesesPage';
import ProfilePage from './pages/ProfilePage';
import { ROUTES } from '../Routes';
import './App.css';
import { resetUserState } from './slices/userSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store/store'; // Импортируем тип AppDispatch

const App: FC = () => {
  // Используем типизированный dispatch
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Убираем удаление токена - он должен сохраняться!
    // localStorage.removeItem('authToken'); // УДАЛИТЬ ЭТУ СТРОКУ!

    // 1. При перезагрузке страницы сбрасываем состояние пользователя в Redux
    dispatch(resetUserState());
    
    // 2. Проверяем, есть ли токен в localStorage и восстанавливаем сессию
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   // Если токен есть, проверяем его валидность
    //   dispatch(checkAuth());
    // }
    
    if (window.__TAURI__) {
      console.log('Running in Tauri environment');
    }
  }, [dispatch]);

  return (
    <BrowserRouter basename="/production_of_aspirin_frontend">
      <div className="App">
        <Navigation />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.REACTION} element={<ReactionsPage />} />
          <Route path={ROUTES.REACTION_DETAIL} element={<ReactionDetailPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.SYNTHESIS} element={<SynthesisPage />} />
          <Route path={ROUTES.SYNTHESES} element={<SynthesesPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Routes>
        
        {/* PWA Install Prompt */}
        {!window.__TAURI__ && <PWAInstallPrompt />}
      </div>
    </BrowserRouter>
  );
};

export default App;