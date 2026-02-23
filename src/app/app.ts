import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';

import { BookList } from './features/books/book-list/book-list';
import { Navbar } from './shared/components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookList, ProgressSpinner, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  items: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'Books', routerLink: '/books' },
    { label: 'Cart', routerLink: '/cart' },
    { label: 'Login', routerLink: '/auth/login' },
  ];
}
