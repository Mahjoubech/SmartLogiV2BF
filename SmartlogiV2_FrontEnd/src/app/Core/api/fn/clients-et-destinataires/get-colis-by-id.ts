


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ClientDestinataireResponse } from '../../models/client-destinataire-response';

export interface GetColisById$Params {
  clientId: string;
}

export function getColisById(http: HttpClient, rootUrl: string, params: GetColisById$Params, context?: HttpContext): Observable<StrictHttpResponse<ClientDestinataireResponse>> {
  const rb = new RequestBuilder(rootUrl, getColisById.PATH, 'get');
  if (params) {
    rb.path('clientId', params.clientId, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ClientDestinataireResponse>;
    })
  );
}

getColisById.PATH = '/api/v3/clients/{clientId}';
