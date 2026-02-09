


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ColisResponse } from '../../models/colis-response';
import { HistoriqueLivraisonRequest } from '../../models/historique-livraison-request';

export interface UpdateColisStatus$Params {
  colisId: string;
      body: HistoriqueLivraisonRequest
}

export function updateColisStatus(http: HttpClient, rootUrl: string, params: UpdateColisStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<ColisResponse>> {
  const rb = new RequestBuilder(rootUrl, updateColisStatus.PATH, 'put');
  if (params) {
    rb.path('colisId', params.colisId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ColisResponse>;
    })
  );
}

updateColisStatus.PATH = '/api/v2/colis/{colisId}/status';
