


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Pageable } from '../../models/pageable';
import { PageColisResponse } from '../../models/page-colis-response';

export interface GetAssignedColis$Params {
  livreurId: string;
  pageable: Pageable;
}

export function getAssignedColis(http: HttpClient, rootUrl: string, params: GetAssignedColis$Params, context?: HttpContext): Observable<StrictHttpResponse<PageColisResponse>> {
  const rb = new RequestBuilder(rootUrl, getAssignedColis.PATH, 'get');
  if (params) {
    rb.path('livreurId', params.livreurId, {});
    rb.query('pageable', params.pageable, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageColisResponse>;
    })
  );
}

getAssignedColis.PATH = '/api/v1/gestionner/livreur/{livreurId}/colis';
