


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ColisResponse } from '../../models/colis-response';

export interface GetColisById1$Params {
  colisId: string;
}

export function getColisById1(http: HttpClient, rootUrl: string, params: GetColisById1$Params, context?: HttpContext): Observable<StrictHttpResponse<ColisResponse>> {
  const rb = new RequestBuilder(rootUrl, getColisById1.PATH, 'get');
  if (params) {
    rb.path('colisId', params.colisId, {});
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

getColisById1.PATH = '/api/v2/colis/{colisId}';
