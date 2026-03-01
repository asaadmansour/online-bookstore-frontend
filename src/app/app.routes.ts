
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/user-layout/user-layout').then((m) => m.UserLayout),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'books',
        loadComponent: () => import('./features/books/book-list/book-list').then((m) => m.BookList),
      },
      {
        path: 'books/suggestions',
        loadComponent: () =>
          import('./shared/components/search-suggestion/search-suggestion').then(
            (m) => m.SearchSuggestion,
          ),
      },
      {
        path: 'books/:id',
        loadComponent: () =>
          import('./features/books/book-detail/book-detail').then((m) => m.BookDetail),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories-page/categories-page').then(
            (m) => m.CategoriesPageComponent,
          ),
      },
      {
        path: 'categories/:id',
        loadComponent: () =>
          import('./features/categories/categories-page/categories-page').then(
            (m) => m.CategoriesPageComponent,
          ),
      },
      {
        path: 'authors',
        loadComponent: () => import('./features/authors/authors').then((m) => m.AuthorsComponent),
      },
      {
        path: 'authors/:id',
        loadComponent: () => import('./features/authors/authors').then((m) => m.AuthorsComponent),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/checkout/checkout-page/checkout-page').then((m) => m.CheckoutPage),
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./features/cart/cart-page/cart-page').then((m) => m.CartPage),
      },
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
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./admin/admin-panel/admin-panel').then((m) => m.AdminPanel),
      },
      {
        path: 'manage-orders',
        loadComponent: () =>
          import('./admin/manage-orders/manage-orders').then((m) => m.ManageOrders),
      },
      {
        path: 'manage-books',
        loadComponent: () => import('./admin/manage-books/manage-books').then((m) => m.ManageBooks),
      },
      {
        path: 'books/create',
        loadComponent: () => import('./admin/book-form/book-form').then((m) => m.BookForm),
      },
      {
        path: 'books/edit/:id',
        loadComponent: () => import('./admin/book-form/book-form').then((m) => m.BookForm),
      },
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

      {
        path: 'profile',
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
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
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
  {
    path: '**',
    loadComponent: () => import('./core/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
