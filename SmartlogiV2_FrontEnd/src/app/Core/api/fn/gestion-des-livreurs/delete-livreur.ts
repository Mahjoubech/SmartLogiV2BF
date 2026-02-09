


import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface DeleteLivreur$Params {
  livreur_id: string;
}

export function deleteLivreur(http: HttpClient, rootUrl: string, params: DeleteLivreur$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, deleteLivreur.PATH, 'delete');
  if (params) {
    rb.path('livreur_id', params.livreur_id, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

deleteLivreur.PATH = '/api/v1/gestionner/livreur/{livreur_id}';
