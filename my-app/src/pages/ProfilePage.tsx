import { type FC, useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store/store';
import { getProfile, updateProfile } from '../slices/userSlice';
import { Navigation } from '../components/Navigation';
import './ProfilePage.css';

const ProfilePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState({
    login: '',
    fio: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        login: user.login || '',
        fio: user.fio || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    const updateData: any = {
      login: formData.login,
      fio: formData.fio
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    const result = await dispatch(updateProfile(updateData));
    
    if (result.meta.requestStatus === 'fulfilled') {
      setMessage('Данные успешно обновлены');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  return (
    <div className="profile-page">
      <Navigation />
      <Container className="mt-4">
        <Card>
          <Card.Body>
            <h2>Личный кабинет</h2>
            
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>ФИО</Form.Label>
                <Form.Control
                  type="text"
                  name="fio"
                  value={formData.fio}
                  onChange={handleChange}
                  placeholder="Введите ваше ФИО"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Введите логин"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Новый пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите новый пароль"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Подтвердите пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Подтвердите новый пароль"
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="save-button"
              >
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;