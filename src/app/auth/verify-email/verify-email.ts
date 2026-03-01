
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  form: FormGroup;
  email = '';
  error = '';
  success = '';
  loading = false;
  resendLoading = false;
  resendCooldown = 0;
  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^[A-Za-z0-9]{6}$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] ?? '';
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';

    this.auth.verifyEmail(this.form.value.code).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.message || 'Email verified! Redirecting…';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || err?.message || 'Verification failed';
      },
    });
  }

  resend(): void {
    if (!this.email || this.resendCooldown > 0) return;
    this.resendLoading = true;
    this.error = '';
    this.success = '';

    this.auth.resendVerification(this.email).subscribe({
      next: () => {
        this.resendLoading = false;
        this.success = 'New code sent!';
        this.startCooldown();
      },
      error: (err) => {
        this.resendLoading = false;
        this.error = err?.error?.error || err?.message || 'Could not resend';
      },
    });
  }

  private startCooldown(): void {
    this.resendCooldown = 60;
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0 && this.cooldownTimer) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }
}