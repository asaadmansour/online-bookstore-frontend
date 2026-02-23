import { Routes } from '@angular/router';
import { BookDetail } from './features/books/book-detail/book-detail';
import { BookList } from './features/books/book-list/book-list';

export const routes: Routes = [
  { path: 'books', component: BookList },
  {
    path: 'books/:id',
    component: BookDetail,
  },
  { path: 'books', component: BookList },
];
