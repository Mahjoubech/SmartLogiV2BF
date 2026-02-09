


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface GetDetailedColisSummary$Params {


  groupByField: string;
}

export function getDetailedColisSummary(http: HttpClient, rootUrl: string, params: GetDetailedColisSummary$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<{
[key: string]: any;
}>>> {
  const rb = new RequestBuilder(rootUrl, getDetailedColisSummary.PATH, 'get');
  if (params) {
    rb.query('groupByField', params.groupByField, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<{
      [key: string]: any;
      }>>;
    })
  );
}

getDetailedColisSummary.PATH = '/api/v4/gestion/detailed-summary';
