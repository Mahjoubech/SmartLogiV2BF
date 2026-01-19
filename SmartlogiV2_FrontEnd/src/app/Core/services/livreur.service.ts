import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';

@Injectable({
    providedIn: 'root'
})
export class LivreurService {

    constructor(private http: HttpClient, private config: ApiConfiguration) { }

    getAllLivreurs(page: number = 0, size: number = 10): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v1/gestionner/livreur?page=${page}&size=${size}`);
    }

    createLivreur(livreur: any): Observable<any> {
        return this.http.post<any>(`${this.config.rootUrl}/api/v1/gestionner/livreur`, livreur);
    }

    updateLivreur(id: string, livreur: any): Observable<any> {
        return this.http.put<any>(`${this.config.rootUrl}/api/v1/gestionner/livreur/${id}`, livreur);
    }

    deleteLivreur(id: string): Observable<any> {
        return this.http.delete(`${this.config.rootUrl}/api/v1/gestionner/livreur/${id}`, { responseType: 'text' });
    }

    searchLivreurs(keyword: string): Observable<any> {
        return this.http.get<any>(`${this.config.rootUrl}/api/v1/gestionner/livreur/search?keyword=${keyword}`);
    }
}
