import { Component, inject } from '@angular/core';
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
  showLogoutModal = false;
  logoutLoading = false;

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.logoutLoading = true;
    this.auth.logoutWithConfirmation().subscribe({
      next: () => {
        this.logoutLoading = false;
        this.showLogoutModal = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.logoutLoading = false;
        this.showLogoutModal = false;
        this.auth.forceLogout();
      },
    });
  }
}
