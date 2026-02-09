import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import livreurService, { type Notification } from './livreurService';
import { type Colis } from '../parcels/colisSlice';
import { AxiosError } from 'axios';

interface LivreurState {
    missions: Colis[];
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    currentMission: Colis | null;
}

const initialState: LivreurState = {
    missions: [],
    notifications: [],
    loading: false,
    error: null,
    currentMission: null,
};


export const fetchMissions = createAsyncThunk(
    'livreur/fetchMissions',
    async (_, { rejectWithValue }) => {
        try {
            return await livreurService.getMyMissions();
        } catch (err: unknown) {
             const error = err as AxiosError<{ message: string }>;
             return rejectWithValue(error.response?.data?.message || 'Failed to fetch missions');
        }
    }
);

export const updateMission = createAsyncThunk(
    'livreur/updateMission',
    async ({ id, status, comment }: { id: string, status: string, comment: string }, { rejectWithValue }) => {
        try {
             return await livreurService.updateMissionStatus(id, status, comment);
        } catch (err: unknown) {
             const error = err as AxiosError<{ message: string }>;
             return rejectWithValue(error.response?.data?.message || 'Failed to update mission');
        }
    }
);

export const fetchNotifications = createAsyncThunk(
    'livreur/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            return await livreurService.getMyNotifications();
        } catch (err: unknown) {
             const error = err as AxiosError<{ message: string }>;
             return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const markRead = createAsyncThunk(
    'livreur/markRead',
    async (id: string, { rejectWithValue }) => {
        try {
            await livreurService.markNotificationRead(id);
            return id;
        } catch {
            return rejectWithValue('Failed to mark read');
        }
    }
);

const livreurSlice = createSlice({
    name: 'livreur',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            
            .addCase(fetchMissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMissions.fulfilled, (state, action) => {
                state.loading = false;
                state.missions = action.payload.content || action.payload || [];
            })
            .addCase(fetchMissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            .addCase(updateMission.fulfilled, (state, action) => {
                const updated = action.payload;
                state.missions = state.missions.map(m => m.id === updated.id ? updated : m);
                
                if (state.currentMission && state.currentMission.id === updated.id) {
                    state.currentMission = updated;
                }
            })
            
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
            })
            .addCase(markRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map(n => 
                    n.id === action.payload ? { ...n, read: true } : n
                );
            });
    }
});

export const { clearError } = livreurSlice.actions;
export const selectMissions = (state: RootState) => state.livreur?.missions || [];
export const selectNotifications = (state: RootState) => state.livreur?.notifications || [];

export default livreurSlice.reducer;
