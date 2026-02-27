import { Routes } from '@angular/router';
import { HomePage } from './features/home/home-page/home-page';
import { BookDetail } from './features/books/book-detail/book-detail';
import { BookList } from './features/books/book-list/book-list';
import { UserLayout } from './layouts/user-layout/user-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminPanel } from './admin/admin-panel/admin-panel';
import { ManageBooks } from './admin/manage-books/manage-books';
import { BookForm } from './admin/book-form/book-form';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: 'home', component: HomePage },
      { path: 'books', component: BookList },
      { path: 'books/:id', component: BookDetail },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'home', component: AdminPanel },
      { path: 'manage-books', component: ManageBooks },
      { path: 'manage-books-create', component: BookForm },
      { path: 'books/edit/:id', component: BookForm },
    ],
  },
];
