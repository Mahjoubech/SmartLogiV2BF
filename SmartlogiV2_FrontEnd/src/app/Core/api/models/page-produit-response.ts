


import { Pageablenull } from '../models/pageablenull';
import { ProduitResponse } from '../models/produit-response';
import { Sortnull } from '../models/sortnull';
export interface PageProduitResponse {
  content?: Array<ProduitResponse>;
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
