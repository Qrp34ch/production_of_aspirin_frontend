import { type FC, useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store/store.ts';
import { loginUser, clearError } from '../slices/userSlice';
import { Navigation } from '../components/Navigation';
import { ROUTES } from '../../Routes';
import './LoginPage.css';

const LoginPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState({
    login: '',
    password: ''
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
    if (formData.login && formData.password) {
      await dispatch(loginUser(formData));
    }
  };

  return (
    <div className="login-page">
      <Navigation />
      <Container className="login-container">
        <Card className="login-card">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="login-title">Вход в систему</h2>
              <p className="login-subtitle">Войдите в свой аккаунт</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Введите ваш логин"
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите ваш пароль"
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 login-button"
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
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span className="register-link">
                Нет аккаунта? <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
              </span>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;