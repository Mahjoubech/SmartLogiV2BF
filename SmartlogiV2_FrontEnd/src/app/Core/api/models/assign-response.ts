


import { PermissionResponseDetail } from '../models/permission-response-detail';
import { RolesResponse } from '../models/roles-response';
export interface AssignResponse {
  permissions?: Array<PermissionResponseDetail>;
  role?: RolesResponse;
}
