import { type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BreadCrumbs.css';

interface Crumb {
  label: string;
  path?: string;
}

export const BreadCrumbs: FC = () => {
  const location = useLocation();

  const getBreadcrumbs = (): Crumb[] => {
    // const path = location.pathname.replace('/RIP_frontend', '');
    if (location.pathname === '/') {
      return [];
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);

    const crumbs: Crumb[] = [
      { label: 'Главная', path: '/' }
    ];

    if (location.pathname === '/reaction' || pathSegments[0] === 'reaction') {
      if (pathSegments.length === 1) {
        crumbs.push({ label: 'Реакции' });
      } else if (pathSegments.length >= 2) {
        crumbs.push({ label: 'Реакции', path: '/reaction' });
        const reactionId = pathSegments[1];
        crumbs.push({ label: `Реакция ${reactionId}` });
      }
    }
    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <div className="breadcrumbs-container">
      <ul className="breadcrumbs">
        {crumbs.map((crumb, index) => (
          <li key={index} className={`breadcrumb-item ${!crumb.path ? 'active' : ''}`}>
            {crumb.path ? (
              <Link to={crumb.path} className="breadcrumb-link">
                {crumb.label}
              </Link>
            ) : (
              <span className="breadcrumb-text">{crumb.label}</span>
            )}
            {index < crumbs.length - 1 && <span className="breadcrumb-separator">/</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};