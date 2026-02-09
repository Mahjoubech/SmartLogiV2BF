


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ColisRequest } from '../../models/colis-request';
import { ColisResponse } from '../../models/colis-response';

export interface UpdateColis$Params {
  colisId: string;
      body: ColisRequest
}

export function updateColis(http: HttpClient, rootUrl: string, params: UpdateColis$Params, context?: HttpContext): Observable<StrictHttpResponse<ColisResponse>> {
  const rb = new RequestBuilder(rootUrl, updateColis.PATH, 'put');
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

updateColis.PATH = '/api/v2/colis/{colisId}';
