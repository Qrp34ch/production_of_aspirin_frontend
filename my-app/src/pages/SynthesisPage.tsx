import { type FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { type AppDispatch, type RootState } from '../store/store';
import { 
  getSynthesis, 
  clearCurrentSynthesis, 
  savePurityOnly,
  saveReactionVolume,
  // saveVolumesOnly,
  deleteSynthesis, 
  formSynthesis,
  removeReactionFromSynthesis
} from '../slices/synthesisSlice';
import { getProfile } from '../slices/userSlice';
import { Navigation } from '../components/Navigation';
import { ROUTES } from '../../Routes';
import { transformImageUrl } from '../target_config';
import defimage from "../assets/DefaultImage.jpg";
import './SynthesisPage.css';
import { Container, Button, Spinner } from 'react-bootstrap';
import { BreadCrumbs } from '../components/BreadCrumbs';

export const SynthesisPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentSynthesis, loading } = useSelector((state: RootState) => state.synthesis);
  const { user } = useSelector((state: RootState) => state.user);

  const [purity, setPurity] = useState<string>('');
  const [volumes, setVolumes] = useState<{ [key: number]: string }>({});
  const [savingPurity, setSavingPurity] = useState<boolean>(false);
  const [savingVolumes, setSavingVolumes] = useState<{ [key: number]: boolean }>({});
  // const [savingAll, setSavingAll] = useState<boolean>(false);
  // const [savingVolumesOnly, setSavingVolumesOnly] = useState<boolean>(false);
  const [removingReactions, setRemovingReactions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (id) {
      dispatch(getSynthesis(parseInt(id)));
      dispatch(getProfile());
    }

    return () => {
      dispatch(clearCurrentSynthesis());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSynthesis?.purity !== undefined && currentSynthesis?.purity !== null) {
      setPurity(currentSynthesis.purity.toString());
    } else {
      setPurity('');
    }
    
    if (currentSynthesis?.reactions) {
      const initialVolumes: { [key: number]: string } = {};
      currentSynthesis.reactions.forEach((reaction) => {
        if (reaction.reaction.ID) {
          initialVolumes[reaction.reaction.ID] = 
            reaction.volume_sm !== undefined && reaction.volume_sm !== null 
              ? reaction.volume_sm.toString() 
              : '';
        }
      });
      setVolumes(initialVolumes);
    }
  }, [currentSynthesis]);

  const handleVolumeChange = (reactionId: number, volume: string) => {
    const sanitizedValue = volume.replace(/[^\d.]/g, '');
    setVolumes(prev => ({
      ...prev,
      [reactionId]: sanitizedValue
    }));
  };

  const handlePurityChange = (newPurity: string) => {
    const sanitizedValue = newPurity.replace(/[^\d.]/g, '');
    setPurity(sanitizedValue);
  };

  const parseNumberOrNull = (value: string): number | null => {
    if (value === '' || value.trim() === '') {
      return null;
    }
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  // Кнопка сохранения только концентрации
  const handleSavePurityOnly = async () => {
    if (!id) return;
    
    const parsedPurity = parseNumberOrNull(purity);
    
    if (parsedPurity === null) {
      setSavingPurity(true);
      try {
        await dispatch(savePurityOnly({
          synthesisId: parseInt(id),
          purity: null
        })).unwrap();
        
        alert('Концентрация очищена!');
      } catch (error: any) {
        console.error('Ошибка сохранения концентрации:', error);
        alert(`Ошибка сохранения концентрации: ${error.message || 'Неизвестная ошибка'}`);
      } finally {
        setSavingPurity(false);
      }
      return;
    }
    
    if (parsedPurity < 0 || parsedPurity > 100) {
      alert('Концентрация должна быть в диапазоне от 0 до 100%');
      return;
    }
    
    setSavingPurity(true);
    try {
      await dispatch(savePurityOnly({
        synthesisId: parseInt(id),
        purity: parsedPurity
      })).unwrap();
      
      alert('Концентрация успешно сохранена!');
    } catch (error: any) {
      console.error('Ошибка сохранения концентрации:', error);
      alert(`Ошибка сохранения концентрации: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setSavingPurity(false);
    }
  };

  // Кнопка сохранения конкретного объема
  const handleSaveVolume = async (reactionId: number, volumeStr: string) => {
    if (!id || !reactionId) {
      alert('Ошибка: не указан ID синтеза или реакции');
      return;
    }
    
    const parsedVolume = parseNumberOrNull(volumeStr);
    
    if (parsedVolume === null) {
      setSavingVolumes(prev => ({ ...prev, [reactionId]: true }));
      try {
        await dispatch(saveReactionVolume({
          synthesisId: parseInt(id),
          reactionId: reactionId,
          volume_sm: null
        })).unwrap();
        
        alert(`Объем для реакции очищен!`);
      } catch (error: any) {
        console.error('Ошибка сохранения объема:', error);
        alert(`Ошибка сохранения объема: ${error.message || 'Неизвестная ошибка'}`);
      } finally {
        setSavingVolumes(prev => ({ ...prev, [reactionId]: false }));
      }
      return;
    }
    
    if (parsedVolume < 0) {
      alert('Объем не может быть отрицательным');
      return;
    }
    
    setSavingVolumes(prev => ({ ...prev, [reactionId]: true }));
    
    try {
      await dispatch(saveReactionVolume({
        synthesisId: parseInt(id),
        reactionId: reactionId,
        volume_sm: parsedVolume
      })).unwrap();
      
      alert(`Объем для реакции успешно сохранен!`);
    } catch (error: any) {
      console.error('Ошибка сохранения объема:', error);
      alert(`Ошибка сохранения объема: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setSavingVolumes(prev => ({ ...prev, [reactionId]: false }));
    }
  };

  // Кнопка сохранения всех полей (концентрация + все объемы)
  

  // Функция для удаления реакции из синтеза
  const handleRemoveReaction = async (reactionId: number) => {
    if (!id) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить эту реакцию из синтеза?')) {
      return;
    }
    
    setRemovingReactions(prev => ({ ...prev, [reactionId]: true }));
    try {
      await dispatch(removeReactionFromSynthesis({
        synthesisId: parseInt(id),
        reactionId: reactionId
      })).unwrap();
      
      // Обновляем синтез после удаления
      dispatch(getSynthesis(parseInt(id)));
      alert('Реакция удалена из синтеза!');
    } catch (error: any) {
      console.error('Ошибка удаления реакции:', error);
      alert(`Ошибка удаления реакции: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setRemovingReactions(prev => ({ ...prev, [reactionId]: false }));
    }
  };

  const handleDeleteSynthesis = async () => {
    if (!id) return;
    
    if (!window.confirm('Вы уверены, что хотите очистить синтез? Все данные будут удалены.')) {
      return;
    }

    try {
      await dispatch(deleteSynthesis(parseInt(id))).unwrap();
      alert('Синтез успешно очищен');
      navigate(ROUTES.REACTION);
    } catch (error: any) {
      console.error('Ошибка удаления синтеза:', error);
      alert(`Ошибка очистки синтеза: ${error.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleFormSynthesis = async () => {
    if (!id || !currentSynthesis) return;
    
    const reactions = currentSynthesis.reactions || [];
    if (reactions.length === 0) {
      alert('Нельзя сформировать пустой синтез. Добавьте хотя бы одну реакцию.');
      return;
    }

    const parsedPurity = parseNumberOrNull(purity);
    if (parsedPurity === null || parsedPurity <= 0 || parsedPurity > 100) {
      alert('Установите корректную концентрацию (от 1 до 100%) перед формированием заявки.');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите сформировать заявку? После этого редактирование будет невозможно.')) {
      return;
    }

    try {
      await dispatch(formSynthesis(parseInt(id))).unwrap();
      alert('Заявка успешно сформирована!');
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

  if (!currentSynthesis) {
    return (
      <div className="synthesis-page">
        <Navigation />
        <Container className="synthesis-container">
          <div className="alert alert-danger">
            Синтез не найден
          </div>
          <Button onClick={() => navigate(ROUTES.HOME)}>
            Вернуться на главную
          </Button>
        </Container>
      </div>
    );
  }

  const reactions = currentSynthesis.reactions || [];
  const isDraft = currentSynthesis.status === 'черновик';

  return (
    <div className="synthesis-page">
      <Navigation />
      <BreadCrumbs />
      <Container className="synthesis-container">
        
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

        <div className="calculation-fields">
          <h3 className="section-title">Заполните поля для расчетов этапов синтеза</h3>
          
          <div className="purity-field">
            <label className="field-label">Концентрация</label>
            <div className="purity-input-row">
              <input
                type="text"
                className="field-input"
                value={purity}
                onChange={(e) => handlePurityChange(e.target.value)}
                disabled={!isDraft}
                placeholder="0-100%"
                inputMode="decimal"
              />
              {isDraft && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleSavePurityOnly}
                  disabled={savingPurity}
                  className="save-purity-btn"
                  style={{color: "#FFFFFF", border: "none"}}
                >
                  {savingPurity ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить концентрацию'
                  )}
                </Button>
              )}
            </div>
          </div>

          {reactions.length > 0 ? (
            reactions.map((synthesisReaction: any, index: number) => {
              const reactionId = synthesisReaction.reaction.ID;
              const isSaving = savingVolumes[reactionId] || false;
              
              return (
                <div key={reactionId || index} className="reaction-volume-field">
                  <label className="field-label">
                    {synthesisReaction.reaction.StartingMaterial || 'Неизвестное вещество'}
                  </label>
                  <div className="volume-input-row">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="V, мл"
                      value={volumes[reactionId] || ''}
                      onChange={(e) => 
                        reactionId && 
                        handleVolumeChange(reactionId, e.target.value)
                      }
                      disabled={!isDraft}
                      inputMode="decimal"
                    />
                    {isDraft && (
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => reactionId && handleSaveVolume(reactionId, volumes[reactionId] || '')}
                        disabled={isSaving || loading}
                        className="save-volume-btn"
                        // style={{color: "#00A88F", border: "1px solid #00A88F"}}
                      >
                        {isSaving ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-1"
                            />
                            ...
                          </>
                        ) : (
                          'Сохранить'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-reactions-message">
              <p>В этом синтезе пока нет реакций</p>
            </div>
          )}
        </div>
        
        {/* Изменяем секцию кнопок сохранения */}
        

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

        <div className="reactions-list">
          {reactions.length > 0 ? (
            reactions.map((synthesisReaction: any, index: number) => {
              const reactionId = synthesisReaction.reaction.ID;
              const isRemoving = removingReactions[reactionId] || false;
              
              return (
                <div key={reactionId || index} className="reaction-item">
                  <div className="reaction-header">
                    <h4 className="reaction-title">
                      {synthesisReaction.reaction.Title || 'Без названия'} 
                      {synthesisReaction.count > 1 && ` (${synthesisReaction.count} шт.)`}
                    </h4>
                    {isDraft && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveReaction(reactionId)}
                        disabled={isRemoving || loading}
                        className="remove-reaction-btn"
                      >
                        {isRemoving ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-1"
                            />
                            Удаление...
                          </>
                        ) : (
                          'Удалить'
                        )}
                      </Button>
                    )}
                  </div>
                  
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
                            {volumes[reactionId] === null || volumes[reactionId] === undefined ? '-' : volumes[reactionId]}
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
              );
            })
          ) : (
            <div className="empty-synthesis">
              <div className="alert alert-info">
                <h5>Синтез пуст</h5>
                <p>Добавьте реакции в синтез, чтобы увидеть их здесь.</p>
                <Button onClick={() => navigate(ROUTES.REACTION)}>
                  Перейти к реакциям
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          {isDraft && (
            <>
              <Button 
                variant="success" 
                onClick={handleFormSynthesis}
                className="action-btn"
                disabled={loading}
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
                  'Сформировать синтез'
                )}
              </Button>
              
              <Button 
                variant="danger" 
                onClick={handleDeleteSynthesis}
                className="action-btn"
                disabled={loading}
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
        </div>

      </Container>
    </div>
  );
};