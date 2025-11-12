import { type FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './Navigation.css';

export const Navigation: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    closeMenu();
    navigate(path);
  };

  const NavItem = ({ path, children, className }: { path: string; children: React.ReactNode; className?: string }) => (
    <div 
      className={className}
      onClick={() => handleNavigation(path)}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );

  return (
    <div className="custom-navbar">
      <div className="nav-header">
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
          <NavItem 
            path={ROUTES.HOME}
            className={`navi-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
          >
            🏠︎
          </NavItem>
          <NavItem 
            path={ROUTES.REACTION}
            className={`navi-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
          >
            Реакции
          </NavItem>
        </div>

        <div className="nav-title">
          <span>Производство аспирина</span>
        </div>

        <div className="nav-space"></div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <NavItem 
              path={ROUTES.HOME}
              className={`mobile-nav-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
            >
              Главная
            </NavItem>
            <NavItem 
              path={ROUTES.REACTION}
              className={`mobile-nav-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
            >
              Реакции
            </NavItem>
          </div>
        </div>

        {isMenuOpen && (
          <div className="menu-overlay" onClick={closeMenu}></div>
        )} 
      </div>
    </div>
  );
};