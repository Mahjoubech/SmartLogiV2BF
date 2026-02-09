


import { HistoriqueLivraisonResponse } from '../models/historique-livraison-response';
import { Pageablenull } from '../models/pageablenull';
import { Sortnull } from '../models/sortnull';
export interface PageHistoriqueLivraisonResponse {
  content?: Array<HistoriqueLivraisonResponse>;
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
