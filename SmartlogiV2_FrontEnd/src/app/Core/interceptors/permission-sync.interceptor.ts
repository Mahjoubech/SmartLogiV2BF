import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PermissionSyncInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
            
                if (error.status === 403 && this.authService.isAuthenticated()) {
                    console.warn('403 Forbidden detected. Syncing user permissions...');
                    return this.authService.syncUser().pipe(
  switchMap(() => next.handle(request))
,
                        catchError(syncError => {
                            console.error('Failed to sync user permissions during 403:', syncError);
                            return throwError(() => error);
                        })
                    );
                }
                return throwError(() => error);
            })
        );
    }
}
