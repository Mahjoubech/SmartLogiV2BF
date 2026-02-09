import client from '../../api/client';
import { type Colis } from '../parcels/colisSlice';

const COLIS_URL = '/colis';
const NOTIFICATION_URL = '/notifications'; 





const NOTIF_BASE = 'http://localhost:8080/api/v1/notifications';

export interface Notification {
    id: string;
    message: string;
    dateEnvoi: string; 
    read: boolean;
    userId: string;
}

export interface LivreurStats {
    activeMissions: number;
    completedToday: number;
}

const livreurService = {
    
    getMyMissions: async (page = 0, size = 10) => {
        const response = await client.get<any>(`${COLIS_URL}/my-assigned`, { params: { page, size } });
        return response.data;
    },

    updateMissionStatus: async (colisId: string, status: string, commentaire: string = '') => {
        
        const response = await client.put<Colis>(`${COLIS_URL}/${colisId}/status`, { statut: status, commentaire });
        return response.data;
    },

    
    getMyNotifications: async () => {
        
        
        
        
        
        const response = await client.get<Notification[]>(NOTIF_BASE);
        return response.data;
    },

    markNotificationRead: async (id: string) => {
        await client.put(`${NOTIF_BASE}/${id}/read`);
    }
};

export default livreurService;
