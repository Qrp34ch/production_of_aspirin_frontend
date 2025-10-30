import { type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { BreadCrumbs } from './components/BreadCrumbs';
import { HomePage } from './pages/HomePage';
import { ReactionsPage } from './pages/ReactionsPage';
import { ReactionDetailPage } from './pages/ReactionDetailPage';
import { ROUTES } from '../Routes';
import './App.css';

const App: FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <BreadCrumbs />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.REACTION} element={<ReactionsPage />} />
          <Route path={ROUTES.REACTION_DETAIL} element={<ReactionDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;