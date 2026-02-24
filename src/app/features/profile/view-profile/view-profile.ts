import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-profile.html',
})
export class ViewProfileComponent implements OnInit {
  user: User | null = null;
  form: FormGroup;

  loading = true;
  saving = false;
  editing = false;

  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern(/^[A-Za-z]+$/),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern(/^[A-Za-z]+$/),
      ]],
      dob: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = '';

    this.userService.getProfile().subscribe({
      next: (res) => {
        this.user = res.user;
        this.populateForm();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.error || err?.message || 'Failed to load profile';
      },
    });
  }

  private populateForm(): void {
    if (!this.user) return;

    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      dob: this.user.dob
        ? new Date(this.user.dob).toISOString().split('T')[0]
        : '',
    });
  }

  startEditing(): void {
    this.editing = true;
    this.success = '';
    this.error = '';
  }

  cancelEditing(): void {
    this.editing = false;
    this.populateForm();
    this.error = '';
  }

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';

    const { firstName, lastName, dob } = this.form.value;
    const data: any = { firstName, lastName };
    if (dob) data.dob = dob;

    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.saving = false;
        this.editing = false;
        this.user = res.user;
        this.success = res.message || 'Profile updated successfully!';

        // Update the AuthService's current user so navbar reflects changes
        this.authService.updateCurrentUser(res.user);

        setTimeout(() => (this.success = ''), 4000);
      },
      error: (err) => {
        this.saving = false;
        this.error =
          err?.error?.error || err?.message || 'Failed to update profile';
      },
    });
  }

  get memberSince(): string {
    if (!this.user?.createdAt) return '';
    return new Date(this.user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get formattedDob(): string {
    if (!this.user?.dob) return 'Not set';
    return new Date(this.user.dob).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}