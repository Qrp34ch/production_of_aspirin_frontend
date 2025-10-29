// pages/HomePage.tsx
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Routes';

export const HomePage: FC = () => {
  return (
    <div className="mainpage">
      <div className="header">
        <div className="frame-14">
          <Link to={ROUTES.REACTION}><span className="text-home">🏠︎</span></Link>
        </div>
        <p className="text-title"><span className="text-title">Производство аспирина</span></p>
        <div className="frame-13"></div>
      </div>

      <div className="standartpage">
        <form action="/reaction" method="GET">
          <div className="search">
            <input type="text" name="query" placeholder="Поиск" className="text-search" />
            <button type="submit" className="search-button">
              <img src="http://localhost:9000/aspirinimages/img/search.png" alt="search" />
            </button>
          </div>
        </form>

        <div className="steps">
          {/* Реакции будут подгружаться динамически */}
          <div className="step">
            <p className="step-name"><span className="step-name">Загрузка...</span></p>
            <img src="/static/images/default-reaction.jpg" className="image" alt="image" />
            <div className="frame-9">
              <Link to="/reaction/1">
                <div className="frame-17">
                  <p className="text-details"><span className="text-details">Подробнее</span></p>
                </div>
              </Link>
              <button className="frame-18">
                <span className="text-add">Добавить</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="foot">
          <span className="cart-link disabled">
            <img src="http://localhost:9000/aspirinimages/img/korzina.png" className="cart" alt="cart" />
          </span>
        </div>
      </div>
    </div>
  );
};