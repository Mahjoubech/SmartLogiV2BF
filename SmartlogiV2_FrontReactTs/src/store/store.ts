import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import colisReducer from '../features/parcels/colisSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    colis: colisReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
