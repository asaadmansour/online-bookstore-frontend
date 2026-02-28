// src/app/features/profile/profile-layout/profile-layout.ts
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile-layout.html',
})
export class ProfileLayoutComponent {
  private auth = inject(AuthService);

  private currentUser = toSignal(this.auth.currentUser$, {
    initialValue: this.auth.currentUser,
  });

  userInitial = computed(() => {
    const user = this.currentUser();
    return user ? user.firstName.charAt(0).toUpperCase() : '?';
  });

  fullName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  email = computed(() => this.currentUser()?.email ?? '');

  private tokenService = inject(TokenService);
  isAdmin = computed(() => this.tokenService.getUserRole() === 'admin');
}