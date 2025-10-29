// api.ts
import { type Reaction } from '../modules/type';

const API_BASE = '/API';

// Интерфейс для ответа API
// interface ReactionsResponse {
//   reactions: Reaction[];
//   query?: string;
// }

// Получение списка реакций
export const getReactions = async (query?: string): Promise<Reaction[]> => {
  try {
    const url = query ? `${API_BASE}/reaction?query=${encodeURIComponent(query)}` : `${API_BASE}/reaction`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Разные возможные форматы ответа
    if (Array.isArray(data)) {
      return data; // Если API возвращает напрямую массив
    } else if (data && Array.isArray(data.reactions)) {
      return data.reactions; // Если API возвращает {reactions: [...]}
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data; // Если API возвращает {data: [...]}
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

// Получение реакции по ID
interface ReactionResponse {
  reaction: Reaction;
}

export const getReaction = async (id: number): Promise<Reaction> => {
  const response = await fetch(`${API_BASE}/reaction/${id}`);
  const data: ReactionResponse = await response.json();
  return data.reaction; // извлекаем реакцию из ответа
};

// Добавление реакции в синтез
export const addReactionToSynthesis = async (reactionId: number): Promise<void> => {
  await fetch(`${API_BASE}/reaction/${reactionId}/add-reaction-in-synthesis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
};