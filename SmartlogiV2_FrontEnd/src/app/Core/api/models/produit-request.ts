


import { ColisProduitRequest } from '../models/colis-produit-request';
export interface ProduitRequest {
  categorie: string;
  colisProduit?: ColisProduitRequest;
  nom: string;
  poids: number;
  prix: number;
}
