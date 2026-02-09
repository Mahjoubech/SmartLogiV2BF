import client from '../../api/client';
import { type Colis } from '../parcels/colisSlice';

const COLIS_URL = '/colis';
const NOTIFICATION_URL = '/notifications'; // Defaults to /api/v2 base, but we need check if it is v1 or v2. 
// ColisController is /api/v2/colis
// NotificationController is /api/v1/notifications (checked in view_file Step 346)

// Client base URL is /api/v2 (from client.ts Step 186)
// We need to override base URL for notifications if they are on v1.
const NOTIF_BASE = 'http://localhost:8080/api/v1/notifications';

export interface Notification {
    id: string;
    message: string;
    dateEnvoi: string; // LocalDateTime
    read: boolean;
    userId: string;
}

export interface LivreurStats {
    activeMissions: number;
    completedToday: number;
}

const livreurService = {
    // --- Missions (Colis) ---
    getMyMissions: async (page = 0, size = 10) => {
        const response = await client.get<any>(`${COLIS_URL}/my-assigned`, { params: { page, size } });
        return response.data;
    },

    updateMissionStatus: async (colisId: string, status: string, commentaire: string = '') => {
        // PUT /api/v2/colis/{colisId}/status
        const response = await client.put<Colis>(`${COLIS_URL}/${colisId}/status`, { statut: status, commentaire });
        return response.data;
    },

    // --- Notifications ---
    getMyNotifications: async () => {
        // Use full URL to bypass the /api/v2 base of the client instance if needed, 
        // OR create a new client instance for V1. 
        // For simplicity, just use axios or string replacement if client.ts is strict.
        // client.ts uses `const client = axios.create({ baseURL: BASE_URL })` where BASE_URL is api/v2.
        // So we can pass absolute URL to override.
        const response = await client.get<Notification[]>(NOTIF_BASE);
        return response.data;
    },

    markNotificationRead: async (id: string) => {
        await client.put(`${NOTIF_BASE}/${id}/read`);
    }
};

export default livreurService;
