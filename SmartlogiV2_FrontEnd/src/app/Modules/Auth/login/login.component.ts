import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Core/services/auth.service';

import { SmartLogiLogoComponent } from '../../../Shared/components/smartlogi-logo/smartlogi-logo.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SmartLogiLogoComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        // Check for token in URL (Social Login Redirect)
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            if (token) {
                console.log('Token found in URL, decoding payload...');
                try {
                    // Decode JWT Payload (Base64)
                    const payloadBase64 = token.split('.')[1];
                    const payloadJson = atob(payloadBase64);
                    const payload = JSON.parse(payloadJson);

                    console.log('Decoded Payload:', payload);
                    const authResponse = {
                        token: token,
                        email: payload.sub,
                        role: { name: payload.role },
                        nom: payload.name
                    };

                    this.authService.setSession(authResponse);

                    if (payload.role === 'ADMIN') {
                        this.router.navigate(['/admin-dashboard'], { replaceUrl: true });
                    } else {
                        this.router.navigate(['/dashboard'], { replaceUrl: true });
                    }
                } catch (e) {
                    console.error('Error handling token redirect:', e);
                    this.errorMessage = 'Failed to process social login. Please try again.';
                }
            }
        });
    }

    loginWithGoogle(): void {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    }

    loginWithFacebook(): void {
        window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
    }

    loginWithGithub(): void {
        window.location.href = 'http://localhost:8080/oauth2/authorization/github';
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res.role?.name === 'ADMIN') {
                    this.router.navigate(['/admin-dashboard']);
                } else {
                    this.router.navigate(['/dashboard']);
                }
            },
            error: (err) => {
                this.isLoading = false;
                if (err.error && err.error.message) {
                    this.errorMessage = err.error.message;
                } else if (err.status === 0) {
                    this.errorMessage = 'Unable to connect to the server.';
                } else if (err.status === 401 || err.status === 403) {
                    this.errorMessage = 'Incorrect username or password.';
                } else {
                    this.errorMessage = 'An unexpected error occurred.';
                }
            }
        });
    }
}
