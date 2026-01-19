import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // 1. Check if the user is authenticated
    if (!authService.isAuthenticated()) {
        // Redirect to login if not authenticated
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    // 2. Check for required roles from route data
    const requiredRoles = route.data['roles'] as Array<string>;

    // If no roles are required, allow access (since already authenticated)
    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }

    // 3. Check if the user has the required role
    if (authService.hasRole(requiredRoles)) {
        return true;
    }

    // 4. If roles don't match, rediret/prevent access
    // Logic: "Déconnecte l’utilisateur et redirige vers /login si les rôles ont changé côté serveur"
    // (Assuming if roles don't match what's required, we can treat it as unauthorized/stale)
    console.warn('Unauthorized access: User does not have required roles', requiredRoles);

    // If the requirement is to disconnect:
    // authService.logout();

    router.navigate(['/login']); // Or a specialized /unauthorized page
    return false;
};
