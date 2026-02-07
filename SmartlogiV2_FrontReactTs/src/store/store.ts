import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import colisReducer from '../features/parcels/colisSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    colis: colisReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
