import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Reaction } from '../modules/type';
import { REACTIONS_MOCK } from '../modules/mock';
import { getReactions } from '../modules/reactionsApi';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSearchQuery, resetFilters, clearSearch } from '../store/filterSlice';
import './ReactionsPage.css';
import search from "../assets/search.png"
import { BreadCrumbs } from '../components/BreadCrumbs';
import synthesis from "../assets/korzina.png"

export const ReactionsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.filters);
  
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [synthesisCount] = useState(0);

  useEffect(() => {
    loadReactions();
  }, []);

  const loadReactions = async (query: string = searchQuery) => {
    setLoading(true);
    try {
      const data = await getReactions(query);
      setReactions(data || []);
    } catch (error) {
      console.error('Ошибка загрузки реакций:', error);

      const filteredReactions = REACTIONS_MOCK.filter(reaction =>
        reaction.Title.toLowerCase().includes(query.toLowerCase()) ||
        reaction.StartingMaterial.toLowerCase().includes(query.toLowerCase())
      );
      setReactions(filteredReactions);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadReactions();
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    loadReactions(''); 
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
    loadReactions('');
  };

  return (
    <div className="mainpage">
      <BreadCrumbs />
      <div className="standartpage">
        
        <div className="reactions-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search">
              <input 
                type="text" 
                name="query" 
                placeholder="Поиск" 
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="text-search" 
              />
              
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={handleClearSearch}
                  className="clear-search-btn"
                  title="Очистить поиск"
                >
                  ✕
                </button>
              )}

              <button type="submit" className="search-button">
                <img src= {search} alt="search" />
              </button>

            </div>
          </form>

          {searchQuery && (
            <div className="filter-info">
              <span>Поиск: "{searchQuery}"</span>
              <button 
                onClick={handleResetFilters}
                className="reset-filters-btn"
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          <div className="steps">
            {loading ? (
              <div className="step loading-step">
                <p className="step-name">Загрузка реакций...</p>
              </div>
            ) : reactions.length === 0 ? (
              <div className="step empty-step">
                <p className="step-name">
                  {searchQuery ? 'Реакции по вашему запросу не найдены' : 'Реакции не найдены'}
                </p>
                {searchQuery && (
                  <button 
                    onClick={handleResetFilters}
                    className="show-all-btn"
                  >
                    Показать все реакции
                  </button>
                )}
              </div>
            ) : (
              reactions.map((reaction) => (
                <div key={reaction.ID} className="step">
                  <p className="step-name">{reaction.Title}</p>
                  <img 
                    src={reaction.Src || '/static/images/default-reaction.jpg'} 
                    className="image" 
                    alt={reaction.Title} 
                  />
                  <div className="frame-9">
                    <Link to={`/reaction/${reaction.ID}`} >
                      <div className="frame-17">
                        <div></div>
                        <div></div>
                        <p className="text-details">Подробнее</p>
                      </div>
                    </Link>
                    {/* <Link to={`/reaction/${reaction.ID}`} >
                      <div className="frame-18">
                        <div></div>
                        <div></div>
                        <p className="text-add">Добавить</p>
                      </div>
                    </Link>                 */}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="foot">
            {synthesisCount > 0 ? (
              <Link to="/synthesis/1" className="cart-link">
                <img src={synthesis} className="cart" alt="cart" />
                <div className="cart-indicator">
                  <span className="cart-count">{synthesisCount}</span>
                </div>
              </Link>
            ) : (
              <span className="cart-link disabled">
                <img src={synthesis} className="cart" alt="cart" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};