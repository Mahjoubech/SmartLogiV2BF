


import { ProduitRequest } from '../models/produit-request';
export interface ColisRequest {
  clientExpediteurEmail: string;
  codePostal: string;
  description: string;
  destinataireEmail: string;
  poids: number;
  priorite: string;
  produits: Array<ProduitRequest>;
  villeDestination: string;
  codePostalOrigine: string;
}
