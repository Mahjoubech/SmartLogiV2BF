import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Core/services/auth.service';
import { SmartLogiLogoComponent } from '../../../Shared/components/smartlogi-logo/smartlogi-logo.component';

@Component({
    selector: 'app-verify-email',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SmartLogiLogoComponent],
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
    verifyForm: FormGroup;
    email: string = '';
    isLoading = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {
        this.verifyForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
        });
    }

    ngOnInit(): void {
        this.email = this.route.snapshot.queryParams['email'] || '';
        console.log('[VerifyEmail] Email from URL params:', this.email);
        console.log('[VerifyEmail] Full query params:', this.route.snapshot.queryParams);
        if (!this.email) {
            this.errorMessage = 'No email provided. Please register again.';
        }
    }

    onSubmit(): void {
        if (this.verifyForm.invalid || !this.email) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;
        this.successMessage = null;
        const code = this.verifyForm.get('code')?.value;

        this.authService.verifyAccount(this.email, code).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                this.successMessage = 'Account verified successfully! Redirecting to dashboard...';
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 1500);
            },
            error: (err: any) => {
                this.isLoading = false;
                this.errorMessage = 'Verification failed. Invalid code or expired.';
                console.error(err);
            }
        });
    }

    onResendCode(): void {
        if (!this.email) return;

        this.isLoading = true;
        this.errorMessage = null;
        this.successMessage = null;

        this.authService.resendCode(this.email).subscribe({
            next: () => {
                this.isLoading = false;
                this.successMessage = 'Verification code has been resent to your email.';
            },
            error: (err: any) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to resend code.';
                console.error(err);
            }
        });
    }
}
