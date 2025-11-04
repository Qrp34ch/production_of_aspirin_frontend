import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Reaction } from '../modules/type';
import { REACTIONS_MOCK } from '../modules/mock';
import { getReactions, getSynthesisCartCount } from '../modules/reactionsApi';
import { BreadCrumbs } from '../components/BreadCrumbs';
import defaultImage from "../assets/DefaultImage.jpg"
import './ReactionsPage.css';

export const ReactionsPage: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [synthesisCount, setSynthesisCount] = useState(0);

  useEffect(() => {
    loadReactions();
    loadSynthesisCount();
  }, []);

  const loadReactions = async () => {
    setLoading(true);
    try {
      const data = await getReactions(searchValue);
      setReactions(data || []);
    } catch (error) {
      const filteredReactions = REACTIONS_MOCK.filter(reaction =>
        reaction.Title.toLowerCase().includes(searchValue.toLowerCase()) ||
        reaction.StartingMaterial.toLowerCase().includes(searchValue.toLowerCase())
      );
      setReactions(filteredReactions);
    } finally {
      setLoading(false);
    }
  };

  const loadSynthesisCount = async () => {
    try {
      const count = await getSynthesisCartCount();
      setSynthesisCount(count);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setSynthesisCount(0);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadReactions();
  };

  return (
    <div className="mainpage">
      <BreadCrumbs />
      <div className="standartpage">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search">
            <input 
              type="text" 
              name="query" 
              placeholder="Поиск" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="text-search" 
            />
            <button type="submit" className="search-button">
              <img src="http://localhost:9000/aspirinimages/img/search.png" alt="search" />
            </button>
          </div>
        </form>

        <div className="steps">
          {loading ? (
            <div className="step">
              <p className="step-name">Загрузка...</p>
            </div>
          ) : reactions.length === 0 ? (
            <div className="step">
              <p className="step-name">Реакции не найдены</p>
            </div>
          ) : (
            reactions.map((reaction) => (
              <div key={reaction.ID} className="step">
                <p className="step-name">{reaction.Title}</p>
                <img src={reaction.Src || defaultImage} className="image" alt="image" />
                <div className="frame-9">
                  <Link to={`/reaction/${reaction.ID}`}>
                    <div className="frame-17">
                      <p className="text-details">Подробнее</p>
                    </div>
                  </Link>
                  {/* <button className="frame-18">
                    <span className="text-add">Добавить</span>
                  </button> */}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="foot">
          {synthesisCount > 0 ? (
            <Link to="/synthesis/1" className="cart-link">
              <img src="http://localhost:9000/aspirinimages/img/korzina.png" className="cart" alt="cart" />
              <div className="cart-indicator">
                <span className="cart-count">{synthesisCount}</span>
              </div>
            </Link>
          ) : (
            <span className="cart-link disabled">
              <img src="http://localhost:9000/aspirinimages/img/korzina.png" className="cart" alt="cart" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};