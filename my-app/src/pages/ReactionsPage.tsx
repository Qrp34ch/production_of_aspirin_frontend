// pages/ReactionsPage.tsx
import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Reaction } from '../modules/type';
import { REACTIONS_MOCK } from '../modules/mock';
import { getReactions } from '../modules/reactionsApi';

export const ReactionsPage: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [synthesisCount] = useState(0);

  useEffect(() => {
    loadReactions();
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadReactions();
  };

  // Добавь эту проверку перед рендером
  console.log('Current reactions state:', reactions);
  console.log('Reactions is array?', Array.isArray(reactions));

  return (
    <div className="mainpage">
      <div className="header">
        <div className="frame-14">
          <Link to="/"><span className="text-home">🏠︎</span></Link>
        </div>
        <p className="text-title"><span className="text-title">Производство аспирина</span></p>
        <div className="frame-13"></div>
      </div>

      <div className="standartpage">
        <form onSubmit={handleSearch}>
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
            <div key="loading" className="step">
              <p className="step-name"><span className="step-name">Загрузка...</span></p>
            </div>
          ) : !Array.isArray(reactions) || reactions.length === 0 ? ( // Добавлена проверка на массив
            <div key="no-results" className="step">
              <p className="step-name"><span className="step-name">
                {!Array.isArray(reactions) ? 'Ошибка данных' : 'Реакции не найдены'}
              </span></p>
            </div>
          ) : (
            reactions.map((reaction, index) => {
              console.log(`Rendering reaction ${index}:`, reaction);
              console.log(`Reaction ID:`, reaction.ID);
              return (
                <div key={reaction.ID || `reaction-${index}`} className="step"> {/* Запасной ключ */}
                  <p className="step-name"><span className="step-name">{reaction.Title}</span></p>
                  <img src={reaction.Src || '/static/images/default-reaction.jpg'} className="image" alt="image" />
                  <div className="frame-9">
                    <Link to={`/reaction/${reaction.ID}`}>
                      <div className="frame-17">
                        <p className="text-details"><span className="text-details">Подробнее</span></p>
                      </div>
                    </Link>
                    <button 
                      className="frame-18"
                    >
                      <span className="text-add">Добавить</span>
                    </button>
                  </div>
                </div>
              );
            })
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