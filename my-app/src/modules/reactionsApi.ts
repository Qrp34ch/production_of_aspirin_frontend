import { type Reaction } from '../modules/type';
import { getApiBaseUrl } from '../config/api';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// Проверка: запущено ли приложение в Tauri?
// const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined;
// const isTauri = true;
// const API_BASE = getApiBaseUrl();

export const getReactions = async (query?: string): Promise<Reaction[]> => {
  const isTauri = true;
  const API_BASE = getApiBaseUrl();
  try {
    const url = query 
      ? `${API_BASE}/reaction?query=${encodeURIComponent(query)}` 
      : `${API_BASE}/reaction`;
    
    console.log('API Request:', url); 

    let response: Response;

    if (isTauri) {
      // Используем Tauri HTTP plugin
      // const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
      response = await tauriFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Обычный fetch в браузере
      response = await fetch(url);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.reactions)) {
      return data.reactions;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getReaction = async (id: number): Promise<Reaction> => {
  const isTauri = true;
  const API_BASE = getApiBaseUrl();
  try {
    const url = `${API_BASE}/reaction/${id}`;
    let response: Response;

    if (isTauri) {
      // const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
      response = await tauriFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      response = await fetch(url);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.reaction || data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};