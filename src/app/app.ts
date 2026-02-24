import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';
import { LogoutModalComponent } from './shared/components/logout-modal/logout-modal';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LogoutModalComponent],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    mobileMenuOpen = false;
    showLogoutModal = false;
    logoutLoading = false;

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

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen = false;
    }


    openLogoutModal(): void {
        this.closeMobileMenu();
        this.showLogoutModal = true;
    }

    /** Step 2: User cancels */
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

    quickLogout(): void {
        this.closeMobileMenu();
        this.auth.logout();
    }
}