import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProgressSpinnerModule],
  templateUrl: './view-profile.html',
})
export class ViewProfileComponent implements OnInit {
  user: User | null = null;
  form: FormGroup;

  loading = true;
  saving = false;
  editing = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
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

    this.userService.getProfile().subscribe({
      next: (res) => {
        this.user = res.user;
        this.populateForm();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.error || err?.message || 'Failed to load profile';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
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
  }

  cancelEditing(): void {
    this.editing = false;
    this.populateForm();
  }

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const { firstName, lastName, dob } = this.form.value;
    const data: any = { firstName, lastName };
    if (dob) data.dob = dob;

    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.saving = false;
        this.editing = false;
        this.user = res.user;
        const msg = res.message || 'Profile updated successfully!';
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
        this.authService.updateCurrentUser(res.user);
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.error || err?.message || 'Failed to update profile';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
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