import client from '../../api/client';
import type { User } from '../auth/authSlice';



export interface ManagerData {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  password?: string; 
}

export interface RoleData {
  id?: string; 
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string; 
  name: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}



const ADMIN_URL = 'http://localhost:8080/api/admin';

const adminService = {
  
  getAllUsers: async (page = 0, size = 10) => {
    
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

  
  getAllRoles: async (page = 0, size = 100) => {
    const response = await client.get<PaginatedResponse<RoleData>>(`${ADMIN_URL}/roles/all`, {
      params: { page, size }
    });
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

  
  getAllPermissions: async (page = 0, size = 100) => {
    const response = await client.get<PaginatedResponse<Permission>>(`${ADMIN_URL}/permission/all`, {
      params: { page, size }
    });
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

  
  getAllParcels: async (page = 0, size = 1000) => {
    
    const response = await client.get<PaginatedResponse<any>>('/colis', {
      params: { page, size }
    });
    return response.data;
  }
};

export default adminService;
