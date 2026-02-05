import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';
import { LivreurRequest } from '../api/models/livreur-request';
import { LivreurResponse } from '../api/models/livreur-response';

@Injectable({
    providedIn: 'root'
})
export class LivreurService {

    constructor(
        private http: HttpClient, 
        private config: ApiConfiguration
    ) { }

    getAllLivreurs(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v1/gestionner/livreur?page=${page}&size=${size}`);
    }

    getLivreur(id: string): Observable<LivreurResponse> {
        return this.http.get<LivreurResponse>(`${this.config.rootUrl}/api/v1/gestionner/livreur/${id}`);
    }

    createLivreur(request: LivreurRequest): Observable<LivreurResponse> {
        return this.http.post<LivreurResponse>(`${this.config.rootUrl}/api/v1/gestionner/livreur`, request);
    }

    updateLivreur(id: string, request: LivreurRequest): Observable<LivreurResponse> {
        return this.http.put<LivreurResponse>(`${this.config.rootUrl}/api/v1/gestionner/livreur/${id}`, request);
    }

    deleteLivreur(id: string): Observable<void> {
        return this.http.delete<void>(`${this.config.rootUrl}/api/v1/gestionner/livreur/${id}`);
    }

    searchLivreurs(keyword: string, page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v1/gestionner/livreur/search?keyword=${keyword}&page=${page}&size=${size}`);
    }
}
