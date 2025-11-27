import { Api } from './Api';
import { getApiBaseUrl } from '../config/api';

// Создаем инстанс API
export const api = new Api({
  baseURL: getApiBaseUrl(),
});

// Интерцептор для добавления токена
api.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
api.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);