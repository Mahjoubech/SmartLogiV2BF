import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  currentUser: any = null;
  tokenExpiration: Date = new Date();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
    const token = this.authService.getToken();
    if (token) {
        // Simple mock expiration for now or decode token if needed
        // this.tokenExpiration = ...
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
