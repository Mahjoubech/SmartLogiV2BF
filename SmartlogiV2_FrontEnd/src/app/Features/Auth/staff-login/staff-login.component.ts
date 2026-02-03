import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Core/services/auth.service';
import { SmartLogiLogoComponent } from '../../../Shared/components/smartlogi-logo/smartlogi-logo.component';

@Component({
    selector: 'app-staff-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SmartLogiLogoComponent],
    templateUrl: './staff-login.component.html',
    styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['MANAGER', Validators.required] // Default to MANAGER
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const { email, password, role } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: (res) => {
                this.isLoading = false;

                // Strict Role Check based on Selection
                if (res.role?.name !== role) {
                    this.errorMessage = `Access Denied: You are not authorized as a ${role}.`;
                    // Optional: Logout immediately if we want to rely strictly on this portal
                    this.authService.logout();
                    return;
                }

                if (res.role?.name === 'MANAGER') {
                    this.router.navigate(['/manager-dashboard']);
                } else if (res.role?.name === 'LIVREUR') {
                    this.router.navigate(['/livreur-dashboard']);
                } else {
                    // Should not happen due to check above, but fallback
                    this.errorMessage = 'Invalid role configuration.';
                }
            },
            error: (err) => {
                this.isLoading = false;
                if (err.error && err.error.message) {
                    this.errorMessage = err.error.message;
                } else {
                    this.errorMessage = 'Login failed. Please check your credentials.';
                }
            }
        });
    }
}
