import { type FC } from 'react';
import { Container } from 'react-bootstrap';
import { Navigation } from '../components/Navigation';
import './ErrorPages.css';

export const ForbiddenPage: FC = () => {
  return (
    <div className="error-page">
      <Navigation />
      <Container className="error-container">
        <div className="error-content">
          <div className="error-code">403</div>
          <h1 className="error-title">Доступ запрещен</h1>
          <p className="error-message">
            У вас недостаточно прав для доступа к этой странице.
          </p>
        </div>
      </Container>
    </div>
  );
};