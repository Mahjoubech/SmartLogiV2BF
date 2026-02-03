import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();
    console.log('[AuthGuard] Checking access. Token present:', !!token);

    if (!token) {
        console.warn('[AuthGuard] No token found. Redirecting to login.');
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    
    const requiredRoles = route.data['roles'] as Array<string>;
    console.log('[AuthGuard] Required roles:', requiredRoles);

    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }
    
    const hasRole = authService.hasRole(requiredRoles);
    console.log('[AuthGuard] Has role?', hasRole);

    if (hasRole) {
        return true;
    }
    
    console.warn('[AuthGuard] Unauthorized access: Role mismatch.', requiredRoles);
    router.navigate(['/login']);
    return false;
};
