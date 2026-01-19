import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';
import { createColis } from '../api/fn/gestion-des-colis/create-colis';
import { ColisRequest } from '../api/models/colis-request';
import { ColisResponse } from '../api/models/colis-response';
import { PageColisResponse } from '../api/models/page-colis-response';

@Injectable({
    providedIn: 'root'
})
export class ColisService {
    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ) { }

    getColisByExpediteur(email: string): Observable<ColisResponse[]> {
        return this.http.get<PageColisResponse>(`${this.config.rootUrl}/api/v3/clients/expediteur/colis?email=${email}`).pipe(
            map(response => response.content || [])
        );
    }

    createColis(request: ColisRequest): Observable<ColisResponse> {
        return createColis(this.http, this.config.rootUrl, { body: request }).pipe(
            map(response => response.body)
        );
    }

    getColisDetails(id: string): Observable<ColisResponse> {
        return this.http.get<ColisResponse>(`${this.config.rootUrl}/api/v2/colis/${id}`);
    }
    getAllColis(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis?page=${page}&size=${size}`);
    }

    getEligibleLivreurs(colisId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.config.rootUrl}/api/v2/colis/${colisId}/eligible-livreurs`);
    }

    assignLivreur(colisId: string, livreurId: string): Observable<ColisResponse> {
        return this.http.put<ColisResponse>(`${this.config.rootUrl}/api/v2/colis/gestionner/livreur/${colisId}/assign?livreurId=${livreurId}`, {});
    }

    getAvailableColis(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/available?page=${page}&size=${size}`);
    }

    getMyAssignedColis(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/my-assigned?page=${page}&size=${size}`);
    }

    updateStatus(colisId: string, status: string, commentaire: string = ''): Observable<ColisResponse> {
        return this.http.put<ColisResponse>(`${this.config.rootUrl}/api/v2/colis/${colisId}/status`, {
            statut: status,
            commentaire: commentaire,
            dateChangement: new Date().toISOString()
        });
    }
}
