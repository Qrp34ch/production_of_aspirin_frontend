import { type Reaction } from '../modules/type';
import { getApiBaseUrl } from '../config/api';

// const API_BASE = '/API';
const API_BASE = getApiBaseUrl();

// export const getReactions = async (query?: string): Promise<Reaction[]> => {
//   try {
//     const url = query ? `${API_BASE}/reaction?query=${encodeURIComponent(query)}` : `${API_BASE}/reaction`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (Array.isArray(data)) {
//       return data; 
//     } else if (data && Array.isArray(data.reactions)) {
//       return data.reactions; 
//     } else if (data && data.data && Array.isArray(data.data)) {
//       return data.data;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// interface ReactionResponse {
//   reaction: Reaction;
// }

// export const getReaction = async (id: number): Promise<Reaction> => {
//   const response = await fetch(`${API_BASE}/reaction/${id}`);
//   const data: ReactionResponse = await response.json();
//   return data.reaction; 
// };

// export const getSynthesisCartCount = async (): Promise<number> => {
//   try {
//     const response = await fetch("/API/synthesis/icon");
//     if (!response.ok) throw new Error('API request failed');
//     const data = await response.json();
//     return data.count || 0;
//   } catch (error) {
//     console.warn('Failed to get cart count:', error);
//     return 0;
//   }
// };
// Получение списка реакций
export const getReactions = async (query?: string): Promise<Reaction[]> => {
  try {
    const url = query 
      ? `${API_BASE}/reaction?query=${encodeURIComponent(query)}` 
      : `${API_BASE}/reaction`;
    
    console.log('API Request:', url); // Для отладки
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Разные возможные форматы ответа
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

// Получение реакции по ID
export const getReaction = async (id: number): Promise<Reaction> => {
  try {
    const response = await fetch(`${API_BASE}/reaction/${id}`);
    
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