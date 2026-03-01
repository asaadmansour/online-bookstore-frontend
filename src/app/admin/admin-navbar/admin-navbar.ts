import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
  private auth = inject(AuthService);
  private router = inject(Router);
  showLogoutModal = signal(false);
  logoutLoading = signal(false);

  openLogoutModal(): void {
    this.showLogoutModal.set(true);
  }

  cancelLogout(): void {
    this.showLogoutModal.set(false);
  }

  confirmLogout(): void {
    this.logoutLoading.set(true);
    this.auth.logoutWithConfirmation().subscribe({
      next: () => {
        this.logoutLoading.set(false);
        this.showLogoutModal.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.logoutLoading.set(false);
        this.showLogoutModal.set(false);
        this.auth.forceLogout();
      },
    });
  }
}
