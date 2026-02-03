import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Core/services/auth.service';

import { SmartLogiLogoComponent } from '../../../Shared/components/smartlogi-logo/smartlogi-logo.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SmartLogiLogoComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telephone: ['', Validators.required],
            adresse: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            const registerData = this.registerForm.value;

            console.log('Registering unit with data:', { ...registerData, password: '***', confirmPassword: '***' });

            this.authService.register(registerData).subscribe({
                next: (response) => {
                    console.log('Registration successful, redirecting to verification.');
                    this.completeRegistration();
                },
                error: (err) => {
                    console.error('Registration failed:', err);
                    this.isLoading = false;

                    // Extract cleaner error message
                    if (err.error && typeof err.error === 'string') {
                        try {
                            const parse = JSON.parse(err.error);
                            this.errorMessage = parse.message || err.error;
                        } catch (e) {
                            this.errorMessage = err.error;
                        }
                    } else if (err.error && err.error.message) {
                        this.errorMessage = err.error.message;
                    } else if (err.status === 409) {
                        this.errorMessage = 'Email already exists.';
                    } else if (err.status === 400) {
                        this.errorMessage = 'Invalid data provided.';
                    } else {
                        this.errorMessage = 'Registration failed. Please try again.';
                    }
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    private completeRegistration() {
        this.isLoading = false;
        const email = this.registerForm.get('email')?.value;
        this.router.navigate(['/verify-email'], { queryParams: { email } }).then(success => {
            if (success) {
                console.log('Navigation to verification confirmed');
            } else {
                console.warn('Navigation to verification failed');
            }
        });
    }
}
