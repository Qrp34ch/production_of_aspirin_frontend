import { type FC } from 'react';
// import { Link } from 'react-router-dom';
// import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// import { ROUTES } from '../../Routes';
import './HomePage.css';
import { Carousel } from '../components/Carousel';



/* <Container>
          
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <Card className="home-card">
                <Card.Body className="text-center">
                  <h1 className="home-main-title mb-4">Производство аспирина</h1>
                  
                  <div className="welcome-section mb-4">
                    <p className="welcome-text">
                      Добро пожаловать в веб-сервис по производству аспирина! Здесь Вы сможете ознакомиться 
                      с этапами производства аспирина, а также расчитать теоретический выход продуктов химических реакций.
                    </p>
                  </div>

                  <hr className="divider my-4" />

                  <div className="reactions-section">
                    <h2 className="reactions-title mb-3">Список реакций</h2>
                    
                    <Link to={ROUTES.REACTION}>
                      <Button variant="primary" size="lg" className="reactions-btn">
                        Перейти к списку реакций
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container> */




export const HomePage: FC = () => {
  return (
    <div className="mainpage">
      <div className="standartpage">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <Carousel />
      </div>
    </div>
  );
};