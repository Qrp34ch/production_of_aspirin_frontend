// import { API_BASE_URL } from '../target_config';

export const getApiBaseUrl = (): string => {
  // В Tauri — прямой URL, в браузере — относительный путь (проксируется)
  // const isTauri = typeof window !== 'undefined' && (window as any).TAURI !== undefined;
  // return isTauri ? 'http://192.168.0.102:8080/API' : '/API';
  return 'https://1fa47e4aa7096d.lhr.life'
};

export const getTauriApiBaseUrl = (): string => {
  return 'http://192.168.0.102:8080';
};