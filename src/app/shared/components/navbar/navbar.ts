import { Component, ElementRef, HostListener, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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
  private elRef = inject(ElementRef);
  private router = inject(Router);

  private currentUser = toSignal(this.auth.currentUser$, {
    initialValue: this.auth.currentUser,
  });

  isLoggedIn = computed(() => !!this.currentUser() || this.auth.isLoggedIn);

  userInitial = computed(() => {
    const user = this.currentUser();
    if (user) return user.firstName.charAt(0).toUpperCase();
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.firstName?.charAt(0)?.toUpperCase() ?? '?';
      }
    } catch { /* ignore */ }
    return '?';
  });

  userName = computed(() => {
    const user = this.currentUser();
    if (user) return `${user.firstName} ${user.lastName}`;
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed ? `${parsed.firstName} ${parsed.lastName}` : '';
      }
    } catch { /* ignore */ }
    return '';
  });

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onEnterSearch() {
    const query = this.searchQuery();
    if (!query.trim()) return;
    this.router.navigate(['/books'], { queryParams: { search: query, page: 1 } });
    this.searchQuery.set('');
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
