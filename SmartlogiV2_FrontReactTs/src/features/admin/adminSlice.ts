import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';
import type { ManagerData, RoleData, Permission, PaginatedResponse } from './adminService';
import type { User } from '../auth/authSlice';

export type { ManagerData, RoleData, Permission };

interface AdminState {
  users: {
    data: User[];
    loading: boolean;
    error: string | null;
    totalElements: number;
    totalPages: number;
  };
  parcels: {
    data: any[];
    loading: boolean;
    error: string | null;
    totalElements: number;
    totalPages: number;
  };
  managers: {
    data: ManagerData[];
    loading: boolean;
    error: string | null;
    totalElements: number;
    totalPages: number;
  };
  roles: {
    data: RoleData[];
    loading: boolean;
    error: string | null;
  };
  permissions: {
    data: Permission[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: AdminState = {
  users: {
    data: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
  },
  parcels: {
    data: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
  },
  managers: {
    data: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
  },
  roles: {
    data: [],
    loading: false,
    error: null,
  },
  permissions: {
    data: [],
    loading: false,
    error: null,
  },
};

// Async Thunks

export const fetchAllParcels = createAsyncThunk(
  'admin/fetchAllParcels',
  async ({ page = 0, size = 1000 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const data = await adminService.getAllParcels(page, size);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parcels');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const data = await adminService.getAllUsers(page, size);
      return data as PaginatedResponse<User>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const toggleUserBlock = createAsyncThunk(
  'admin/toggleUserBlock',
  async ({ id, blocked }: { id: string; blocked: boolean }, { rejectWithValue }) => {
    try {
      if (blocked) {
        await adminService.unblockUser(id);
      } else {
        await adminService.blockUser(id);
      }
      return { id, blocked: !blocked };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const fetchAllManagers = createAsyncThunk(
  'admin/fetchAllManagers',
  async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const data = await adminService.getAllManagers(page, size);
      return data as PaginatedResponse<ManagerData>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch managers');
    }
  }
);

export const createManager = createAsyncThunk(
  'admin/createManager',
  async (data: ManagerData, { dispatch, rejectWithValue }) => {
    try {
      await adminService.createManager(data);
      dispatch(fetchAllManagers({}));
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create manager');
    }
  }
);

export const updateManager = createAsyncThunk(
  'admin/updateManager',
  async ({ id, data }: { id: string; data: Partial<ManagerData> }, { dispatch, rejectWithValue }) => {
    try {
      await adminService.updateManager(id, data);
      dispatch(fetchAllManagers({}));
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update manager');
    }
  }
);

export const deleteManager = createAsyncThunk(
  'admin/deleteManager',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await adminService.deleteManager(id);
      dispatch(fetchAllManagers({}));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete manager');
    }
  }
);

export const fetchAllRoles = createAsyncThunk(
  'admin/fetchAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllRoles();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

// Role Thunks
export const createRole = createAsyncThunk(
  'admin/createRole',
  async (name: string, { dispatch, rejectWithValue }) => {
    try {
      await adminService.createRole({ name });
      dispatch(fetchAllRoles());
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'admin/deleteRole',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await adminService.deleteRole(id);
      dispatch(fetchAllRoles());
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
    }
  }
);

export const fetchAllPermissions = createAsyncThunk(
  'admin/fetchAllPermissions',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllPermissions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);

export const createPermission = createAsyncThunk(
  'admin/createPermission',
  async (name: string, { dispatch, rejectWithValue }) => {
    try {
      await adminService.createPermission({ name });
      dispatch(fetchAllPermissions());
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create permission');
    }
  }
);

export const deletePermission = createAsyncThunk(
  'admin/deletePermission',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await adminService.deletePermission(id);
      dispatch(fetchAllPermissions());
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete permission');
    }
  }
);

export const assignPermission = createAsyncThunk(
  'admin/assignPermission',
  async ({ roleId, permissionId }: { roleId: string; permissionId: string }, { dispatch, rejectWithValue }) => {
    try {
      await adminService.assignPermission(roleId, permissionId);
      dispatch(fetchAllRoles()); // Refresh roles to see new permissions
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign permission');
    }
  }
);

export const unassignPermission = createAsyncThunk(
  'admin/unassignPermission',
  async ({ roleId, permissionId }: { roleId: string; permissionId: string }, { dispatch, rejectWithValue }) => {
    try {
      await adminService.unassignPermission(roleId, permissionId);
      dispatch(fetchAllRoles());
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unassign permission');
    }
  }
);

// Slice

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = action.payload.content;
        state.users.totalElements = action.payload.totalElements;
        state.users.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload as string;
      });

    // Block/Unblock Optimistic Update
    builder.addCase(toggleUserBlock.fulfilled, (state, action) => {
      const user = state.users.data.find(u => u.id === action.payload.id);
      if (user) {
        // Assuming 'enabled' handles the blocked/unblocked state, usually backend sets 'accountNonLocked'
        // For simplicity, we are just triggering re-fetch usually or we update locally
        // But backend sends List<User>. Let's rely on re-fetch or assume 'enabled' reflects this if mapped.
        // Actually, User interface has 'enabled', but blockage is accountNonLocked typically.
        // Let's just invalidate for now or update a local property if we add it to the interface.
      }
    });

    // Managers
    builder
      .addCase(fetchAllManagers.pending, (state) => {
        state.managers.loading = true;
        state.managers.error = null;
      })
      .addCase(fetchAllManagers.fulfilled, (state, action) => {
        state.managers.loading = false;
        state.managers.data = action.payload.content;
        state.managers.totalElements = action.payload.totalElements;
        state.managers.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllManagers.rejected, (state, action) => {
        state.managers.loading = false;
        state.managers.error = action.payload as string;
      })
      
      // Parcels
      .addCase(fetchAllParcels.pending, (state) => {
        state.parcels.loading = true;
        state.parcels.error = null;
      })
      .addCase(fetchAllParcels.fulfilled, (state, action) => {
        state.parcels.loading = false;
        state.parcels.data = action.payload.content;
        state.parcels.totalElements = action.payload.totalElements;
        state.parcels.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllParcels.rejected, (state, action) => {
        state.parcels.loading = false;
        state.parcels.error = action.payload as string;
      });

    // Roles
    builder
      .addCase(fetchAllRoles.pending, (state) => {
        state.roles.loading = true;
        state.roles.error = null;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.roles.loading = false;
        // The payload is PaginatedResponse<RoleData>, we need the content
        state.roles.data = action.payload.content;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.roles.loading = false;
        state.roles.error = action.payload as string;
      });

    // Permissions
    builder
      .addCase(fetchAllPermissions.pending, (state) => {
        state.permissions.loading = true;
        state.permissions.error = null;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.permissions.loading = false;
        // The payload is PaginatedResponse<Permission>, we need the content
        state.permissions.data = action.payload.content;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.permissions.loading = false;
        state.permissions.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
