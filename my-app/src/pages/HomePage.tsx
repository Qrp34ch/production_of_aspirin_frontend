import { type FC } from 'react';
// import { Link } from 'react-router-dom';
// import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// import { ROUTES } from '../../Routes';
import './HomePage.css';
import { Carousel } from '../components/Carousel';

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