// import { configureStore } from '@reduxjs/toolkit';
// import filterReducer from './filterSlice';

// const enableDevTools = true; 

// export const store = configureStore({
//   reducer: {
//     filters: filterReducer,
//   },
//   devTools: enableDevTools,
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';
import userReducer from '../slices/userSlice';
import synthesisReducer from '../slices/synthesisSlice';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    user: userReducer,
    synthesis: synthesisReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;