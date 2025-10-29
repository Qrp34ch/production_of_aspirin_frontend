// components/BreadCrumbs.tsx
import { type FC } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Routes';

interface Crumb {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  crumbs: Crumb[];
}

export const BreadCrumbs: FC<BreadCrumbsProps> = ({ crumbs }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: ROUTES.HOME }}>
        🏠 Главная
      </Breadcrumb.Item>
      
      {crumbs.map((crumb, index) => (
        <Breadcrumb.Item
          key={index}
          linkAs={crumb.path ? Link : 'span'}
          linkProps={crumb.path ? { to: crumb.path } : undefined}
          active={index === crumbs.length - 1}
        >
          {crumb.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};