// src/config/api.ts
// Конфигурация API URLs для разных окружений

export const getApiBaseUrl = (): string => {
  // В продакшене (GitHub Pages) используем абсолютный URL к вашему бэкенду
  if (import.meta.env.PROD) {
    return 'http://192.168.0.102:8080/API'; // Ваш IP
  }
  
  // В разработке используем proxy (localhost)
  return '/API';
};

// Для Tauri приложения
export const getTauriApiBaseUrl = (): string => {
  // Tauri будет использовать ваш локальный IP
  return 'http://192.168.0.102:8080/API'; // Ваш IP
};