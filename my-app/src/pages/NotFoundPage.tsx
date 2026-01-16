import { type FC } from 'react';
import { Container } from 'react-bootstrap';
import { Navigation } from '../components/Navigation';
import './ErrorPages.css';

export const NotFoundPage: FC = () => {

  return (
    <div className="error-page">
      <Navigation />
      <Container className="error-container">
        <div className="error-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Страница не найдена</h1>
          <p className="error-message">
            Запрашиваемая страница не существует или была перемещена.
          </p>
        </div>
      </Container>
    </div>
  );
};