


import { ColisResponseBasic } from '../models/colis-response-basic';
import { Pageablenull } from '../models/pageablenull';
import { Sortnull } from '../models/sortnull';
export interface PageColisResponseBasic {
  content?: Array<ColisResponseBasic>;
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
