


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Pageable } from '../../models/pageable';
import { PageColisResponse } from '../../models/page-colis-response';

export interface FindColisByCriteria$Params {
  statut?: string;
  zoneId?: string;
  ville?: string;
  priorite?: string;
  pageable: Pageable;
}

export function findColisByCriteria(http: HttpClient, rootUrl: string, params: FindColisByCriteria$Params, context?: HttpContext): Observable<StrictHttpResponse<PageColisResponse>> {
  const rb = new RequestBuilder(rootUrl, findColisByCriteria.PATH, 'get');
  if (params) {
    rb.query('statut', params.statut, {});
    rb.query('zoneId', params.zoneId, {});
    rb.query('ville', params.ville, {});
    rb.query('priorite', params.priorite, {});
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

findColisByCriteria.PATH = '/api/v2/colis/search';
