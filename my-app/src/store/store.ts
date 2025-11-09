// // src/store/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import filterReducer from './filterSlice';

// // Создаем store
// export const store = configureStore({
//   reducer: {
//     filters: filterReducer,
//   },
//   // Включаем Redux DevTools в development
//   devTools: process.env.NODE_ENV !== 'production',
// });

// // Типы для TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;