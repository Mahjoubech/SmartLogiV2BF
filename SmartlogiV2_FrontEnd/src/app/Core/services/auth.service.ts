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
    private userKey = 'user_data';
    
    private currentUserSubject: BehaviorSubject<AuthResponse | null>;
    public currentUser$: Observable<AuthResponse | null>;

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration,
    ) {
        
        const savedUser: AuthResponse | null = this.getUserFromStorage();
        this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(savedUser);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    

    public get currentUserValue(): AuthResponse | null {
        return this.currentUserSubject.value;
    }

    public getToken(): string | null {
        
        const memoryToken = this.currentUserSubject.value?.token;
        if (memoryToken) return memoryToken;

        
        if (typeof window !== 'undefined') {
            try {
                
                const item = localStorage.getItem(this.tokenKey);
                if (item) return item;
            } catch (e) {
                
            }

            
            const cookieToken = this.getCookie(this.tokenKey);
            if (cookieToken) return cookieToken;
        }

        return null;
    }

    public getUserRole(): string | undefined {
        return this.currentUserValue?.role?.name;
    }

    public isAuthenticated(): boolean {
        return !!this.getToken();
    }

    public hasRole(requiredRoles: string[]): boolean {
        const userRole = this.getUserRole();
        if (!userRole) return false;
        return requiredRoles.includes(userRole);
    }

    

    private setCookie(name: string, value: string, days: number): void {
        if (typeof window === 'undefined') return;
        try {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        } catch (e) {
            console.warn('[AuthService] Cookie write failed', e);
        }
    }

    private getCookie(name: string): string | null {
        if (typeof window === 'undefined') return null;
        try {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
        } catch (e) { }
        return null;
    }

    private deleteCookie(name: string): void {
        if (typeof window === 'undefined') return;
        try {
            document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        } catch (e) { }
    }

    

    public setSession(authResponse: AuthResponse): void {
        console.log('[AuthService] setSession called with:', authResponse);
        if (authResponse && authResponse.token) {
            
            
            try {
                if (typeof window !== 'undefined') {
                    localStorage.setItem(this.tokenKey, authResponse.token);
                    localStorage.setItem(this.userKey, JSON.stringify(authResponse));
                    console.log('[AuthService] Saved to LocalStorage');
                }
            } catch (e) {
                console.warn('[AuthService] LocalStorage blocked, skipping.');
            }

            
            this.setCookie(this.tokenKey, authResponse.token, 1);
            this.setCookie(this.userKey, JSON.stringify(authResponse), 1);
            
            this.currentUserSubject.next(authResponse);
        }
    }

    public logout(): void {
        
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(this.tokenKey);
                localStorage.removeItem(this.userKey);
            }
        } catch (e) { }

        
        this.deleteCookie(this.tokenKey);
        this.deleteCookie(this.userKey);

        this.currentUserSubject.next(null);
    }

    
    
    syncUser(): Observable<AuthResponse> {
        return this.http.get<AuthResponse>(`${this.config.rootUrl}/api/v2/auth/me`).pipe(
            tap(authResponse => {
                const currentToken = this.getToken();
                if (!authResponse.token && currentToken) {
                    authResponse.token = currentToken;
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
            tap(authResponse => this.setSession(authResponse))
        );
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

    

    private getUserFromStorage(): AuthResponse | null {
        if (typeof window === 'undefined') return null;

        
        try {
            const storedItem = localStorage.getItem(this.userKey);
            if (storedItem) return JSON.parse(storedItem);
        } catch (e) {}

        
        const cookieUser = this.getCookie(this.userKey);
        if (cookieUser) {
            try {
                return JSON.parse(cookieUser);
            } catch (e) { }
        }
        return null;
    }
}
