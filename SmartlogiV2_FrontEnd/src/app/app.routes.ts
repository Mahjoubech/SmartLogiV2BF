import { Routes } from '@angular/router';
import { LoginComponent } from './Features/Auth/login/login.component';
import { authGuard } from './Core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'staff-login', loadComponent: () => import('./Features/Auth/staff-login/staff-login.component').then(m => m.StaffLoginComponent) },
    { path: 'admin-login', loadComponent: () => import('./Features/Auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
    { path: 'register', loadComponent: () => import('./Features/Auth/register/register.component').then(m => m.RegisterComponent) },
    {
        path: 'dashboard',
        loadComponent: () => import('./Features/Dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['CLIENT'] }
    },
    {
        path: 'manager-dashboard',
        loadComponent: () => import('./Features/Dashboard/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['MANAGER'] }
    },
    {
        path: 'livreur-dashboard',
        loadComponent: () => import('./Features/Dashboard/livreur-dashboard/livreur-dashboard.component').then(m => m.LivreurDashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['LIVREUR'] }
    },
    {
        path: 'admin-dashboard',
        loadComponent: () => import('./Features/Dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
    },
    { path: 'tracking-concept', loadComponent: () => import('./Features/Home/tracking-concept/tracking-concept.component').then(m => m.TrackingConceptComponent) },
    { path: 'concept/:id', loadComponent: () => import('./Features/Home/concept-detail/concept-detail.component').then(m => m.ConceptDetailComponent) },
    { path: 'verify-email', loadComponent: () => import('./Features/Auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
    { path: '', loadComponent: () => import('./Features/Home/home.component').then(m => m.HomeComponent) }
];