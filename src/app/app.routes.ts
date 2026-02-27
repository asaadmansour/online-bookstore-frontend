import { Routes } from '@angular/router';
import { BookDetail } from './features/books/book-detail/book-detail';
import { BookList } from './features/books/book-list/book-list';
import { CheckoutPage } from './features/checkout/checkout-page/checkout-page';
import { CartPage } from './features/cart/cart-page/cart-page';
import { SearchSuggestion } from './shared/components/search-suggestion/search-suggestion';

export const routes: Routes = [
  { path: 'books', component: BookList },
  { path: 'books/suggestions', component: SearchSuggestion },
  {
    path: 'books/:id',
    component: BookDetail,
  },
  { path: 'books', component: BookList },
  { path: 'checkout', component: CheckoutPage },
  { path: 'cart', component: CartPage },
];
