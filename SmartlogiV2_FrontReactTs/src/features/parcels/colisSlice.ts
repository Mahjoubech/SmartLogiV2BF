import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import client from '../../api/client';
import type { RootState } from '../../store/store';

// Types
export interface Colis {
    id: string; // Backend uses UUID/String
    poids: number;
    statut: 'CREE' | 'COLLECTE' | 'EN_TRANSIT' | 'LIVRE' | 'ANNULE';
    dateCreation: string;
    villeDestination: string;
    priorite: string;
    expediteur: { id: string; nom: string; prenom: string };
    destinataire: { id: string; nom: string; prenom: string; adresse: string; telephone: string };
    zone: { id: string; nom: string };
    codePostal: string;
    codePostalOrigine: string;
    description?: string;
    produits?: Array<{ nom: string; categorie: string; poids: number; prix: number; quantite: number }>;
    historique?: Array<{ status: string; dateChangement: string; commentaire: string }>;
}

interface ColisState {
    items: Colis[];
    currentColis: Colis | null;
    isLoading: boolean;
    error: string | null;
    totalElements: number;
    totalPages: number;
}

const initialState: ColisState = {
    items: [],
    currentColis: null,
    isLoading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
};

// Async Thunks
// Async Thunks
export const fetchMyParcels = createAsyncThunk(
    'colis/fetchMyParcels',
    async ({ userId, page = 0, size = 10, status }: { userId: string, page?: number, size?: number, status?: string[] }, { rejectWithValue }) => {
        try {
            const statusParam = status && status.length > 0 ? `&status=${status.join(',')}` : '';
            const response = await client.get<any>(`/colis/expediteur/${userId}?page=${page}&size=${size}${statusParam}`);
            return response.data;
        } catch (err: unknown) {
             const error = err as AxiosError<{ message: string }>;
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch parcels');
            }
            return rejectWithValue('Failed to fetch parcels');
        }
    }
);

export const registerDestinataire = createAsyncThunk(
    'clients/registerDestinataire',
    async (data: any, { rejectWithValue }) => {
        try {
            // Using v3 as seen in ClientDestinataireController
            const response = await client.post('../v3/clients/register/destinataire', data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to register recipient');
            }
            return rejectWithValue('Failed to register recipient');
        }
    }
);

export const createColis = createAsyncThunk(
    'colis/createColis',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await client.post('/colis', data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to create parcel');
            }
            return rejectWithValue('Failed to create parcel');
        }
    }
);

const colisSlice = createSlice({
    name: 'colis',
    initialState,
    reducers: {
        clearColisError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyParcels.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyParcels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.content;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchMyParcels.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearColisError } = colisSlice.actions;

export const selectAllColis = (state: RootState) => state.colis?.items || [];
export const selectColisStats = (state: RootState) => {
    const items = state.colis?.items || [];
    const active = items.filter(c => c.statut !== 'LIVRE' && c.statut !== 'ANNULE').length;
    const delivered = items.filter(c => c.statut === 'LIVRE').length;
    return { active, delivered, total: items.length };
};

export default colisSlice.reducer;
