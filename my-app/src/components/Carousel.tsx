import { type FC } from 'react';
import './Carousel.css';
import defaultImage1 from "../assets/1.jpg";
import defaultImage2 from "../assets/2.png";
import defaultImage3 from "../assets/3.jpg";

export const Carousel: FC = () => {
  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button 
          type="button" 
          data-bs-target="#carouselExampleDark" 
          data-bs-slide-to="0" 
          className="active" 
          aria-current="true" 
          aria-label="Slide 1"
        ></button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleDark" 
          data-bs-slide-to="1" 
          aria-label="Slide 2"
        ></button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleDark" 
          data-bs-slide-to="2" 
          aria-label="Slide 3"
        ></button>
      </div>
      
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="10000">
          <img 
            src={defaultImage3} 
            className="d-block w-100 carousel-image" 
            alt="Производство аспирина - этап 1" 
          />
          <div className="carousel-caption">
            <h5>Поиск</h5>
            <p>Ищите необходимые химические реакции для изучения</p>
          </div>
        </div>
        
        <div className="carousel-item" data-bs-interval="2000">
          <img 
            src={defaultImage1} 
            className="d-block w-100 carousel-image" 
            alt="Производство аспирина - этап 2" 
          />
          <div className="carousel-caption">
            <h5>Расчеты</h5>
            <p>Рассчитывайте теоретический выход в реакциях</p>
          </div>
        </div>
        
        <div className="carousel-item">
          <img 
            src={defaultImage2} 
            className="d-block w-100 carousel-image" 
            alt="Производство аспирина - этап 3" 
          />
          <div className="carousel-caption">
            <h5>Сохранение</h5>
            <p>Сохраните расчеты для дальнейшего исследования</p>
          </div>
        </div>
      </div>
      
      <button 
        className="carousel-control-prev" 
        type="button" 
        data-bs-target="#carouselExampleDark" 
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      
      <button 
        className="carousel-control-next" 
        type="button" 
        data-bs-target="#carouselExampleDark" 
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};