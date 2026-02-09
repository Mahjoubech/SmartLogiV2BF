


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ZoneRequest } from '../../models/zone-request';
import { ZoneResponse } from '../../models/zone-response';

export interface UpdateZone$Params {


  zoneId: string;
      body: ZoneRequest
}

export function updateZone(http: HttpClient, rootUrl: string, params: UpdateZone$Params, context?: HttpContext): Observable<StrictHttpResponse<ZoneResponse>> {
  const rb = new RequestBuilder(rootUrl, updateZone.PATH, 'put');
  if (params) {
    rb.path('zoneId', params.zoneId, {});
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

updateZone.PATH = '/api/v4/gestion/zone/{zoneId}';
