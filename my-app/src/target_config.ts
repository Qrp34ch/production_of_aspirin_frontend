// const target_tauri = true;

// export const API_BASE_URL = target_tauri 
//   ? 'http://192.168.0.102:8080/API'  // Для Tauri - прямой IP
//   : '/API';                       // Для веб - proxy

// export const IMAGE_BASE_URL = target_tauri
//   ? 'http://192.168.0.102:9000'  // Для Tauri - прямой IP
//   : '';                          // Для веб - относительные пути

// export const BASE_PATH = target_tauri 
//   ? '' 
//   : '/RIP_frontend';
export const getApiBaseUrl = (): string => {
  // const isTauri = typeof window !== 'undefined' && (window as any).TAURI !== undefined;
  return 'http://192.168.0.102:8080';
};

export const API_BASE_URL = getApiBaseUrl(); // Используйте функцию
export const IMAGE_BASE_URL = getApiBaseUrl().replace('/API', ''); // Для изображений






// export const isTauri = (): boolean => {
//   if (typeof window === 'undefined') return false;
  
//   // Проверяем разные способы определения Tauri
//   return !!(window as any).__TAURI__ ||
//          window.location.hostname === 'tauri.localhost';
// };

// // Получаем базовый URL API
// export const getApiBaseUrl = (): string => {
//   if (isTauri()) {
//     // В Tauri используем localhost
//     return 'http://localhost:8080';
//   }
  
//   // В вебе используем относительный путь
//   return '/API';
// };

// // Получаем базовый URL для изображений
// export const getImageBaseUrl = (): string => {
//   if (isTauri()) {
//     return 'http://localhost:9000';
//   }
//   return '';
// };

// // Получаем базовый путь для роутера
// export const getBasePath = (): string => {
//   if (isTauri()) {
//     return '';  // В Tauri нет подпапки
//   }
//   return '/RIP_frontend';  // В вебе есть подпапка
// };