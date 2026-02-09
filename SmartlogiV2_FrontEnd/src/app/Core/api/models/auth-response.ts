


import { RolesEntity } from '../models/roles-entity';
export interface AuthResponse {
  email?: string;
  nom?: string;
  prenom?: string;
  role?: RolesEntity;
  token?: string;
}
