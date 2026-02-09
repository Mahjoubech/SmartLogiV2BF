


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ProduitRequest } from '../../models/produit-request';
import { ProduitResponse } from '../../models/produit-response';

export interface UpdateProduit$Params {
  produitId: string;
      body: ProduitRequest
}

export function updateProduit(http: HttpClient, rootUrl: string, params: UpdateProduit$Params, context?: HttpContext): Observable<StrictHttpResponse<ProduitResponse>> {
  const rb = new RequestBuilder(rootUrl, updateProduit.PATH, 'put');
  if (params) {
    rb.path('produitId', params.produitId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ProduitResponse>;
    })
  );
}

updateProduit.PATH = '/api/v4/gestion/produit/{produitId}';
