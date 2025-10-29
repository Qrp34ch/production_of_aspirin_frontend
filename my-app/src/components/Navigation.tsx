// components/Navigation.tsx
import { type FC } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';

export const Navigation: FC = () => {
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME}>
          🧪 Aspirin Production
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to={ROUTES.HOME}
              className={location.pathname === ROUTES.HOME ? 'active' : ''}
            >
              {ROUTE_LABELS.HOME}
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to={ROUTES.REACTION}
              className={location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}
            >
              {ROUTE_LABELS.REACTION}
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link href="/API/docs" target="_blank">
              📚 API Docs
            </Nav.Link>
            <Nav.Link href="/swagger/index.html" target="_blank">
              🔍 Swagger
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};