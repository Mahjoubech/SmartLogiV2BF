import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private http: HttpClient, private config: ApiConfiguration) { }

    getMyNotifications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.config.rootUrl}/api/v1/notifications`);
    }

    markAsRead(id: string): Observable<void> {
        return this.http.put<void>(`${this.config.rootUrl}/api/v1/notifications/${id}/read`, {});
    }
}
