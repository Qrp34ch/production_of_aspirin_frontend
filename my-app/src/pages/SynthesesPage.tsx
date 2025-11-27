import { type FC, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
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

  useEffect(() => {
    dispatch(getSyntheses({}));
  }, [dispatch]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'черновик': return 'secondary';
      case 'сформирован': return 'primary';
      case 'завершён': return 'success'; // Обратите внимание на букву 'ё'
      case 'отклонён': return 'danger';  // Обратите внимание на букву 'ё'
      default: return 'secondary';
    }
  };

  // Преобразуем syntheses в массив, если это необходимо
  const synthesesArray = Array.isArray(syntheses) ? syntheses : [];

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return dateString;
  };

  return (
    <div className="syntheses-page">
      <Navigation />
      <Container className="mt-4">
        <h2>Мои заявки на синтез</h2>
        <BreadCrumbs />
        
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
              <div className="mb-3">
                <Badge bg="info">Всего заявок: {synthesesArray.length}</Badge>
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
              <p>У вас пока нет заявок на синтез или произошла ошибка при загрузке.</p>
              <Button onClick={() => navigate(ROUTES.REACTION)}>
                Перейти к реакциям
              </Button>
              <Button 
                variant="outline-primary" 
                className="ms-2"
                onClick={() => dispatch(getSyntheses({}))}
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