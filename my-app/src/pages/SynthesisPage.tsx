import { type FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, Spinner } from 'react-bootstrap';
import { type AppDispatch, type RootState } from '../store/store';
import { 
  getSynthesis, 
  clearCurrentSynthesis, 
  // saveSynthesisChanges, 
  savePurityOnly,
  saveReactionVolume,
  saveVolumesOnly, // Добавляем новый action
  deleteSynthesis, 
  formSynthesis 
} from '../slices/synthesisSlice';
import { getProfile } from '../slices/userSlice';
import { Navigation } from '../components/Navigation';
import { ROUTES } from '../../Routes';
import { transformImageUrl } from '../target_config';
import defimage from "../assets/DefaultImage.jpg";
import './SynthesisPage.css';
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
  // const [savingVolumes, setSavingVolumes] = useState<{ [key: number]: boolean }>({});
  const [savingAll, setSavingAll] = useState<boolean>(false);
  const [savingVolumesOnly, setSavingVolumesOnly] = useState<boolean>(false); // Новое состояние

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
  // const handleSaveVolume = async (reactionId: number, volumeStr: string) => {
  //   if (!id || !reactionId) {
  //     alert('Ошибка: не указан ID синтеза или реакции');
  //     return;
  //   }
    
  //   const parsedVolume = parseNumberOrNull(volumeStr);
    
  //   if (parsedVolume === null) {
  //     setSavingVolumes(prev => ({ ...prev, [reactionId]: true }));
  //     try {
  //       await dispatch(saveReactionVolume({
  //         synthesisId: parseInt(id),
  //         reactionId: reactionId,
  //         volume_sm: null
  //       })).unwrap();
        
  //       alert(`Объем для реакции очищен!`);
  //     } catch (error: any) {
  //       console.error('Ошибка сохранения объема:', error);
  //       alert(`Ошибка сохранения объема: ${error.message || 'Неизвестная ошибка'}`);
  //     } finally {
  //       setSavingVolumes(prev => ({ ...prev, [reactionId]: false }));
  //     }
  //     return;
  //   }
    
  //   if (parsedVolume < 0) {
  //     alert('Объем не может быть отрицательным');
  //     return;
  //   }
    
  //   setSavingVolumes(prev => ({ ...prev, [reactionId]: true }));
    
  //   try {
  //     await dispatch(saveReactionVolume({
  //       synthesisId: parseInt(id),
  //       reactionId: reactionId,
  //       volume_sm: parsedVolume
  //     })).unwrap();
      
  //     alert(`Объем для реакции успешно сохранен!`);
  //   } catch (error: any) {
  //     console.error('Ошибка сохранения объема:', error);
  //     alert(`Ошибка сохранения объема: ${error.message || 'Неизвестная ошибка'}`);
  //   } finally {
  //     setSavingVolumes(prev => ({ ...prev, [reactionId]: false }));
  //   }
  // };

  // Кнопка сохранения всех полей (концентрация + все объемы)
  const handleSaveAll = async () => {
    if (!id) return;
    
    setSavingAll(true);
    try {
      // Сохраняем концентрацию
      const parsedPurity = parseNumberOrNull(purity);
      if (parsedPurity !== null && parsedPurity >= 0 && parsedPurity <= 100) {
        await dispatch(savePurityOnly({
          synthesisId: parseInt(id),
          purity: parsedPurity
        })).unwrap();
      } else if (parsedPurity === null) {
        await dispatch(savePurityOnly({
          synthesisId: parseInt(id),
          purity: null
        })).unwrap();
      }
      
      // Затем сохраняем все объемы
      const savePromises = Object.entries(volumes).map(([reactionId, volumeStr]) => {
        const parsedVolume = parseNumberOrNull(volumeStr);
        if (parsedVolume !== null && parsedVolume >= 0) {
          return dispatch(saveReactionVolume({
            synthesisId: parseInt(id),
            reactionId: parseInt(reactionId),
            volume_sm: parsedVolume
          })).unwrap();
        } else if (parsedVolume === null) {
          return dispatch(saveReactionVolume({
            synthesisId: parseInt(id),
            reactionId: parseInt(reactionId),
            volume_sm: null
          })).unwrap();
        }
        return Promise.resolve();
      });
      
      await Promise.all(savePromises);
      
      alert('Все данные успешно сохранены!');
    } catch (error: any) {
      console.error('Ошибка сохранения всех данных:', error);
      alert(`Ошибка сохранения: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setSavingAll(false);
    }
  };

  // Новая функция: сохранение только объемов (без концентрации)
  const handleSaveVolumesOnly = async () => {
    if (!id) return;
    
    setSavingVolumesOnly(true);
    try {
      const volumesToSave: { [key: number]: number | null } = {};
      Object.entries(volumes).forEach(([key, value]) => {
        volumesToSave[parseInt(key)] = parseNumberOrNull(value);
      });
      
      await dispatch(saveVolumesOnly({
        synthesisId: parseInt(id),
        volumes: volumesToSave
      })).unwrap();
      
      alert('Объемы успешно сохранены!');
    } catch (error: any) {
      console.error('Ошибка сохранения объемов:', error);
      alert(`Ошибка сохранения объемов: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setSavingVolumesOnly(false);
    }
  };

  // Старая функция сохранения изменений (сохраняет и концентрацию, и объемы)
  // const handleSaveChanges = async () => {
  //   if (!id) return;
    
  //   try {
  //     const parsedPurity = parseNumberOrNull(purity);
      
  //     const volumesToSave: { [key: number]: number | null } = {};
  //     Object.entries(volumes).forEach(([key, value]) => {
  //       volumesToSave[parseInt(key)] = parseNumberOrNull(value);
  //     });
      
  //     await dispatch(saveSynthesisChanges({
  //       synthesisId: parseInt(id),
  //       purity: parsedPurity,
  //       volumes: volumesToSave
  //     })).unwrap();
      
  //     alert('Изменения успешно сохранены!');
  //   } catch (error: any) {
  //     console.error('Ошибка сохранения:', error);
  //     alert(`Ошибка сохранения: ${error.message || 'Неизвестная ошибка'}`);
  //   }
  // };

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
            <div className="field-input-group">
              <input
                type="text"
                className="field-input"
                value={purity}
                onChange={(e) => handlePurityChange(e.target.value)}
                disabled={!isDraft}
                placeholder="0-100%"
                inputMode="decimal"
              />
              <div className="field-actions">
                {isDraft && (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handleSavePurityOnly}
                    disabled={savingPurity}
                    className="save-field-btn"
                  >
                    {savingPurity ? (
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
                      'Сохранить концентрацию'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {reactions.length > 0 ? (
            reactions.map((synthesisReaction: any, index: number) => (
              <div key={synthesisReaction.reaction.ID || index} className="reaction-volume-field">
                <label className="field-label">
                  {synthesisReaction.reaction.StartingMaterial || 'Неизвестное вещество'}
                </label>
                <div className="field-input-group">
                  <input
                    type="text"
                    className="field-input"
                    placeholder="V, мл"
                    value={volumes[synthesisReaction.reaction.ID!] || ''}
                    onChange={(e) => 
                      synthesisReaction.reaction.ID && 
                      handleVolumeChange(synthesisReaction.reaction.ID, e.target.value)
                    }
                    disabled={!isDraft}
                    inputMode="decimal"
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
        
        {/* Изменяем секцию кнопок сохранения */}
        {isDraft && (
          <div className="save-buttons-section">
            <div className="save-buttons">
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleSaveVolumesOnly} // Теперь сохраняет только объемы
                className="save-changes-btn me-2"
                disabled={loading || savingVolumesOnly}
              >
                {loading || savingVolumesOnly ? (
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
                  'Сохранить объемы' // Изменяем текст
                )}
              </Button>
              
              <Button 
                variant="success" 
                size="sm"
                onClick={handleSaveAll}
                className="save-all-btn"
                disabled={loading || savingAll}
              >
                {loading || savingAll ? (
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
                  'Сохранить черновик синтеза' // Оставляем старый текст
                )}
              </Button>
            </div>
          </div>
        )}

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
            reactions.map((synthesisReaction: any, index: number) => (
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
                          {volumes[synthesisReaction.reaction.ID!] === null || volumes[synthesisReaction.reaction.ID!] === undefined ? '-' : volumes[synthesisReaction.reaction.ID!]}
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