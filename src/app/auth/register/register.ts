
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  loading = false;
  showPassword = false;
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  constructor() {
    this.form = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(15),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(15),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        confirmPassword: ['', [Validators.required]],
        dob: [''],
      },
      { validators: this.passwordsMatch },
    );
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    const { dob, confirmPassword, ...rest } = this.form.value;
    const payload = { ...rest, ...(dob ? { dob } : {}) };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        // this.router.navigate(['/auth/verify-email'], {
        //   queryParams: { email: payload.email },
        // });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.error || err?.message || 'Registration failed';
        this.messageService.add({ severity: 'error', summary: 'Registration Failed', detail: msg });
      },
    });
  }
}
