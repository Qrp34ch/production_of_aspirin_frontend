import { type FC, useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store/store';
import { registerUser, clearError } from '../slices/userSlice';
import { Navigation } from '../components/Navigation';
import { ROUTES } from '../../Routes';
import './RegisterPage.css';

const RegisterPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState({
    login: '',
    pass: '',
    fio: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.login && formData.pass && formData.fio) {
      const result = await dispatch(registerUser(formData));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate(ROUTES.LOGIN);
      }
    }
  };

  return (
    <div className="register-page">
      <Navigation />
      <Container className="register-container">
        <Card className="register-card">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="register-title">Регистрация</h2>
              <p className="register-subtitle">Создайте новый аккаунт</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>ФИО</Form.Label>
                <Form.Control
                  type="text"
                  name="fio"
                  value={formData.fio}
                  onChange={handleChange}
                  placeholder="Введите ваше полное имя"
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Придумайте логин"
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="pass"
                  value={formData.pass}
                  onChange={handleChange}
                  placeholder="Придумайте пароль"
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 register-button"
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
                    Регистрация...
                  </>
                ) : (
                  'Зарегистрироваться'
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span className="login-link">
                Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
              </span>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default RegisterPage;