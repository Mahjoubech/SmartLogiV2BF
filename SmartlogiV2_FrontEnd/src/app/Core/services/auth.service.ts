import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';
import { login } from '../api/fn/auth-controller/login';
import { register } from '../api/fn/auth-controller/register';
import { LoginRequest } from '../api/models/login-request';
import { RegisterRequest } from '../api/models/register-request';
import { AuthResponse } from '../api/models/auth-response';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey = 'token';
    private currentUserSubject: BehaviorSubject<AuthResponse | null>;
    public currentUser$: Observable<AuthResponse | null>;

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ) {
        let savedUser = null;
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                savedUser = localStorage.getItem(this.tokenKey);
            }
        } catch (e) {
            console.warn('[AuthService] LocalStorage access blocked. Session will not persist across reloads.', e);
        }

        let user = null;
        if (savedUser) {
            try {
                user = JSON.parse(savedUser);
            } catch (e) {
                console.error('[AuthService] Invalid token in storage', e);
                this.safeRemoveItem(this.tokenKey);
            }
        }
        this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(user);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    private safeRemoveItem(key: string): void {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.removeItem(key);
            }
        } catch (e) {
        }
    }

    public get currentUserValue(): AuthResponse | null {
        return this.currentUserSubject.value;
    }

    public get token(): string | undefined {
        const t = this.currentUserValue?.token;
        if (t) {
        } else {
            console.warn('[AuthService] Token getter: EMPTY');
        }
        return t;
    }

    public setSession(authResponse: AuthResponse): void {
        if (authResponse && authResponse.token) {
            console.log('[AuthService] Setting new session');
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem(this.tokenKey, JSON.stringify(authResponse));
                }
            } catch (e) {
                console.warn('[AuthService] Could not save to storage (likely blocked)', e);
            }
            this.currentUserSubject.next(authResponse);
        } else {
            // console.warn('[AuthService] Attempted to set invalid session or clearing session');
        }
    }

    syncUser(): Observable<AuthResponse> {
        return this.http.get<AuthResponse>(`${this.config.rootUrl}/api/v2/auth/me`).pipe(
            tap(authResponse => {
                const currentResponse = this.currentUserValue;
                if (currentResponse && !authResponse.token) {
                    authResponse.token = currentResponse.token;
                }
                this.setSession(authResponse);
            })
        );
    }

    login(loginRequest: LoginRequest): Observable<AuthResponse> {
        return login(this.http, this.config.rootUrl, { body: loginRequest }).pipe(
            map(response => response.body),
            tap(authResponse => this.setSession(authResponse))
        );
    }

    register(registerRequest: RegisterRequest): Observable<AuthResponse> {
        return register(this.http, this.config.rootUrl, { body: registerRequest }).pipe(
            map(response => response.body),
            tap(authResponse => {
                if (authResponse.token) this.setSession(authResponse)
            })
        );
    }

    logout(): void {
        this.safeRemoveItem(this.tokenKey);
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    getUserRole(): string | undefined {
        return this.currentUserValue?.role?.name;
    }

    hasRole(requiredRoles: string[]): boolean {
        const userRole = this.getUserRole();
        if (!userRole) return false;
        return requiredRoles.includes(userRole);
    }

    verifyAccount(email: string, code: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.config.rootUrl}/api/v2/auth/verify`, { email, code }).pipe(
            tap(authResponse => this.setSession(authResponse))
        );
    }

    resendCode(email: string): Observable<string> {
        return this.http.post(`${this.config.rootUrl}/api/v2/auth/resend-code`, null, {
            params: { email },
            responseType: 'text'
        });
    }

    updatePassword(currentPassword: string, newPassword: string): Observable<string> {
        return this.http.post(`${this.config.rootUrl}/api/v2/auth/update-password`, { currentPassword, newPassword }, { responseType: 'text' });
    }
}
