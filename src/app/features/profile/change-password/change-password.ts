// src/app/features/profile/change-password/change-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPass === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const { currentPassword, newPassword } = this.form.value;

    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.message || 'Password changed successfully!';
        this.form.reset();

        setTimeout(() => (this.success = ''), 5000);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.error || err?.message || 'Failed to change password';
      },
    });
  }

  get passwordStrength(): { label: string; color: string; width: string } {
    const password = this.form.get('newPassword')?.value || '';

    if (password.length === 0) {
      return { label: '', color: '', width: 'w-0' };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
    }
    if (score <= 3) {
      return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
    }
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  }

  toggleVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
}