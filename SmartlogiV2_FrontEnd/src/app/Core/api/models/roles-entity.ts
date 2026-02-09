


import { Permission } from '../models/permission';
export interface RolesEntity {
  createdBy?: string;
  dateCreation?: string;
  dateModification?: string;
  id?: string;
  modifiedBy?: string;
  name?: 'ADMIN' | 'CLIENT' | 'LIVREUR' | 'MANAGER';
  permissions?: Array<Permission>;
}
