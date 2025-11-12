import { API_BASE_URL } from '../target_config';

export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};

export const getTauriApiBaseUrl = (): string => {
  return 'http://192.168.0.102:8080';
};