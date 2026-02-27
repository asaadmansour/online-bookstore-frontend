import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SearchSuggestion } from '../search-suggestion/search-suggestion';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, SearchSuggestion],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery = signal<string>('');
  dropdownOpen = signal<boolean>(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private elRef = inject(ElementRef);

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  get userInitial(): string {
    const user = this.auth.currentUser;
    return user ? user.firstName.charAt(0).toUpperCase() : '?';
  }

  get userName(): string {
    const user = this.auth.currentUser;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.dropdownOpen.set(false);
    }
  }

  logout(): void {
    this.auth.logout();
    this.closeDropdown();
  }
}
