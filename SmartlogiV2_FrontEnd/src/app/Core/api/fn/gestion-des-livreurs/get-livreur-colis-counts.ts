


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Pageable } from '../../models/pageable';
import { PageLivreurColisResponse } from '../../models/page-livreur-colis-response';

export interface GetLivreurColisCounts$Params {
  pageable: Pageable;
}

export function getLivreurColisCounts(http: HttpClient, rootUrl: string, params: GetLivreurColisCounts$Params, context?: HttpContext): Observable<StrictHttpResponse<PageLivreurColisResponse>> {
  const rb = new RequestBuilder(rootUrl, getLivreurColisCounts.PATH, 'get');
  if (params) {
    rb.query('pageable', params.pageable, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageLivreurColisResponse>;
    })
  );
}

getLivreurColisCounts.PATH = '/api/v1/gestionner/livreur/counts';
