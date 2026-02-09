


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ZoneRequest } from '../../models/zone-request';
import { ZoneResponse } from '../../models/zone-response';

export interface CreateZone$Params {
      body: ZoneRequest
}

export function createZone(http: HttpClient, rootUrl: string, params: CreateZone$Params, context?: HttpContext): Observable<StrictHttpResponse<ZoneResponse>> {
  const rb = new RequestBuilder(rootUrl, createZone.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ZoneResponse>;
    })
  );
}

createZone.PATH = '/api/v4/gestion/zone';
