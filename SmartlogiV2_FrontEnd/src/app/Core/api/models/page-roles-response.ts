


import { Pageablenull } from '../models/pageablenull';
import { RolesResponse } from '../models/roles-response';
import { Sortnull } from '../models/sortnull';
export interface PageRolesResponse {
  content?: Array<RolesResponse>;
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  pageable?: Pageablenull;
  size?: number;
  sort?: Sortnull;
  totalElements?: number;
  totalPages?: number;
}
