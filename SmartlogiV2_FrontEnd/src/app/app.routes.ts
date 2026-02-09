import { Routes } from '@angular/router';
import { LoginComponent } from './Features/Auth/login/login.component';
import { authGuard } from './Core/guards/auth.guard';
import { LayoutComponent } from './Features/Admin/layout/layout.component';

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
        path: 'manager',
        loadComponent: () => import('./Features/Manager/Layout/manager-layout/manager-layout.component').then(m => m.ManagerLayoutComponent),
        canActivate: [authGuard],
        data: { roles: ['MANAGER'] },
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', loadComponent: () => import('./Features/Manager/Overview/manager-overview/manager-overview.component').then(m => m.ManagerOverviewComponent) },
            { path: 'parcels', loadComponent: () => import('./Features/Manager/Parcels/parcel-list/parcel-list.component').then(m => m.ParcelListComponent) },
            { path: 'assignments', loadComponent: () => import('./Features/Manager/Assignments/assignment-manager/assignment-manager.component').then(m => m.AssignmentManagerComponent) }
        ]
    },
    { path: 'manager-dashboard', redirectTo: 'manager/overview', pathMatch: 'full' },
    {
        path: 'livreur-dashboard',
        loadComponent: () => import('./Features/Dashboard/livreur-dashboard/livreur-dashboard.component').then(m => m.LivreurDashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['LIVREUR'] }
    },
    {
        path: 'admin',
        component: LayoutComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] },
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', loadComponent: () => import('./Features/Admin/overview/overview.component').then(m => m.OverviewComponent) },
            { path: 'clients', loadComponent: () => import('./Features/Admin/clients/clients.component').then(m => m.ClientsComponent) },
            { path: 'managers', loadComponent: () => import('./Features/Admin/managers/managers.component').then(m => m.ManagersComponent) },
            { path: 'zones', loadComponent: () => import('./Features/Admin/zones/zones.component').then(m => m.ZonesComponent) },
            { path: 'roles', loadComponent: () => import('./Features/Admin/roles/roles.component').then(m => m.RolesComponent) }
        ]
    },
    
    { path: 'admin-dashboard', redirectTo: 'admin/overview', pathMatch: 'full' },
    
    { path: 'tracking-concept', loadComponent: () => import('./Features/Home/tracking-concept/tracking-concept.component').then(m => m.TrackingConceptComponent) },
    { path: 'concept/:id', loadComponent: () => import('./Features/Home/concept-detail/concept-detail.component').then(m => m.ConceptDetailComponent) },
    { path: 'verify-email', loadComponent: () => import('./Features/Auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
    { path: '', loadComponent: () => import('./Features/Home/home.component').then(m => m.HomeComponent) }
];