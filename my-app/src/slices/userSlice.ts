// userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

interface User {
  id: number;
  login: string;
  fio: string;
  is_moderator: boolean;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Асинхронные действия
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.api.usersLoginCreate(credentials);
      const { access_token, user } = response.data;
      
      if (access_token) {
        localStorage.setItem('authToken', access_token);
      }
      
      if (user) {
        return {
          id: user.id || 0,
          login: user.login || '',
          fio: user.fio || '',
          is_moderator: user.is_moderator || false
        } as User;
      }
      
      throw new Error('Неверный ответ от сервера');
    } catch (error: any) {
      const errorMessage = error.response?.data?.description || error.message || 'Ошибка авторизации';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { login: string; pass: string; fio: string }, { rejectWithValue }) => {
    try {
      const response = await api.api.usersRegisterCreate(userData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.description || 'Ошибка регистрации';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.api.usersLogoutCreate();
      localStorage.removeItem('authToken');
      return null;
    } catch (error: any) {
      localStorage.removeItem('authToken');
      const errorMessage = error.response?.data?.description || 'Ошибка выхода';
      return rejectWithValue(errorMessage);
    }
  }
);
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.api.usersProfileList();
      const userData = response.data.data;
      
      if (userData) {
        return {
          id: userData.id || 0,
          login: userData.login || '',
          fio: userData.fio || '',
          is_moderator: userData.is_moderator || false
        } as User;
      }
      
      throw new Error('Данные пользователя не получены');
    } catch (error: any) {
      const errorMessage = error.response?.data?.description || 'Ошибка загрузки профиля';
      return rejectWithValue(errorMessage);
    }
  }
);
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: { login?: string; name?: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await api.api.usersProfileUpdate(userData);
      const updatedUser = response.data.data;
      
      if (updatedUser) {
        return {
          id: updatedUser.id || 0,
          login: updatedUser.login || '',
          fio: updatedUser.fio || '',
          is_moderator: updatedUser.is_moderator || false
        } as User;
      }
      
      throw new Error('Данные пользователя не получены после обновления');
    } catch (error: any) {
      const errorMessage = error.response?.data?.description || 'Ошибка обновления профиля';
      return rejectWithValue(errorMessage);
    }
  }
);

// Проверка авторизации при загрузке приложения
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return rejectWithValue('Токен не найден');
      }

      const response = await api.api.usersProfileList();
      const userData = response.data.data;
      
      if (userData) {
        return {
          id: userData.id || 0,
          login: userData.login || '',
          fio: userData.fio || '',
          is_moderator: userData.is_moderator || false
        } as User;
      }
      
      throw new Error('Данные пользователя не получены');
    } catch (error: any) {
      console.error('checkAuth: ошибка проверки токена:', error);
      // Если токен невалидный, удаляем его
      localStorage.removeItem('authToken');
      return rejectWithValue(error.response?.data?.description || 'Ошибка проверки авторизации');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Редюсер для сброса состояния при загрузке страницы
    resetUserState: (state) => {
      // ТОЛЬКО сбрасываем Redux состояние, не трогаем localStorage!
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser, resetUserState } = userSlice.actions;
export default userSlice.reducer;