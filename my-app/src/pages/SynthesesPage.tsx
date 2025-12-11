import { type FC, useEffect, useState, useRef } from 'react';
import { Container, Button, Badge, Spinner, Alert, Form, Row, Col, Card, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store/store';
import { getSyntheses, getSynthesis } from '../slices/synthesisSlice';
import { Navigation } from '../components/Navigation';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { ROUTES } from '../../Routes';
import { api } from '../api';
import './SynthesesPage.css';

const SynthesesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { syntheses, loading, error } = useSelector((state: RootState) => state.synthesis);
  const { user } = useSelector((state: RootState) => state.user);
  
  // Проверяем, является ли пользователь модератором
  const isModerator = user?.is_moderator || false;
  
  const [inputValues, setInputValues] = useState({
    status: '',
    start_date: '',
    end_date: ''
  });

  const [activeFilters, setActiveFilters] = useState({
    status: '',
    start_date: '',
    end_date: ''
  });

  // Состояние для фильтрации по создателю (на фронтенде)
  const [creatorFilter, setCreatorFilter] = useState('');
  const [filteredSyntheses, setFilteredSyntheses] = useState<any[]>([]);
  
  // Состояние для хранения количества реакций для каждого синтеза
  const [reactionsCounts, setReactionsCounts] = useState<{[key: number]: number}>({});
  // Состояние для отслеживания загрузки
  const [loadingReactions, setLoadingReactions] = useState<{[key: number]: boolean}>({});
  // Общее количество реакций во всех завершенных синтезах
  const [totalReactionsCount, setTotalReactionsCount] = useState(0);
  
  // Состояние для модального окна изменения статуса
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSynthesis, setSelectedSynthesis] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Ref для short polling
  const pollingRef = useRef<number | null>(null);

  // Функция для загрузки заявок
  const fetchSyntheses = () => {
    dispatch(getSyntheses(activeFilters));
  };

  // Short polling для модератора
  useEffect(() => {
    if (isModerator) {
      // Первый запрос
      fetchSyntheses();
      
      // Настраиваем интервал для периодического обновления
      const intervalId = setInterval(fetchSyntheses, 5000); // Обновляем каждые 5 секунд
      pollingRef.current = intervalId;
      
      // Очистка при размонтировании
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    } else {
      // Для обычных пользователей загружаем только при изменении фильтров
      fetchSyntheses();
    }
  }, [dispatch, activeFilters, isModerator]);

  // Инициализация дат при монтировании
  useEffect(() => {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    
    setInputValues(prev => ({
      ...prev,
      start_date: todayFormatted,
      end_date: todayFormatted
    }));
  }, []);

  // Функция для загрузки количества реакций для конкретного синтеза
  const loadReactionsCount = async (synthesisId: number) => {
    setLoadingReactions(prev => ({ ...prev, [synthesisId]: true }));
    
    try {
      const resultAction = await dispatch(getSynthesis(synthesisId));
      
      if (getSynthesis.fulfilled.match(resultAction)) {
        const synthesisData = resultAction.payload;
        
        if (synthesisData?.reactions && Array.isArray(synthesisData.reactions)) {
          const totalCount = synthesisData.reactions.reduce((sum: number, reaction: any) => {
            return sum + (reaction.count || 0);
          }, 0);
          
          setReactionsCounts(prev => ({
            ...prev,
            [synthesisId]: totalCount
          }));
          
          return totalCount;
        } else {
          setReactionsCounts(prev => ({
            ...prev,
            [synthesisId]: 0
          }));
          return 0;
        }
      } else {
        setReactionsCounts(prev => ({
          ...prev,
          [synthesisId]: 0
        }));
        return 0;
      }
    } catch (error) {
      console.error(`Error loading reactions count for synthesis ${synthesisId}:`, error);
      setReactionsCounts(prev => ({
        ...prev,
        [synthesisId]: 0
      }));
      return 0;
    } finally {
      setLoadingReactions(prev => ({ ...prev, [synthesisId]: false }));
    }
  };

  // Загружаем количество реакций для всех завершенных синтезов и считаем общую сумму
  useEffect(() => {
    const loadAllReactionsCounts = async () => {
      if (!syntheses || !Array.isArray(syntheses)) return;
      
      const completedSyntheses = syntheses.filter(s => s.status === 'завершён');
      
      let totalCount = 0;
      const counts: {[key: number]: number} = {};
      
      const promises = completedSyntheses.map(async (synthesis) => {
        if (!reactionsCounts[synthesis.id] && !loadingReactions[synthesis.id]) {
          const count = await loadReactionsCount(synthesis.id);
          counts[synthesis.id] = count;
          return count;
        } else if (reactionsCounts[synthesis.id]) {
          counts[synthesis.id] = reactionsCounts[synthesis.id];
          return reactionsCounts[synthesis.id];
        }
        return 0;
      });
      
      const results = await Promise.all(promises);
      totalCount = results.reduce((sum, count) => sum + count, 0);
      
      setReactionsCounts(prev => ({ ...prev, ...counts }));
      setTotalReactionsCount(totalCount);
    };
    
    loadAllReactionsCounts();
  }, [syntheses]);

  // Фильтрация по создателю на фронтенде
  useEffect(() => {
    if (syntheses && Array.isArray(syntheses)) {
      let filtered = [...syntheses];
      
      if (creatorFilter) {
        filtered = filtered.filter(s => 
          s.creator_login?.toLowerCase().includes(creatorFilter.toLowerCase())
        );
      }
      
      setFilteredSyntheses(filtered);
    }
  }, [syntheses, creatorFilter]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'сформирован': return 'primary';
      case 'завершён': return 'success';
      case 'отклонён': return 'danger';
      case 'черновик': return 'warning';
      default: return 'secondary';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    setActiveFilters(inputValues);
  };

  const handleResetFilters = () => {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    
    const resetInputValues = {
      status: '',
      start_date: todayFormatted,
      end_date: todayFormatted
    };
    
    setInputValues(resetInputValues);
    setActiveFilters({
      status: '',
      start_date: '',
      end_date: ''
    });
    setCreatorFilter('');
  };

  // Функция для открытия модального окна изменения статуса
  const handleOpenStatusModal = (synthesis: any) => {
    setSelectedSynthesis(synthesis);
    setNewStatus('');
    setShowStatusModal(true);
  };

  // Функция для изменения статуса заявки
  const handleChangeStatus = async () => {
    if (!selectedSynthesis || !newStatus) return;
    
    setStatusLoading(true);
    try {
      const newStatusBoolean = newStatus === 'завершён'; // true для завершения, false для отклонения
      
      await api.api.synthesisModerateUpdate(selectedSynthesis.id, {
        new_status: newStatusBoolean
      });
      
      // Обновляем список заявок после изменения статуса
      fetchSyntheses();
      
      setShowStatusModal(false);
      setSelectedSynthesis(null);
      setNewStatus('');
      
      // Показываем уведомление об успехе
      alert(`Статус заявки #${selectedSynthesis.id} успешно изменен на "${newStatus}"`);
    } catch (error: any) {
      console.error('Ошибка при изменении статуса:', error);
      alert('Ошибка при изменении статуса: ' + (error.response?.data?.description || error.message));
    } finally {
      setStatusLoading(false);
    }
  };

  const synthesesArray = filteredSyntheses;
  const hasActiveFilters = activeFilters.status || activeFilters.start_date || activeFilters.end_date || creatorFilter;

  // Проверяем, есть ли завершенные синтезы
  const hasCompletedSyntheses = synthesesArray.some(s => s.status === 'завершён');
  // Проверяем, все ли реакции загружены
  const allReactionsLoaded = synthesesArray
    .filter(s => s.status === 'завершён')
    .every(s => reactionsCounts[s.id] !== undefined);

  return (
    <div className="syntheses-page">
      <Navigation />
      <Container className="mt-4">
        <h2>{isModerator ? 'Все заявки на синтез (модератор)' : 'Мои заявки на синтез'}</h2>
        <BreadCrumbs />
        
        {isModerator && (
          <Alert variant="info" className="mb-3 moderator-alert">
            <div className="d-flex align-items-center">
              
              <span>Режим модератора</span>
            </div>
          </Alert>
        )}
        
        {/* Карточка с фильтрами */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Фильтры</h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Статус</Form.Label>
                  <Form.Select 
                    value={inputValues.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="">Все статусы</option>
                    <option value="черновик">Черновик</option>
                    <option value="сформирован">Сформирован</option>
                    <option value="завершён">Завершён</option>
                    <option value="отклонён">Отклонён</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Дата с</Form.Label>
                  <Form.Control 
                    type="date"
                    value={inputValues.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Дата по</Form.Label>
                  <Form.Control 
                    type="date"
                    value={inputValues.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              {isModerator && (
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Создатель (поиск)</Form.Label>
                    <Form.Control 
                      type="text"
                      placeholder="Введите логин создателя..."
                      value={creatorFilter}
                      onChange={(e) => setCreatorFilter(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              )}
              
              <Col md={isModerator ? 12 : 3} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button 
                    variant="primary" 
                    onClick={handleApplyFilters}
                    className="flex-fill"
                  >
                    Применить фильтры
                  </Button>
                  
                  
                </div>
              </Col>
            </Row>
            
          </Card.Body>
        </Card>
        
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
            <p>Загрузка синтезов...</p>
          </div>
        ) : (
          <>
            {synthesesArray.length > 0 && (
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center flex-wrap">
                  <Badge bg="info" className="me-2 mb-2">
                    {isModerator ? 'Всего заявок:' : 'Мои заявки:'} {synthesesArray.length}
                  </Badge>
                  {hasCompletedSyntheses && (
                    <>
                      {allReactionsLoaded ? (
                        <Badge bg="info" className="me-2 mb-2">
                          Всего результатов реакций: {totalReactionsCount}
                        </Badge>
                      ) : (
                        <div className="d-flex align-items-center mb-2">
                          <Spinner animation="border" size="sm" className="me-2" />
                          <small className="text-muted">Подсчет реакций...</small>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Сетка карточек */}
            <div className="syntheses-grid">
              {synthesesArray.map((synthesis) => (
                <Card key={synthesis.id} className="synthesis-card">
                  <Card.Body>
                    {/* Заголовок */}
                    <div className="synthesis-header">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title className="mb-1">Заявка #{synthesis.id}</Card.Title>
                          <Card.Subtitle className="text-muted">
                            Создана: {synthesis.created_at || '-'}
                          </Card.Subtitle>
                        </div>
                        <div className="synthesis-status-wrapper">
                          <Badge bg={getStatusVariant(synthesis.status)} className="synthesis-status">
                            {synthesis.status}
                          </Badge>
                          {/* Показываем количество реакций только для завершенных синтезов */}
                          {synthesis.status === 'завершён' && (
                            <div className="reactions-count">
                              {loadingReactions[synthesis.id] ? (
                                <div className="d-flex align-items-center">
                                  <Spinner animation="border" size="sm" className="me-1" />
                                  <small className="text-muted">Загрузка...</small>
                                </div>
                              ) : reactionsCounts[synthesis.id] !== undefined ? (
                                <Badge bg="warning" className="synthesis-reactions-badge">
                                  Реакций: {reactionsCounts[synthesis.id]}
                                </Badge>
                              ) : (
                                <small className="text-muted">Не загружено</small>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Детали заявки */}
                    <div className="synthesis-details-container">
                      <div className="synthesis-details">
                        <div className="detail-row">
                          <span className="detail-label">Концентрация:</span>
                          <span className="detail-value">{synthesis.purity || 0}%</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Создатель:</span>
                          <span className="detail-value">{synthesis.creator_login || '-'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Модератор:</span>
                          <span className="detail-value">{synthesis.moderator_login || '-'}</span>
                        </div>
                        {synthesis.finished_at && (
                          <div className="detail-row">
                            <span className="detail-label">Дата завершения:</span>
                            <span className="detail-value">{synthesis.finished_at}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Футер с кнопками */}
                    <div className="synthesis-card-footer">
                      <div className="synthesis-actions-container">
                        <div className={`synthesis-buttons-row ${isModerator ? 'moderator-mode' : ''}`}>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate(`${ROUTES.SYNTHESIS.replace(':id', synthesis.id.toString())}`)}
                            className="btn-sm"
                          >
                            Просмотреть
                          </Button>
                          {synthesis.status === 'черновик' && !isModerator && (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => navigate(`${ROUTES.SYNTHESIS.replace(':id', synthesis.id.toString())}`)}
                              className="btn-sm"
                            >
                              Продолжить
                            </Button>
                          )}
                          
                          {/* Кнопки модератора */}
                          {isModerator && synthesis.status === 'сформирован' && (
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              onClick={() => handleOpenStatusModal(synthesis)}
                              className="btn-sm"
                            >
                              Изменить статус
                            </Button>
                          )}
                        </div>
                        <div className="synthesis-date-row">
                          <small className="text-muted synthesis-date">
                            Обновлена: {synthesis.updated_at || synthesis.created_at}
                          </small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>
        )}

        {!loading && synthesesArray.length === 0 && (
          <div className="text-center mt-4">
            <Alert variant="info">
              <h5>Заявки не найдены</h5>
              <p>
                {hasActiveFilters 
                  ? 'По выбранным фильтрам заявок не найдено. Попробуйте изменить условия поиска.' 
                  : isModerator
                    ? 'На данный момент нет заявок на модерацию.'
                    : 'У вас пока нет заявок на синтез или произошла ошибка при загрузке.'
                }
              </p>
              <div className="mt-3">
                <Button onClick={() => navigate(ROUTES.REACTION)}>
                  Перейти к реакциям
                </Button>
                {hasActiveFilters && (
                  <Button 
                    variant="outline-primary" 
                    className="ms-2"
                    onClick={handleResetFilters}
                  >
                    Сбросить фильтры
                  </Button>
                )}
                <Button 
                  variant="outline-primary" 
                  className="ms-2"
                  onClick={fetchSyntheses}
                >
                  Обновить
                </Button>
              </div>
            </Alert>
          </div>
        )}
      </Container>

      {/* Модальное окно для изменения статуса */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Изменение статуса заявки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSynthesis && (
            <>
              <p>
                Заявка #{selectedSynthesis.id} от {selectedSynthesis.creator_login}
              </p>
              <p>
                Текущий статус: <Badge bg={getStatusVariant(selectedSynthesis.status)}>
                  {selectedSynthesis.status}
                </Badge>
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Новый статус:</Form.Label>
                <Form.Select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={statusLoading}
                >
                  <option value="">Выберите статус</option>
                  <option value="завершён">Завершён</option>
                  <option value="отклонён">Отклонён</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowStatusModal(false)}
            disabled={statusLoading}
          >
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleChangeStatus}
            disabled={!newStatus || statusLoading}
          >
            {statusLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Изменение...
              </>
            ) : (
              'Изменить статус'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SynthesesPage;