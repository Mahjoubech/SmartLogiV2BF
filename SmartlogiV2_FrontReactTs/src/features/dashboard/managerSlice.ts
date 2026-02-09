import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import managerService, { type DashboardStats, type Livreur, type PaginatedResponse, type Zone } from './managerService'; 
import { type Colis } from '../parcels/colisSlice';

interface HelperState {
    loading: boolean;
    error: string | null;
}

interface PageState<T> extends HelperState {
    data: T[];
    totalElements: number;
    totalPages: number;
}

interface ManagerState {
    stats: DashboardStats | null;
    statsState: HelperState;
    colis: PageState<Colis>;
    livreurs: PageState<Livreur>;
    zones: Zone[]; 
    eligibleLivreurs: Livreur[];
    eligibleState: HelperState;
}

const initialState: ManagerState = {
    stats: null,
    statsState: { loading: false, error: null },
    colis: {
        data: [],
        totalElements: 0,
        totalPages: 0,
        loading: false,
        error: null,
    },
    livreurs: {
        data: [],
        totalElements: 0,
        totalPages: 0,
        loading: false,
        error: null,
    },
    zones: [], 
    eligibleLivreurs: [],
    eligibleState: { loading: false, error: null },
};



export const fetchDashboardStats = createAsyncThunk(
    'manager/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            return await managerService.getDashboardStats();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

export const fetchColis = createAsyncThunk(
    'manager/fetchColis',
    async ({ page = 0, size = 10, filter = 'ALL' }: { page?: number, size?: number, filter?: 'ALL' | 'AVAILABLE' | 'ASSIGNED' }, { rejectWithValue }) => {
        try {
            if (filter === 'AVAILABLE') {
                return await managerService.getAvailableColis(page, size);
            } else if (filter === 'ASSIGNED') {
                return await managerService.getAssignedColis(page, size);
            } else {
                return await managerService.getAllColis(page, size);
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch colis');
        }
    }
);

export const fetchLivreurs = createAsyncThunk(
    'manager/fetchLivreurs',
    async ({ page = 0, size = 10 }: { page?: number, size?: number }, { rejectWithValue }) => {
        try {
             const data = await managerService.getAllLivreurs(page, size);
             return data as PaginatedResponse<Livreur>;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch livreurs');
        }
    }
);

export const fetchZones = createAsyncThunk(
    'manager/fetchZones',
    async (_, { rejectWithValue }) => {
        try {
            return await managerService.getAllZones();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch zones');
        }
    }
);

export const fetchEligibleLivreurs = createAsyncThunk(
    'manager/fetchEligibleLivreurs',
    async (colisId: string, { rejectWithValue }) => {
        try {
            return await managerService.getEligibleLivreurs(colisId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch eligible livreurs');
        }
    }
);

export const assignLivreur = createAsyncThunk(
    'manager/assignLivreur',
    async ({ colisId, livreurId }: { colisId: string, livreurId: string }, { dispatch, rejectWithValue }) => {
        try {
            await managerService.assignLivreur(colisId, livreurId);
            dispatch(fetchDashboardStats());
            return { colisId, livreurId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign livreur');
        }
    }
);

export const createLivreur = createAsyncThunk(
    'manager/createLivreur',
    async (data: any, { dispatch, rejectWithValue }) => {
        try {
            await managerService.createLivreur(data);
            dispatch(fetchLivreurs({}));
            return;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create livreur');
        }
    }
);

export const deleteLivreur = createAsyncThunk(
    'manager/deleteLivreur',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await managerService.deleteLivreur(id);
            dispatch(fetchLivreurs({}));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete livreur');
        }
    }
);


const managerSlice = createSlice({
    name: 'manager',
    initialState,
    reducers: {
        resetEligible: (state) => {
            state.eligibleLivreurs = [];
            state.eligibleState = { loading: false, error: null };
        }
    },
    extraReducers: (builder) => {
        
        builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
            state.stats = action.payload;
            state.statsState.loading = false;
        });

        
        builder.addCase(fetchColis.pending, (state) => {
            state.colis.loading = true;
        })
        .addCase(fetchColis.fulfilled, (state, action) => {
            state.colis.loading = false;
            state.colis.data = action.payload.content;
            state.colis.totalElements = action.payload.totalElements;
            state.colis.totalPages = action.payload.totalPages;
        })
        .addCase(fetchColis.rejected, (state, action) => {
             state.colis.loading = false;
             state.colis.error = action.payload as string;
        });

        
        builder.addCase(fetchLivreurs.pending, (state) => {
            state.livreurs.loading = true;
        })
        .addCase(fetchLivreurs.fulfilled, (state, action) => {
            state.livreurs.loading = false;
            if (action.payload.content) {
                state.livreurs.data = action.payload.content;
                state.livreurs.totalElements = action.payload.totalElements;
                 state.livreurs.totalPages = action.payload.totalPages;
            } else {
                 state.livreurs.data = action.payload as any; 
            }
        })
        .addCase(fetchLivreurs.rejected, (state, action) => {
             state.livreurs.loading = false;
             state.livreurs.error = action.payload as string;
        });
        
        
        builder.addCase(fetchZones.fulfilled, (state, action) => {
            state.zones = action.payload;
        });

        
        builder.addCase(fetchEligibleLivreurs.pending, (state) => {
            state.eligibleState.loading = true;
            state.eligibleLivreurs = [];
        })
        .addCase(fetchEligibleLivreurs.fulfilled, (state, action) => {
            state.eligibleState.loading = false;
            state.eligibleLivreurs = action.payload;
        })
         .addCase(fetchEligibleLivreurs.rejected, (state, action) => {
            state.eligibleState.loading = false;
            state.eligibleState.error = action.payload as string;
        });
        
        
        builder.addCase(assignLivreur.fulfilled, (state, action) => {
             
        });
    }
});

export const { resetEligible } = managerSlice.actions;
export default managerSlice.reducer;
