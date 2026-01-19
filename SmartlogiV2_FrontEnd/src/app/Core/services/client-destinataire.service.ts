import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';
import { createDestinataire } from '../api/fn/clients-et-destinataires/create-destinataire';
import { ClientDestinataireRequest } from '../api/models/client-destinataire-request';
import { ClientDestinataireResponse } from '../api/models/client-destinataire-response';

@Injectable({
    providedIn: 'root'
})
export class ClientDestinataireService {
    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ) { }

    registerDestinataire(request: ClientDestinataireRequest): Observable<ClientDestinataireResponse> {
        return createDestinataire(this.http, this.config.rootUrl, { body: request }).pipe(
            map(response => response.body)
        );
    }
}
