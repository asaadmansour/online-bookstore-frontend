import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
