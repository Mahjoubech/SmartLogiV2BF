import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';

@Injectable({
    providedIn: 'root'
})
export class ZoneService {

    constructor(private http: HttpClient, private config: ApiConfiguration) { }

    getAllZones(): Observable<any[]> {
        return this.http.get<any[]>(`${this.config.rootUrl}/api/v1/zones`);
    }
}
