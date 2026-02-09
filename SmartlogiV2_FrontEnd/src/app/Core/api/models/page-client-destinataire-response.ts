


import { ClientDestinataireResponse } from '../models/client-destinataire-response';
import { Pageablenull } from '../models/pageablenull';
import { Sortnull } from '../models/sortnull';
export interface PageClientDestinataireResponse {
  content?: Array<ClientDestinataireResponse>;
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
