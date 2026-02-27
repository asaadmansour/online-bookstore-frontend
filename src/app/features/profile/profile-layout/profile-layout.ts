// src/app/features/profile/profile-layout/profile-layout.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile-layout.html',
})
export class ProfileLayoutComponent {
  constructor(public auth: AuthService) { }

  get userInitial(): string {
    const user = this.auth.currentUser;
    return user ? user.firstName.charAt(0).toUpperCase() : '?';
  }

  get fullName(): string {
    const user = this.auth.currentUser;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  get email(): string {
    return this.auth.currentUser?.email || '';
  }
}