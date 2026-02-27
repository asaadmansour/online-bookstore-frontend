

import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { BRAND } from '../../core/config/brand';
import { ThemeService } from '../../core/services/theme.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [NgIf, RouterLink, CommonModule],
    templateUrl: './navbar.html',
})
export class NavbarComponent {

    brand = BRAND;
    cartCount = 2;

    isDark = false;
    constructor(private theme: ThemeService) {
        this.isDark = this.theme.isDark();
    }
    toggleTheme(): void {
        this.theme.toggle();
        this.isDark = this.theme.isDark();
    }

    adminOpen = false;

    toggleAdmin(): void {
        this.adminOpen = !this.adminOpen;
    }

    closeAdmin(): void {
        this.adminOpen = false;
    }

    @HostListener('document:click', ['$event'])
    onDocClick(e: MouseEvent): void {
        const t = e.target as HTMLElement;
        if (!t.closest('[data-admin-menu]')) this.closeAdmin();
    }
}