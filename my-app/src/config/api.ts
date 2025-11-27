// import { API_BASE_URL } from '../target_config';

export const getApiBaseUrl = (): string => {
  // В Tauri — прямой URL, в браузере — относительный путь (проксируется)
  // const isTauri = typeof window !== 'undefined' && (window as any).TAURI !== undefined;
  // return isTauri ? 'http://192.168.0.102:8080/API' : '/API';
  return 'https://24206b2a8fee94.lhr.life/API'
};

export const getTauriApiBaseUrl = (): string => {
  return 'http://192.168.0.102:8080';
};