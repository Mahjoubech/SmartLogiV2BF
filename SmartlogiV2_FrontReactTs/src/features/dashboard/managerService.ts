import client from '../../api/client';
import { type Colis } from '../parcels/colisSlice';

export interface Livreur {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    vehicule: string;
    zoneAssignee: { id: string; nom: string };
    status: 'INDISPONIBLE' | 'DISPONIBLE' | 'EN_LIVRAISON';
    currentColisCount?: number;
}

export interface DashboardStats {
    TOTAL: number;
    CREE: number;
    COLLECTE: number;
    EN_TRANSIT: number;
    EN_STOCK: number;
    LIVRE: number;
    ANNULE: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

const COLIS_URL = '/colis';
const LIVREUR_URL = 'http://localhost:8080/api/v1/gestionner/livreur';

const ZONE_URL = 'http://localhost:8080/api/v1/zones';

export interface Zone {
    id: string;
    nom: string;
    ville: string;
    codePostal: string;
}

const managerService = {
    
    getDashboardStats: async () => {
        const response = await client.get<any>(`${COLIS_URL}/dashboard-stats`);
        const statsData = response.data.stats || {};
        
        return {
            TOTAL: statsData.TOTAL || 0,
            CREE: statsData.CREE || 0,
            COLLECTE: statsData.COLLECTE || 0,
            EN_TRANSIT: statsData.EN_TRANSIT || 0,
            EN_STOCK: statsData.EN_STOCK || 0,
            LIVRE: statsData.LIVRE || 0,
            ANNULE: statsData.ANNULE || 0
        };
    },

    
    getAllColis: async (page = 0, size = 10) => {
        const response = await client.get<PaginatedResponse<Colis>>(`${COLIS_URL}`, { params: { page, size } });
        return response.data;
    },

    getAvailableColis: async (page = 0, size = 10) => {
        const response = await client.get<PaginatedResponse<Colis>>(`${COLIS_URL}/available`, { params: { page, size } });
        return response.data;
    },

    getAssignedColis: async (page = 0, size = 10) => {
        const response = await client.get<PaginatedResponse<Colis>>(`${COLIS_URL}/assigned`, { params: { page, size } });
        return response.data;
    },

    getEligibleLivreurs: async (colisId: string) => {
        const response = await client.get<Livreur[]>(`${COLIS_URL}/${colisId}/eligible-livreurs`);
        return response.data;
    },

    assignLivreur: async (colisId: string, livreurId: string) => {
        const response = await client.put<Colis>(`${COLIS_URL}/gestionner/livreur/${colisId}/assign`, null, {
            params: { livreurId }
        });
        return response.data;
    },

    
    
    getAllLivreurs: async (page = 0, size = 10) => {
        const response = await client.get<PaginatedResponse<Livreur>>(`${LIVREUR_URL}`, { params: { page, size } });
        return response.data;
    },

    createLivreur: async (data: any) => {
        const response = await client.post<Livreur>(`${LIVREUR_URL}`, data);
        return response.data;
    },

    deleteLivreur: async (id: string) => {
        const response = await client.delete(`${LIVREUR_URL}/${id}`);
        return response.data;
    },

    
    getAllZones: async () => {
        const response = await client.get<Zone[]>(`${ZONE_URL}`);
        return response.data;
    }
};

export default managerService;
