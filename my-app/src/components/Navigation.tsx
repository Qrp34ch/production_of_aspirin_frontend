import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './Navigation.css';

export const Navigation: FC = () => {
  return (
    <div className="custom-navbar">
      <div className="nav-header">
        <div className="nav-home">
          <Link to={ROUTES.HOME} className="nav-home-link">
            🏠︎
          </Link>
          <Link to={ROUTES.REACTION} className="nav-home-link">
            🧪
          </Link>
        </div>
        <div className="nav-title">
          <span>Производство аспирина</span>
        </div>
        <div className="nav-space"></div>
      </div>
    </div>
  );
};