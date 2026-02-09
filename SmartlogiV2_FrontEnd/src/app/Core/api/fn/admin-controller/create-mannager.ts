


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GestionnerRequest } from '../../models/gestionner-request';
import { GestionResponse } from '../../models/gestion-response';

export interface CreateMannager$Params {
      body: GestionnerRequest
}

export function createMannager(http: HttpClient, rootUrl: string, params: CreateMannager$Params, context?: HttpContext): Observable<StrictHttpResponse<GestionResponse>> {
  const rb = new RequestBuilder(rootUrl, createMannager.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GestionResponse>;
    })
  );
}

createMannager.PATH = '/api/admin/manager/create';
