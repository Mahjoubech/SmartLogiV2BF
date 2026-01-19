import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.token;
        const isApiUrl = request.url.startsWith('http') || request.url.startsWith('https') || request.url.startsWith('/api');

        console.log(`[JwtInterceptor] Intercepting request: ${request.url}`);

        if (token && isApiUrl) {
            console.log(`[JwtInterceptor] Attaching token to: ${request.url} (Token starts with: ${token.substring(0, 10)}...)`);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else if (isApiUrl) {
            console.warn(`[JwtInterceptor] NO TOKEN found for API request: ${request.url}`);
        }

        return next.handle(request).pipe(
            catchError((error: any) => {
                if (error.status === 401) {
                    console.error('[JwtInterceptor] 401 Unauthorized detected. Logging out...');
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}
