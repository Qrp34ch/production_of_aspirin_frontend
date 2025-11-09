// src/store/filterSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Тип для состояния фильтров
interface FilterState {
  searchQuery: string;
  // Можно добавить другие фильтры в будущем
  // dateRange: { start: string; end: string };
  // priceRange: { min: number; max: number };
}

// Начальное состояние
const initialState: FilterState = {
  searchQuery: '',
};

// Создаем slice
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Установка поискового запроса
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // Сброс всех фильтров
    resetFilters: (state) => {
      state.searchQuery = '';
    },
    // Очистка только поиска
    clearSearch: (state) => {
      state.searchQuery = '';
    }
  },
});

// Экспортируем actions
export const { setSearchQuery, resetFilters, clearSearch } = filterSlice.actions;

// Экспортируем reducer
export default filterSlice.reducer;