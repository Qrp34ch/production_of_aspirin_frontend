import { type FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { type AppDispatch, type RootState } from '../store/store';
import { getSynthesis, clearCurrentSynthesis, saveSynthesisChanges, deleteSynthesis, formSynthesis } from '../slices/synthesisSlice';
import { getProfile } from '../slices/userSlice';
import { Navigation } from '../components/Navigation';
import { ROUTES } from '../../Routes';
import { transformImageUrl } from '../target_config';
import defimage from "../assets/DefaultImage.jpg";
import './SynthesisPage.css';
import { BreadCrumbs } from '../components/BreadCrumbs';

// УБИРАЕМ лишний интерфейс SynthesisReactionData - используем тот, что в слайсе

export const SynthesisPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentSynthesis, loading, error } = useSelector((state: RootState) => state.synthesis);
  const { user } = useSelector((state: RootState) => state.user);

  const [purity, setPurity] = useState<number>(0);
  const [volumes, setVolumes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (id) {
      dispatch(getSynthesis(parseInt(id))); // Используем новый метод
      dispatch(getProfile());
    }

    return () => {
      dispatch(clearCurrentSynthesis());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSynthesis?.purity) {
      setPurity(currentSynthesis.purity);
    }
    
    // Инициализируем объемы из текущего синтеза
    if (currentSynthesis?.reactions) {
      const initialVolumes: { [key: number]: number } = {};
      currentSynthesis.reactions.forEach((reaction) => {
        if (reaction.reaction.ID) {
          initialVolumes[reaction.reaction.ID] = reaction.volume_sm;
        }
      });
      setVolumes(initialVolumes);
    }
  }, [currentSynthesis]);

  const handleVolumeChange = (reactionId: number, volume: number) => {
    setVolumes(prev => ({
      ...prev,
      [reactionId]: volume
    }));
  };

  const handlePurityChange = (newPurity: number) => {
    setPurity(newPurity);
  };

  const handleSavePurity = async () => {
    if (!id) return;
    
    try {
      await dispatch(saveSynthesisChanges({
        synthesisId: parseInt(id),
        purity: purity,
        volumes: volumes
      })).unwrap();
      
      alert('Изменения успешно сохранены!');
    } catch (error: any) {
      console.error('Ошибка сохранения:', error);
      alert(`Ошибка сохранения: ${error.message || 'Неизвестная ошибка'}`);
    }
  };
  const { loading: saveLoading } = useSelector((state: RootState) => state.synthesis);

  const handleDeleteSynthesis = async () => {
    if (!id) return;
    
    if (!window.confirm('Вы уверены, что хотите очистить синтез? Все данные будут удалены.')) {
      return;
    }

    try {
      await dispatch(deleteSynthesis(parseInt(id))).unwrap();
      alert('Синтез успешно очищен');
      navigate(ROUTES.REACTION); // Перенаправляем на страницу реакций
    } catch (error: any) {
      console.error('Ошибка удаления синтеза:', error);
      alert(`Ошибка очистки синтеза: ${error.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleFormSynthesis = async () => {
    if (!id) return;
    
    // Проверяем, что есть реакции в синтезе
    if (reactions.length === 0) {
      alert('Нельзя сформировать пустой синтез. Добавьте хотя бы одну реакцию.');
      return;
    }

    // Проверяем, что концентрация установлена
    if (purity <= 0 || purity > 100) {
      alert('Установите корректную концентрацию (от 1 до 100%) перед формированием заявки.');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите сформировать заявку? После этого редактирование будет невозможно.')) {
      return;
    }

    try {
      await dispatch(formSynthesis(parseInt(id))).unwrap();
      alert('Заявка успешно сформирована!');
      
      // Обновляем данные синтеза после формирования
      dispatch(getSynthesis(parseInt(id)));
    } catch (error: any) {
      console.error('Ошибка формирования синтеза:', error);
      alert(`Ошибка формирования заявки: ${error.message || 'Неизвестная ошибка'}`);
    }
  };

  if (loading) {
    return (
      <div className="synthesis-page">
        <Navigation />
        <Container className="synthesis-container">
          <div className="loading-spinner">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка синтеза...</span>
            </Spinner>
            <p>Загрузка синтеза...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !currentSynthesis) {
    return (
      <div className="synthesis-page">
        <Navigation />
        <Container className="synthesis-container">
          <Alert variant="danger">
            {error || 'Синтез не найден'}
          </Alert>
          <Button onClick={() => navigate(ROUTES.HOME)}>
            Вернуться на главную
          </Button>
        </Container>
      </div>
    );
  }

  // Добавляем проверки на существование данных
  const reactions = currentSynthesis.reactions || [];
  const isDraft = currentSynthesis.status === 'черновик';

  console.log('Current synthesis:', currentSynthesis); // для отладки
  console.log('Reactions:', reactions); // для отладки

  return (
    <div className="synthesis-page">
      <Navigation />
      <BreadCrumbs />
      <Container className="synthesis-container">
        
        {/* Информация о пользователе и дате */}
        <div className="user-info-section">
          <div className="user-name-field">
            <label className="field-label">Пользователь</label>
            <div className="field-value">
              {currentSynthesis.creator_login || user?.fio || user?.login || 'Неизвестный пользователь'}
            </div>
          </div>
          
          <div className="date-field">
            <label className="field-label">Дата создания</label>
            <div className="field-value">
              {currentSynthesis.created_at || 'Не указана'}
            </div>
          </div>
        </div>

        {/* Поля для расчетов */}
        <div className="calculation-fields">
          <h3 className="section-title">Заполните поля для расчетов этапов синтеза</h3>
          
          <div className="purity-field">
            <label className="field-label">Концентрация</label>
            <div className="field-input-group">
              <input
                type="number"
                className="field-input"
                value={purity}
                onChange={(e) => handlePurityChange(parseFloat(e.target.value))}
                disabled={!isDraft}
              />
            </div>
          </div>

          {reactions.length > 0 ? (
            reactions.map((synthesisReaction, index) => (
              <div key={synthesisReaction.reaction.ID || index} className="reaction-volume-field">
                <label className="field-label">
                  {synthesisReaction.reaction.StartingMaterial || 'Неизвестное вещество'}
                </label>
                <div className="field-input-group">
                  <input
                    type="number"
                    className="field-input"
                    placeholder="V, мл"
                    value={volumes[synthesisReaction.reaction.ID!] || ''}
                    onChange={(e) => 
                      synthesisReaction.reaction.ID && 
                      handleVolumeChange(synthesisReaction.reaction.ID, parseFloat(e.target.value))
                    }
                    disabled={!isDraft}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="no-reactions-message">
              <p>В этом синтезе пока нет реакций</p>
            </div>
          )}
        </div>
        
        {isDraft && (
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleSavePurity}
            className="save-purity-btn"
            disabled={saveLoading} // Блокируем кнопку во время сохранения
          >
            {saveLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Сохранение...
              </>
            ) : (
              'Сохранить'
            )}
          </Button>
        )}

        {/* Заголовок таблицы реакций - показываем только если есть реакции */}
        {reactions.length > 0 && (
          <div className="reactions-header">
            <div className="materials-header">
              <div className="image-placeholder"></div>
              <div className="starting-material-header">
                <div className="material-titles">
                  <span className="material-title">исходное вещество</span>
                  <div className="property-column">
                    <span>ρ, г/мл</span>
                  </div>
                  <div className="property-column">
                    <span>М, г/моль</span>
                  </div>
                  <div className="property-column">
                    <span>V, мл</span>
                  </div>
                </div>
              </div>
              <div className="result-material-header">
                <div className="material-titles">
                  <span className="material-title">результат</span>
                  <div className="property-column">
                    <span>ρ, г/мл</span>
                  </div>
                  <div className="property-column">
                    <span>М, г/моль</span>
                  </div>
                  <div className="property-column">
                    <span>V, мл</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Список реакций */}
        <div className="reactions-list">
          {reactions.length > 0 ? (
            reactions.map((synthesisReaction, index) => (
              <div key={synthesisReaction.reaction.ID || index} className="reaction-item">
                <h4 className="reaction-title">
                  {synthesisReaction.reaction.Title || 'Без названия'} 
                  {synthesisReaction.count > 1 && ` (${synthesisReaction.count} шт.)`}
                </h4>
                
                <div className="reaction-content">
                  <div className="reaction-image">
                    <img 
                      src={transformImageUrl(synthesisReaction.reaction.Src) || defimage} 
                      alt={synthesisReaction.reaction.Title || 'Изображение реакции'} 
                    />
                  </div>
                  
                  <div className="starting-material-header">
                    <div className="material-data">
                      <span className="material-name">{synthesisReaction.reaction.StartingMaterial || 'Неизвестно'}</span>
                      <div className="property-value">
                        <span>{synthesisReaction.reaction.DensitySM || '-'}</span>
                      </div>
                      <div className="property-value">
                        <span>{synthesisReaction.reaction.MolarMassSM || '-'}</span>
                      </div>
                      <div className="property-value">
                        <span className="volume-display">
                          {volumes[synthesisReaction.reaction.ID!] || synthesisReaction.volume_sm || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="result-material-header">
                    <div className="material-data">
                      <span className="material-name">{synthesisReaction.reaction.ResultMaterial || 'Неизвестно'}</span>
                      <div className="property-value">
                        <span>{synthesisReaction.reaction.DensityRM || '-'}</span>
                      </div>
                      <div className="property-value">
                        <span>{synthesisReaction.reaction.MolarMassRM || '-'}</span>
                      </div>
                      <div className="property-value">
                        <span className="volume-display">
                          {synthesisReaction.volume_rm || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-synthesis">
              <Alert variant="info">
                <h5>Синтез пуст</h5>
                <p>Добавьте реакции в синтез, чтобы увидеть их здесь.</p>
                <Button onClick={() => navigate(ROUTES.REACTION)}>
                  Перейти к реакциям
                </Button>
              </Alert>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="action-buttons">
          {isDraft && (
            <>
              <Button 
                variant="success" 
                onClick={handleFormSynthesis}
                className="action-btn"
                disabled={loading} // Блокируем во время загрузки
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Формирование...
                  </>
                ) : (
                  'Сформировать заявку'
                )}
              </Button>
              
              <Button 
                variant="danger" 
                onClick={handleDeleteSynthesis}
                className="action-btn"
                disabled={loading} // Блокируем во время загрузки
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Удаление...
                  </>
                ) : (
                  'Очистить'
                )}
              </Button>
            </>
          )}
          
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(ROUTES.SYNTHESES)}
            className="action-btn"
          >
            Назад к списку
          </Button>
        </div>

      </Container>
    </div>
  );
};