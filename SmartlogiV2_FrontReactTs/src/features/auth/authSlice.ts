import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import client from '../../api/client';
import type { RootState } from '../../store/store';

// Types
export interface UserRole {
  id: number;
  name: string; // 'ADMIN' | 'MANAGER' | 'LIVREUR' | 'CLIENT'
}

export interface User {
  id: string; // Updated to match backend String UUID
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  role: UserRole;
  enabled?: boolean;
  accountNonLocked?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  id: string; // Added field
  role: UserRole;
  nom: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user_data') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await client.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await client.post<AuthResponse>('/auth/register', userData);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Registration failed');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const verifyAccount = createAsyncThunk(
    'auth/verify',
    async (data: { email: string, code: string }, { rejectWithValue }) => {
        try {
            const response = await client.post<AuthResponse>('/auth/verify', data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Verification failed');
            }
            return rejectWithValue('Verification failed');
        }
    }
);

export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (credentials: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await client.post('/auth/update-password', credentials);
            return response.data;
        } catch (err: unknown) {
             const error = err as AxiosError<{ message: string }>;
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Update failed');
            }
            return rejectWithValue('Update failed');
        }
    }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            // Normalize role
            const rolePayload = action.payload.role as any;
            const normalizedRole = typeof rolePayload === 'string' 
                ? { id: 0, name: rolePayload } 
                : (rolePayload && rolePayload.name ? rolePayload : { id: 0, name: 'CLIENT' });

            state.user = {
                id: action.payload.id,
                nom: action.payload.nom,
                prenom: action.payload.prenom,
                email: action.payload.email,
                telephone: action.payload.telephone,
                role: normalizedRole
            };
            
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user_data', JSON.stringify(state.user));
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });

    // Register
     builder
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
             // Normalize role
            const rolePayload = action.payload.role as any;
            const normalizedRole = typeof rolePayload === 'string' 
                ? { id: 0, name: rolePayload } 
                : (rolePayload && rolePayload.name ? rolePayload : { id: 0, name: 'CLIENT' });

             state.user = {
                id: action.payload.id,
                nom: action.payload.nom,
                email: action.payload.email,
                role: normalizedRole
            };
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user_data', JSON.stringify(state.user));
        })
        .addCase(registerUser.rejected, (state, action) => {
             state.isLoading = false;
            state.error = action.payload as string;
        });
        
    // Verify
    builder
        .addCase(verifyAccount.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(verifyAccount.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
             // Normalize role
            const rolePayload = action.payload.role as any;
            const normalizedRole = typeof rolePayload === 'string' 
                ? { id: 0, name: rolePayload } 
                : (rolePayload && rolePayload.name ? rolePayload : { id: 0, name: 'CLIENT' });

             state.user = {
                id: action.payload.id,
                nom: action.payload.nom,
                email: action.payload.email,
                role: normalizedRole
            };
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user_data', JSON.stringify(state.user));
        })
        .addCase(verifyAccount.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
  },
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;
