


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface DeleteManager$Params {
  id: string;
}

export function deleteManager(http: HttpClient, rootUrl: string, params: DeleteManager$Params, context?: HttpContext): Observable<StrictHttpResponse<any>> {
  const rb = new RequestBuilder(rootUrl, deleteManager.PATH, 'delete');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<any>;
    })
  );
}

deleteManager.PATH = '/api/admin/manager/delete/{id}';
