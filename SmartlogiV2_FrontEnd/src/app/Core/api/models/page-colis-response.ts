


import { ColisResponse } from '../models/colis-response';
import { Pageablenull } from '../models/pageablenull';
import { Sortnull } from '../models/sortnull';
export interface PageColisResponse {
  content?: Array<ColisResponse>;
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
