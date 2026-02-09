


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PagePermissionResponseDetail } from '../../models/page-permission-response-detail';

export interface GetAllPermission$Params {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export function getAllPermission(http: HttpClient, rootUrl: string, params?: GetAllPermission$Params, context?: HttpContext): Observable<StrictHttpResponse<PagePermissionResponseDetail>> {
  const rb = new RequestBuilder(rootUrl, getAllPermission.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
    rb.query('sortBy', params.sortBy, {});
    rb.query('sortDir', params.sortDir, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PagePermissionResponseDetail>;
    })
  );
}

getAllPermission.PATH = '/api/admin/permission/all';
