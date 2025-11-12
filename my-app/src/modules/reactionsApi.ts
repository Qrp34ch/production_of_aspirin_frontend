import { type Reaction } from '../modules/type';
import { getApiBaseUrl } from '../config/api';

const API_BASE = getApiBaseUrl();

export const getReactions = async (query?: string): Promise<Reaction[]> => {
  try {
    const url = query 
      ? `${API_BASE}/reaction?query=${encodeURIComponent(query)}` 
      : `${API_BASE}/reaction`;
    
    console.log('API Request:', url); 
    
    const response = await fetch(url);
    
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