


import { Pageablenull } from '../models/pageablenull';
import { Sortnull } from '../models/sortnull';
import { ZoneResponse } from '../models/zone-response';
export interface PageZoneResponse {
  content?: Array<ZoneResponse>;
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
