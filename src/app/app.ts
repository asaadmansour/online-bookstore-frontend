// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';
import { LogoutModalComponent } from './shared/components/logout-modal/logout-modal';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LogoutModalComponent,],
    templateUrl: './app.html',
})
export class App {
    mobileMenuOpen = false;
    showLogoutModal = false;
    logoutLoading = false;
    profileDropdownOpen = false;

    constructor(
        public auth: AuthService,
        public token: TokenService,
        private router: Router
    ) { }

    get isLoggedIn(): boolean {
        return this.token.isLoggedIn();
    }

    get isAdmin(): boolean {
        return this.token.getUserRole() === 'admin';
    }

    get userName(): string {
        const user = this.auth.currentUser;
        return user ? `${user.firstName} ${user.lastName}` : '';
    }

    get userInitial(): string {
        const user = this.auth.currentUser;
        return user ? user.firstName.charAt(0).toUpperCase() : '?';
    }

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen = false;
        this.profileDropdownOpen = false;
    }

    toggleProfileDropdown(): void {
        this.profileDropdownOpen = !this.profileDropdownOpen;
    }

    openLogoutModal(): void {
        this.closeMobileMenu();
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