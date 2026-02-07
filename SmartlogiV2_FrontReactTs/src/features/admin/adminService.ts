import client from '../../api/client';
import type { User } from '../auth/authSlice';

// --- Interfaces ---

export interface ManagerData {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  password?: string; // Only for creation
}

export interface RoleData {
  id?: string; // number in backend but treating as string/ID
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string; // number in backend
  name: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// --- Service Functions ---

const ADMIN_URL = 'http://localhost:8080/api/admin';

const adminService = {
  // Users Management
  getAllUsers: async (page = 0, size = 10) => {
    // Override baseURL by providing absolute URL
    const response = await client.get<PaginatedResponse<User>>(`${ADMIN_URL}/users/all`, {
      params: { page, size }
    });
    return response.data;
  },

  blockUser: async (id: string) => {
    const response = await client.put(`${ADMIN_URL}/users/block/${id}`);
    return response.data;
  },

  unblockUser: async (id: string) => {
    const response = await client.put(`${ADMIN_URL}/users/unblock/${id}`);
    return response.data;
  },

  // Managers Management
  getAllManagers: async (page = 0, size = 10) => {
    const response = await client.get<PaginatedResponse<ManagerData>>(`${ADMIN_URL}/manager/all`, {
      params: { page, size }
    });
    return response.data;
  },

  createManager: async (data: ManagerData) => {
    const response = await client.post<ManagerData>(`${ADMIN_URL}/manager/create`, data);
    return response.data;
  },

  updateManager: async (id: string, data: Partial<ManagerData>) => {
    const response = await client.put<ManagerData>(`${ADMIN_URL}/manager/update/${id}`, data);
    return response.data;
  },

  deleteManager: async (id: string) => {
    const response = await client.delete(`${ADMIN_URL}/manager/delete/${id}`);
    return response.data;
  },

  // Role Management
  getAllRoles: async () => {
    const response = await client.get<RoleData[]>(`${ADMIN_URL}/roles/all`);
    return response.data;
  },

  createRole: async (data: { name: string }) => {
    const response = await client.post<RoleData>(`${ADMIN_URL}/roles/create`, data);
    return response.data;
  },

  updateRole: async (id: string, data: { name: string }) => {
    const response = await client.put<RoleData>(`${ADMIN_URL}/roles/update/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string) => {
    const response = await client.delete(`${ADMIN_URL}/roles/delete/${id}`);
    return response.data;
  },

  // Permission Management
  getAllPermissions: async () => {
    const response = await client.get<Permission[]>(`${ADMIN_URL}/permission/all`);
    return response.data;
  },

  createPermission: async (data: { name: string }) => {
    const response = await client.post<Permission>(`${ADMIN_URL}/permission/create`, data);
    return response.data;
  },

  deletePermission: async (id: string) => {
    const response = await client.delete(`${ADMIN_URL}/permission/delete/${id}`);
    return response.data;
  },

  assignPermission: async (roleId: string, permissionId: string) => {
    const response = await client.post(`${ADMIN_URL}/Roles/AssignPermission`, { roleId, permissionId });
    return response.data;
  },

  unassignPermission: async (roleId: string, permissionId: string) => {
    const response = await client.post(`${ADMIN_URL}/Roles/UnassignPermission`, { roleId, permissionId });
    return response.data;
  },

  // Parcel Management (For Admin View)
  getAllParcels: async (page = 0, size = 1000) => {
    // Fetch large size to calculate stats client-side for now
    const response = await client.get<PaginatedResponse<any>>('/colis', {
      params: { page, size }
    });
    return response.data;
  }
};

export default adminService;
