


import { RolesEntity } from '../models/roles-entity';
import { ZoneResponse } from '../models/zone-response';
export interface LivreurResponse {
  id?: string;
  nom?: string;
  prenom?: string;
  role?: RolesEntity;
  telephone?: string;
  vehicule?: string;
  zoneAssignee?: ZoneResponse;
}
