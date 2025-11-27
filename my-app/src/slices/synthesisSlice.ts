import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
// import { type Reaction } from '../modules/type';

interface SynthesisReaction {
  reaction: {
    ID?: number;
    Title?: string;
    Src: string;
    StartingMaterial?: string;
    DensitySM?: number;
    MolarMassSM?: number;
    ResultMaterial?: string;
    DensityRM?: number;
    MolarMassRM?: number;
  };
  volume_sm: number;
  volume_rm: number;
  count: number; // Добавляем count здесь
}

interface Synthesis {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  finished_at: string;
  creator_login: string;
  moderator_login: string;
  purity: number;
  reactions: SynthesisReaction[];
}

interface SynthesisIcon {
  id: number;
  count: number;
}

interface SynthesisState {
  currentSynthesis: Synthesis | null;
  syntheses: Synthesis[];
  synthesisIcon: SynthesisIcon | null;
  loading: boolean;
  error: string | null;
}

const initialState: SynthesisState = {
  currentSynthesis: null,
  syntheses: [],
  synthesisIcon: null,
  loading: false,
  error: null,
};

// Интерфейсы для API ответов
interface SynthesisIconResponse {
  id_synthesis?: number;
  items_count?: number;
  status?: string;
}

interface SynthesisUpdateResponse {
  data?: any;
  message?: string;
  status?: string;
}

// Асинхронные действия
export const getSynthesisIcon = createAsyncThunk(
  'synthesis/getIcon',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.api.synthesisIconList();
      console.log('Full API response:', response.data);
      
      // Данные приходят напрямую в response.data
      const responseData = response.data as SynthesisIconResponse;
      
      if (responseData && responseData.id_synthesis !== undefined && responseData.id_synthesis !== null) {
        console.log('Found synthesis data:', responseData);
        return {
          id: responseData.id_synthesis,
          count: responseData.items_count || 0
        } as SynthesisIcon;
      }
      
      console.log('No synthesis data found');
      return null;
    } catch (error: any) {
      console.error('Error loading synthesis icon:', error);
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки иконки синтеза');
    }
  }
);

export const addReactionToSynthesis = createAsyncThunk(
  'synthesis/addReaction',
  async (reactionId: number, { rejectWithValue }) => {
    try {
      const response = await api.api.reactionAddReactionInSynthesisCreate(reactionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка добавления реакции');
    }
  }
);

export const getSyntheses = createAsyncThunk(
  'synthesis/getList',
  async (filters: { status?: string; start_date?: string; end_date?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.api.synthesisList(filters);
      console.log('Syntheses API response:', response.data);
      
      const responseData = response.data;
      
      if (responseData && responseData.status === 'success' && Array.isArray(responseData.data)) {
        // Преобразуем данные из API в нашу внутреннюю структуру
        const syntheses = responseData.data.map((item: any) => ({
          id: item.ID,
          status: item.Status,
          created_at: item.DateCreate,
          updated_at: item.DateUpdate,
          finished_at: item.DateFinish,
          creator_login: item.CreatorLogin,
          moderator_login: item.ModeratorLogin,
          purity: item.Purity,
          reactions: [] // Пока оставляем пустым, так как в API нет информации о реакциях
        })) as Synthesis[];
        
        console.log('Transformed syntheses:', syntheses);
        return syntheses;
      }
      
      console.warn('Unexpected syntheses response format:', responseData);
      return [] as Synthesis[];
    } catch (error: any) {
      console.error('Syntheses API error:', error);
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки синтезов');
    }
  }
);

export const getSynthesis = createAsyncThunk(
  'synthesis/getOne',
  async (synthesisId: number, { rejectWithValue }) => {
    try {
      const response = await api.api.synthesisDetail(synthesisId);
      console.log('Synthesis API response:', response.data);
      
      // Преобразуем структуру ответа
      const responseData = response.data as any;
      
      if (responseData && responseData.data) {
        console.log('Synthesis data:', responseData.data);
        console.log('Reactions with count data:', responseData.data_pr);
        
        let reactionsWithCount: SynthesisReaction[] = [];
        
        // Используем данные из data_pr где есть количество и объемы
        if (responseData.data_pr && Array.isArray(responseData.data_pr)) {
          console.log('Found reactions with count in data_pr:', responseData.data_pr.length);
          
          reactionsWithCount = responseData.data_pr.map((reaction: any) => {
            console.log('Processing reaction with count:', reaction.ID, reaction.Title, 'Count:', reaction.Count, 'Volume:', reaction.volume_sm);
            return {
              reaction: {
                ID: reaction.ID,
                Title: reaction.Title,
                Src: reaction.Src,
                StartingMaterial: reaction.StartingMaterial,
                DensitySM: reaction.DensitySM,
                MolarMassSM: reaction.MolarMassSM,
                ResultMaterial: reaction.ResultMaterial,
                DensityRM: reaction.DensityRM,
                MolarMassRM: reaction.MolarMassRM
              },
              volume_sm: reaction.volume_sm || 0, // Используем реальный объем из API
              volume_rm: reaction.volume_rm || 0,
              count: reaction.Count || 1 // Используем реальное количество из API
            };
          });
        } else {
          console.warn('No data_pr found, using Reactions as fallback');
          // Fallback - используем обычные реакции если data_pr нет
          if (responseData.data.Reactions && Array.isArray(responseData.data.Reactions)) {
            reactionsWithCount = responseData.data.Reactions.map((reaction: any) => ({
              reaction: {
                ID: reaction.ID,
                Title: reaction.Title,
                Src: reaction.Src,
                StartingMaterial: reaction.StartingMaterial,
                DensitySM: reaction.DensitySM,
                MolarMassSM: reaction.MolarMassSM,
                ResultMaterial: reaction.ResultMaterial,
                DensityRM: reaction.DensityRM,
                MolarMassRM: reaction.MolarMassRM
              },
              volume_sm: 10.0, // Временное значение по умолчанию
              // volume_rm: 10.0,
              count: 1 // Временное значение по умолчанию
            }));
          }
        }
        
        const synthesis = {
          id: responseData.data.ID,
          status: responseData.data.Status,
          created_at: responseData.data.DateCreate,
          updated_at: responseData.data.DateUpdate,
          finished_at: responseData.data.DateFinish || '',
          creator_login: responseData.data.CreatorLogin,
          moderator_login: responseData.data.ModeratorLogin || '',
          purity: responseData.data.Purity || 0,
          reactions: reactionsWithCount
        } as Synthesis;
        
        console.log('Final synthesis object:', synthesis);
        console.log('Number of reactions in final object:', synthesis.reactions.length);
        
        // Логируем количество и объемы для проверки
        synthesis.reactions.forEach((reaction, index) => {
          console.log(`Reaction ${index + 1}:`, {
            title: reaction.reaction.Title,
            count: reaction.count,
            volume_sm: reaction.volume_sm,
            volume_rm: reaction.volume_rm
          });
        });
        
        return synthesis;
      } else {
        console.error('No data in response');
        throw new Error('Данные синтеза не получены');
      }
      
    } catch (error: any) {
      console.error('Error in getSynthesis:', error);
      if (error.response) {
        console.error('API error response:', error.response);
      }
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки синтеза');
    }
  }
);

export const getSynthesisWithReactions = createAsyncThunk(
  'synthesis/getWithReactions',
  async (synthesisId: number, { rejectWithValue }) => {
    try {
      // Сначала получаем основной синтез
      const synthesisResponse = await api.api.synthesisDetail(synthesisId);
      const synthesisData = synthesisResponse.data.data as any;
      
      if (!synthesisData) {
        throw new Error('Данные синтеза не получены');
      }
      
      // Затем получаем реакции с количеством через ваш бэкенд
      // (нужно добавить соответствующий endpoint в API)
      let reactionsWithCount: SynthesisReaction[] = [];
      
      // Временное решение - используем реакции из основного ответа
      if (synthesisData.Reactions && Array.isArray(synthesisData.Reactions)) {
        reactionsWithCount = synthesisData.Reactions.map((reaction: any) => ({
          reaction: {
            ID: reaction.ID,
            Title: reaction.Title,
            Src: reaction.Src,
            StartingMaterial: reaction.StartingMaterial,
            DensitySM: reaction.DensitySM,
            MolarMassSM: reaction.MolarMassSM,
            ResultMaterial: reaction.ResultMaterial,
            DensityRM: reaction.DensityRM,
            MolarMassRM: reaction.MolarMassRM
          },
          volume_sm: 10.0, // Временное значение
          count: 1 // Временное значение
        }));
      }
      
      return {
        id: synthesisData.ID,
        status: synthesisData.Status,
        created_at: synthesisData.DateCreate,
        updated_at: synthesisData.DateUpdate,
        finished_at: synthesisData.DateFinish || '',
        creator_login: synthesisData.CreatorLogin,
        moderator_login: synthesisData.ModeratorLogin || '',
        purity: synthesisData.Purity || 0,
        reactions: reactionsWithCount
      } as Synthesis;
      
    } catch (error: any) {
      console.error('Error in getSynthesisWithReactions:', error);
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки синтеза с реакциями');
    }
  }
);

// Action для сохранения концентрации
export const updateSynthesisPurity = createAsyncThunk(
  'synthesis/updatePurity',
  async ({ synthesisId, purity }: { synthesisId: number; purity: number }, { rejectWithValue }) => {
    try {
      const response = await api.api.synthesisUpdate(synthesisId, { purity });
      const responseData = response.data as SynthesisUpdateResponse;
      return { purity, response: responseData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления концентрации');
    }
  }
);

// Action для сохранения объемов реакций
export const updateReactionVolume = createAsyncThunk(
  'synthesis/updateReactionVolume',
  async ({ 
    reactionId, 
    volume_sm 
  }: { 
    synthesisId: number; 
    reactionId: number; 
    volume_sm: number;
  }, { rejectWithValue }) => {
    try {
      const response = await api.api.reactionSynthesisUpdate({
        reaction_id: reactionId,
        volume_sm: volume_sm
      });
      return { reactionId, volume_sm, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления объема реакции');
    }
  }
);

// Action для сохранения всех изменений сразу
export const saveSynthesisChanges = createAsyncThunk(
  'synthesis/saveAll',
  async ({
    synthesisId,
    purity,
    volumes
  }: {
    synthesisId: number;
    purity: number;
    volumes: { [key: number]: number };
  }, { rejectWithValue, dispatch }) => {
    try {
      // Сохраняем концентрацию
      if (purity !== undefined) {
        await dispatch(updateSynthesisPurity({ synthesisId, purity })).unwrap();
      }

      // Сохраняем объемы для каждой реакции
      const volumePromises = Object.entries(volumes).map(([reactionId, volume]) => 
        dispatch(updateReactionVolume({ 
          synthesisId, 
          reactionId: parseInt(reactionId), 
          volume_sm: volume 
        })).unwrap()
      );

      await Promise.all(volumePromises);

      return { message: 'Все изменения успешно сохранены' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка сохранения изменений');
    }
  }
);

// Action для удаления синтеза (очистки)
export const deleteSynthesis = createAsyncThunk(
  'synthesis/delete',
  async (synthesisId: number, { rejectWithValue }) => {
    try {
      const response = await api.api.synthesisDelete();
      return { synthesisId, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления синтеза');
    }
  }
);

// Action для формирования синтеза
export const formSynthesis = createAsyncThunk(
  'synthesis/form',
  async (synthesisId: number, { rejectWithValue }) => {
    try {
      const response = await api.api.synthesisFormUpdate(synthesisId);
      return { synthesisId, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка формирования синтеза');
    }
  }
);

// Добавляем action для обновления синтеза
export const updateSynthesis = createAsyncThunk(
  'synthesis/update',
  async ({ synthesisId, purity }: { synthesisId: number; purity: number }, { rejectWithValue }) => {
    try {
      const response = await api.api.synthesisUpdate(synthesisId, { purity });
      const responseData = response.data as SynthesisUpdateResponse;
      return { purity, response: responseData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления синтеза');
    }
  }
);

const synthesisSlice = createSlice({
  name: 'synthesis',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSynthesis: (state) => {
      state.currentSynthesis = null;
    },
    updateSynthesisCount: (state, action) => {
      if (state.synthesisIcon) {
        state.synthesisIcon.count = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Synthesis Icon
      .addCase(getSynthesisIcon.fulfilled, (state, action) => {
        state.synthesisIcon = action.payload;
      })
      .addCase(getSynthesisIcon.rejected, (state) => {
        state.synthesisIcon = null;
      })
      // Add Reaction to Synthesis
      .addCase(addReactionToSynthesis.fulfilled, (state) => {
        // Обновляем счетчик в иконке
        if (state.synthesisIcon) {
          state.synthesisIcon.count += 1;
        }
      })
      // Get Syntheses
      .addCase(getSyntheses.fulfilled, (state, action) => {
        state.syntheses = action.payload || [];
      })
      // Get Synthesis
      .addCase(getSynthesis.fulfilled, (state, action) => {
        state.currentSynthesis = action.payload || null;
      })
      // Update Synthesis
      .addCase(updateSynthesis.fulfilled, (state, action) => {
        if (state.currentSynthesis) {
          state.currentSynthesis.purity = action.payload.purity;
        }
      })
      .addCase(updateSynthesisPurity.fulfilled, (state, action) => {
      if (state.currentSynthesis) {
        state.currentSynthesis.purity = action.payload.purity;
      }
    })
    
    // Update Reaction Volume
    .addCase(updateReactionVolume.fulfilled, (state, action) => {
      if (state.currentSynthesis) {
        const { reactionId, volume_sm } = action.payload;
        const reaction = state.currentSynthesis.reactions.find(
          r => r.reaction.ID === reactionId
        );
        if (reaction) {
          reaction.volume_sm = volume_sm;
        }
      }
    })
    
    // Save All Changes
    .addCase(saveSynthesisChanges.pending, (state) => {
      state.loading = true;
    })
    .addCase(saveSynthesisChanges.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(saveSynthesisChanges.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(deleteSynthesis.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteSynthesis.fulfilled, (state) => {
      state.loading = false;
      state.currentSynthesis = null;
      state.error = null;
    })
    .addCase(deleteSynthesis.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Form Synthesis
    .addCase(formSynthesis.pending, (state) => {
      state.loading = true;
    })
    .addCase(formSynthesis.fulfilled, (state) => {
      state.loading = false;
      if (state.currentSynthesis) {
        state.currentSynthesis.status = 'сформирован';
      }
      state.error = null;
    })
    .addCase(formSynthesis.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearCurrentSynthesis, updateSynthesisCount } = synthesisSlice.actions;
export default synthesisSlice.reducer;