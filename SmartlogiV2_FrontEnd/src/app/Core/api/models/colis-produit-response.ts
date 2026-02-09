


import { ProduitResponse } from '../models/produit-response';
export interface ColisProduitResponse {
  id?: string;
  prixUnitaire?: number;
  produit?: ProduitResponse;
  quantite?: number;
}
