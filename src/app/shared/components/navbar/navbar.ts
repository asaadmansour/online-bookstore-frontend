import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchSuggestion } from '../search-suggestion/search-suggestion';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive,SearchSuggestion],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery = signal<string>('');

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
