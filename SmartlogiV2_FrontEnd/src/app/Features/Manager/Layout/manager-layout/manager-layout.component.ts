import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../Core/services/auth.service';

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manager-layout.component.html',
  styleUrl: './manager-layout.component.css'
})
export class ManagerLayoutComponent implements OnInit {
  currentUser: any = null;
  tokenExpiration: Date | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Correctly accessing the property from AuthService
    this.currentUser = this.authService.currentUserValue;
    
    // Calculate token expiration
    const expiresAt = localStorage.getItem('expires_at');
    if (expiresAt) {
      this.tokenExpiration = new Date(JSON.parse(expiresAt) * 1000);
    } else {
        const d = new Date();
        d.setHours(d.getHours() + 1);
        this.tokenExpiration = d;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
