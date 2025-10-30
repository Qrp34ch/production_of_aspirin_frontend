import { type Reaction } from '../modules/type';

const API_BASE = '/API';

export const getReactions = async (query?: string): Promise<Reaction[]> => {
  try {
    const url = query ? `${API_BASE}/reaction?query=${encodeURIComponent(query)}` : `${API_BASE}/reaction`;
    const response = await fetch(url);
    const data = await response.json();

    if (Array.isArray(data)) {
      return data; 
    } else if (data && Array.isArray(data.reactions)) {
      return data.reactions; 
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

interface ReactionResponse {
  reaction: Reaction;
}

export const getReaction = async (id: number): Promise<Reaction> => {
  const response = await fetch(`${API_BASE}/reaction/${id}`);
  const data: ReactionResponse = await response.json();
  return data.reaction; 
};

export const getSynthesisCartCount = async (): Promise<number> => {
  try {
    const response = await fetch("/API/synthesis/icon");
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.warn('Failed to get cart count:', error);
    return 0;
  }
};