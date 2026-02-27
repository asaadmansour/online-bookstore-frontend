import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';

import { BookList } from './features/books/book-list/book-list';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Navbar } from "./shared/components/navbar/navbar";
import { HomeImage } from "./features/home/home-image/home-image";
import { HomePage } from "./features/home/home-page/home-page";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookList, ProgressSpinner, Navbar, RouterOutlet, Button, Navbar, HomeImage, HomePage],
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
