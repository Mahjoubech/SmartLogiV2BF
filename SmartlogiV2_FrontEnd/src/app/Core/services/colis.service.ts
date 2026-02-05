import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';
import { ColisRequest } from '../api/models/colis-request';
import { ColisResponse } from '../api/models/colis-response';

@Injectable({
    providedIn: 'root'
})
export class ColisService {
    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ) { }

    createColis(request: ColisRequest): Observable<ColisResponse> {
        return this.http.post<ColisResponse>(`${this.config.rootUrl}/api/v2/colis`, request);
    }

    getColisDetails(id: string): Observable<ColisResponse> {
        return this.http.get<ColisResponse>(`${this.config.rootUrl}/api/v2/colis/${id}`);
    }

    getColisByExpediteur(email: string, page: number = 0, size: number = 50): Observable<ColisResponse[]> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/expediteur/${email}?page=${page}&size=${size}`)
            .pipe(map(response => response.content || []));
    }

    getAllColis(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis?page=${page}&size=${size}`);
    }

    getAvailableColis(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/available?page=${page}&size=${size}`);
    }

    getMyAssignedColis(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/my-assigned?page=${page}&size=${size}`);
    }

    assignLivreur(colisId: string, livreurId: string): Observable<ColisResponse> {
        return this.http.put<ColisResponse>(`${this.config.rootUrl}/api/v2/colis/gestionner/livreur/${colisId}/assign?livreurId=${livreurId}`, {});
    }

    updateStatus(colisId: string, status: string, commentaire: string = ''): Observable<ColisResponse> {
        return this.http.put<ColisResponse>(`${this.config.rootUrl}/api/v2/colis/${colisId}/status`, {
            statut: status,
            commentaire: commentaire
        });
    }

    getColisHistory(colisId: string, page: number = 0, size: number = 50): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/${colisId}/history?page=${page}&size=${size}`);
    }

    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/dashboard-stats`);
    }

    trackColisPublic(colisId: string): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v2/colis/public/${colisId}`);
    }
}
