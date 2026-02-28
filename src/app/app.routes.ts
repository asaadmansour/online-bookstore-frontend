// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { BookDetail } from './features/books/book-detail/book-detail';
import { BookList } from './features/books/book-list/book-list';
import { UserLayout } from './layouts/user-layout/user-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminPanel } from './admin/admin-panel/admin-panel';
import { ManageBooks } from './admin/manage-books/manage-books';
import { BookForm } from './admin/book-form/book-form';
import { CheckoutPage } from './features/checkout/checkout-page/checkout-page';
import { CartPage } from './features/cart/cart-page/cart-page';
import { SearchSuggestion } from './shared/components/search-suggestion/search-suggestion';
import { HomePage } from './features/home/home-page/home-page';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { CategoriesPageComponent } from './features/categories/categories-page/categories-page';
import { AuthorsComponent } from './features/authors/authors';
/* import { LayoutComponent } from './main/layout/layout';
import { NotFoundComponent } from './core/not-found/not-found';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
import { ManageAuthorsComponent } from './admin/manage-authors/manage-authors';
import { ManageCategoriesComponent } from './admin/manage-categories/manage-categories';
import { AuthorListComponent } from './admin/manage-authors/author-list/author-list';
import { AuthorFormComponent } from './admin/manage-authors/author-form/author-form';
import { CategoryListComponent } from './admin/manage-categories/category-list/category-list';
import { CategoryFormComponent } from './admin/manage-categories/category-form/category-form'; */

import { ManageOrders } from './admin/manage-orders/manage-orders';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: 'home', component: HomePage },
      { path: 'books', component: BookList },
      { path: 'books/suggestions', component: SearchSuggestion },
      { path: 'books/:id', component: BookDetail },
      { path: 'categories', component: CategoriesPageComponent },
      { path: 'categories/:id', component: CategoriesPageComponent },
      { path: 'authors', component: AuthorsComponent },
      { path: 'authors/:id', component: AuthorsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'checkout', canActivate: [authGuard], component: CheckoutPage },
      { path: 'cart', canActivate: [authGuard], component: CartPage },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/order-history/order-list/order-list').then(
            (m) => m.OrderListComponent,
          ),
      },
      {
        path: 'orders/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/order-history/order-detail/order-detail').then(
            (m) => m.OrderDetailComponent,
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/profile-layout/profile-layout').then(
            (m) => m.ProfileLayoutComponent,
          ),
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          {
            path: 'info',
            loadComponent: () =>
              import('./features/profile/view-profile/view-profile').then(
                (m) => m.ViewProfileComponent,
              ),
          },
          {
            path: 'password',
            loadComponent: () =>
              import('./features/profile/change-password/change-password').then(
                (m) => m.ChangePasswordComponent,
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    component: AdminLayout,
    children: [
      { path: 'home', component: AdminPanel },
      { path: 'manage-books', component: ManageBooks },
      { path: 'books/create', component: BookForm },
      { path: 'books/edit/:id', component: BookForm },
      { path: 'manage-orders', component: ManageOrders },
      {
        path: 'authors',
        loadComponent: () =>
          import('./admin/manage-authors/manage-authors').then((m) => m.ManageAuthorsComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./admin/manage-authors/author-list/author-list').then(
                (m) => m.AuthorListComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./admin/manage-authors/author-form/author-form').then(
                (m) => m.AuthorFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./admin/manage-authors/author-form/author-form').then(
                (m) => m.AuthorFormComponent,
              ),
          },
        ],
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin/manage-categories/manage-categories').then(
            (m) => m.ManageCategoriesComponent,
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./admin/manage-categories/category-list/category-list').then(
                (m) => m.CategoryListComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./admin/manage-categories/category-form/category-form').then(
                (m) => m.CategoryFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./admin/manage-categories/category-form/category-form').then(
                (m) => m.CategoryFormComponent,
              ),
          },
        ],
      },

      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register').then((m) => m.RegisterComponent),
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./auth/verify-email/verify-email').then((m) => m.VerifyEmailComponent),
      },
    ],
  },
  // ═══════════════════ 404 ═══════════════════
  {
    path: '**',
    loadComponent: () => import('./core/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
