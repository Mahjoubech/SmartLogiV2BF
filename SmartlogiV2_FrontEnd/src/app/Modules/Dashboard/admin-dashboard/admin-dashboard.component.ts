import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mt-5">
      <div class="alert alert-primary">
          <h1>Admin Dashboard</h1>
          <p>Welcome, Administrator!</p>
      </div>
      <div *ngIf="currentUser$ | async as user">
        <p><strong>Logged in as:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role?.name }}</p>
      </div>
      <button class="btn btn-outline-danger" (click)="logout()">Logout</button>
    </div>
  `,
    styles: []
})
export class AdminDashboardComponent {
    currentUser$;

    constructor(private authService: AuthService, private router: Router) {
        this.currentUser$ = this.authService.currentUser$;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
