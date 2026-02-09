import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    
    
    
    
    
    
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        
        const user = this.authService.currentUserValue;
        if (user && user.role?.name === 'ADMIN') {
             this.router.navigate(['/admin-dashboard']);
        } else {
            
            this.authService.logout();
            this.errorMessage = 'ACCESS DENIED: Insufficient privileges.';
            this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.error && typeof err.error === 'string') {
           this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
           this.errorMessage = err.error.message;
        } else if (err.status === 0) {
            this.errorMessage = 'Connection Failed. Please ensure Backend is running and check CORS settings.';
        } else if (err.status === 400) {
            this.errorMessage = 'Bad Request: Please check your input.';
        } else {
            this.errorMessage = 'Authentication Failed. Invalid credentials.';
        }
        this.isLoading = false;
      }
    });
  }
}
