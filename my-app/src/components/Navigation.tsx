import { type FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './Navigation.css';

export const Navigation: FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="custom-navbar">
      <div className="nav-header">
        {/* Бургер-меню для мобильных  🏠︎*/}
        <button 
          className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Открыть меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-links-desktop">
          <Link 
            to={ROUTES.HOME} 
            className={`navi-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Д
          </Link>
          <Link 
            to={ROUTES.REACTION} 
            className={`navi-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Реакции
          </Link>
        </div>

        <div className="nav-title">
          <span>Производство аспирина</span>
        </div>

        <div className="nav-space"></div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link 
            to={ROUTES.HOME} 
            className={`mobile-nav-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Главная
          </Link>
          <Link 
            to={ROUTES.REACTION} 
            className={`mobile-nav-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Реакции
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )} 
      </div>
    </div>
  );
};