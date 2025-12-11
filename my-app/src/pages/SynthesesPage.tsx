import { type FC, useEffect, useState } from 'react';
import { Container, Button, Badge, Spinner, Alert, Form, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store/store';
import { getSyntheses, getSynthesis } from '../slices/synthesisSlice';
import { Navigation } from '../components/Navigation';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { ROUTES } from '../../Routes';
import './SynthesesPage.css';

const SynthesesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { syntheses, loading, error } = useSelector((state: RootState) => state.synthesis);

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

  // Состояние для хранения количества реакций для каждого синтеза
  const [reactionsCounts, setReactionsCounts] = useState<{[key: number]: number}>({});
  // Состояние для отслеживания загрузки
  const [loadingReactions, setLoadingReactions] = useState<{[key: number]: boolean}>({});
  // Общее количество реакций во всех завершенных синтезах
  const [totalReactionsCount, setTotalReactionsCount] = useState(0);

  useEffect(() => {
    dispatch(getSyntheses(activeFilters));
  }, [dispatch, activeFilters]);

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
    // Устанавливаем флаг загрузки
    setLoadingReactions(prev => ({ ...prev, [synthesisId]: true }));
    
    try {
      // Используем dispatch getSynthesis из слайса (уже содержит авторизацию)
      const resultAction = await dispatch(getSynthesis(synthesisId));
      
      if (getSynthesis.fulfilled.match(resultAction)) {
        const synthesisData = resultAction.payload;
        
        if (synthesisData?.reactions && Array.isArray(synthesisData.reactions)) {
          // Суммируем все count в реакциях
          const totalCount = synthesisData.reactions.reduce((sum: number, reaction: any) => {
            // reaction.count (с маленькой c) из SynthesisReaction
            return sum + (reaction.count || 0);
          }, 0);
          
          console.log(`Synthesis ${synthesisId}: found ${totalCount} reactions`);
          
          // Обновляем количество реакций для этого синтеза
          setReactionsCounts(prev => ({
            ...prev,
            [synthesisId]: totalCount
          }));
          
          return totalCount; // Возвращаем результат для подсчета общей суммы
        } else {
          console.log(`Synthesis ${synthesisId}: no reactions found in response`);
          setReactionsCounts(prev => ({
            ...prev,
            [synthesisId]: 0
          }));
          return 0;
        }
      } else {
        console.log(`Synthesis ${synthesisId}: dispatch failed`);
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
      // Снимаем флаг загрузки
      setLoadingReactions(prev => ({ ...prev, [synthesisId]: false }));
    }
  };

  // Загружаем количество реакций для всех завершенных синтезов и считаем общую сумму
  useEffect(() => {
    const loadAllReactionsCounts = async () => {
      if (!syntheses || !Array.isArray(syntheses)) return;
      
      const completedSyntheses = syntheses.filter(s => s.status === 'завершён');
      
      console.log('Found completed syntheses:', completedSyntheses.map(s => s.id));
      
      let totalCount = 0;
      const counts: {[key: number]: number} = {};
      
      // Загружаем все параллельно
      const promises = completedSyntheses.map(async (synthesis) => {
        // Загружаем только если еще не загружено и не в процессе загрузки
        if (!reactionsCounts[synthesis.id] && !loadingReactions[synthesis.id]) {
          console.log(`Loading reactions count for synthesis ${synthesis.id}`);
          const count = await loadReactionsCount(synthesis.id);
          counts[synthesis.id] = count;
          return count;
        } else if (reactionsCounts[synthesis.id]) {
          // Уже загружено - используем существующее значение
          counts[synthesis.id] = reactionsCounts[synthesis.id];
          return reactionsCounts[synthesis.id];
        }
        return 0;
      });
      
      // Ждем завершения всех загрузок
      const results = await Promise.all(promises);
      
      // Считаем общую сумму
      totalCount = results.reduce((sum, count) => sum + count, 0);
      
      // Обновляем состояния
      setReactionsCounts(prev => ({ ...prev, ...counts }));
      setTotalReactionsCount(totalCount);
      
      console.log('Total reactions count:', totalCount);
    };
    
    loadAllReactionsCounts();
  }, [syntheses]);

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
  };

  const synthesesArray = Array.isArray(syntheses) ? syntheses : [];
  const hasActiveFilters = activeFilters.status || activeFilters.start_date || activeFilters.end_date;

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
        <h2>Мои заявки на синтез</h2>
        <BreadCrumbs />
        
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
              
              <Col md={3} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button 
                    variant="primary" 
                    onClick={handleApplyFilters}
                    className="flex-fill"
                  >
                    Применить
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
                <div className="d-flex align-items-center">
                  <Badge bg="info" className="me-2">
                    Найдено синтезов: {synthesesArray.length}
                  </Badge>
                  {hasCompletedSyntheses && (
                    <>
                      {allReactionsLoaded ? (
                        <Badge bg="info" className="me-2">
                          Всего результатов реакций: {totalReactionsCount}
                        </Badge>
                      ) : (
                        <div className="d-flex align-items-center">
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
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <Card.Title className="mb-1">Заявка #{synthesis.id}</Card.Title>
                        <Card.Subtitle className="text-muted">
                          Создана: {synthesis.created_at || '-'}
                        </Card.Subtitle>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <Badge bg={getStatusVariant(synthesis.status)} className="synthesis-status mb-2">
                          {synthesis.status}
                        </Badge>
                        {/* Показываем количество реакций только для завершенных синтезов */}
                        {synthesis.status === 'завершён' && (
                          <div className="reactions-count">
                            {loadingReactions[synthesis.id] ? (
                              <div className="d-flex align-items-center">
                                <Spinner animation="border" size="sm" className="me-2" />
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
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="synthesis-actions">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate(`${ROUTES.SYNTHESIS.replace(':id', synthesis.id.toString())}`)}
                          className="me-2"
                        >
                          Просмотреть
                        </Button>
                        {synthesis.status === 'черновик' && (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => navigate(`${ROUTES.SYNTHESIS.replace(':id', synthesis.id.toString())}`)}
                          >
                            Продолжить
                          </Button>
                        )}
                      </div>
                      <small className="text-muted">
                        Обновлена: {synthesis.updated_at || synthesis.created_at}
                      </small>
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
                  onClick={() => dispatch(getSyntheses(activeFilters))}
                >
                  Обновить
                </Button>
              </div>
            </Alert>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SynthesesPage;