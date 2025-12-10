import { type FC, useEffect, useState } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Form, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store/store';
import { getSyntheses } from '../slices/synthesisSlice';
import { Navigation } from '../components/Navigation';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { ROUTES } from '../../Routes';
import './SynthesesPage.css';

const SynthesesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { syntheses, loading, error } = useSelector((state: RootState) => state.synthesis);

  // Состояния для фильтров
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    dispatch(getSyntheses(filters));
  }, [dispatch]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'сформирован': return 'primary';
      case 'завершён': return 'success';
      case 'отклонён': return 'danger';
      default: return 'secondary';
    }
  };

  // Обработчики изменения фильтров
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Применить фильтры
  const handleApplyFilters = () => {
    dispatch(getSyntheses(filters));
  };

  // Сбросить фильтры
  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      start_date: '',
      end_date: ''
    };
    setFilters(resetFilters);
    dispatch(getSyntheses(resetFilters));
  };

  // Преобразуем syntheses в массив, если это необходимо
  const synthesesArray = Array.isArray(syntheses) ? syntheses : [];

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return dateString;
  };

  // Проверяем, применены ли какие-либо фильтры
  const hasActiveFilters = filters.status || filters.start_date || filters.end_date;

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
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
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
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Дата по</Form.Label>
                  <Form.Control 
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
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
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                  >
                    Сбросить
                  </Button>
                </div>
              </Col>
            </Row>
            
            {/* Индикатор активных фильтров */}
            {hasActiveFilters && (
              <div className="mt-3">
                <small className="text-muted">
                  Активные фильтры: 
                  {filters.status && ` Статус: ${filters.status}`}
                  {filters.start_date && ` Дата с: ${filters.start_date}`}
                  {filters.end_date && ` Дата по: ${filters.end_date}`}
                </small>
              </div>
            )}
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
            <p>Загрузка заявок...</p>
          </div>
        ) : (
          <>
            {synthesesArray.length > 0 && (
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <Badge bg="info">Найдено заявок: {synthesesArray.length}</Badge>
                {hasActiveFilters && (
                  <Badge bg="warning" text="dark">
                    Применены фильтры
                  </Badge>
                )}
              </div>
            )}
            
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Дата создания</th>
                  <th>Статус</th>
                  <th>Концентрация</th>
                  <th>Создатель</th>
                  <th>Модератор</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {synthesesArray.map((synthesis) => (
                  <tr key={synthesis.id}>
                    <td>{synthesis.id}</td>
                    <td>{formatDate(synthesis.created_at)}</td>
                    <td>
                      <Badge bg={getStatusVariant(synthesis.status)}>
                        {synthesis.status}
                      </Badge>
                    </td>
                    <td>{synthesis.purity}%</td>
                    <td>{synthesis.creator_login || '-'}</td>
                    <td>{synthesis.moderator_login || '-'}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate(`${ROUTES.SYNTHESIS.replace(':id', synthesis.id.toString())}`)}
                      >
                        Просмотреть
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
                onClick={() => dispatch(getSyntheses(filters))}
              >
                Обновить
              </Button>
            </Alert>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SynthesesPage;