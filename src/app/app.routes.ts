// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [

    // ═══════════════════ PUBLIC ═══════════════════
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home-page/home-page').then((m) => m.HomePageComponent),
    },
    {
        path: 'books',
        loadComponent: () =>
            import('./features/books/book-list/book-list').then((m) => m.BookListComponent),
    },
    {
        path: 'books/:id',
        loadComponent: () =>
            import('./features/books/book-detail/book-detail').then((m) => m.BookDetailComponent),
    },
    {
        path: 'cart',
        loadComponent: () =>
            import('./features/cart/cart').then((m) => m.CartComponent),
    },

    // ═══════════════════ AUTH (guests only) ═══════════════════
    {
        path: 'auth/login',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./auth/login/login').then((m) => m.LoginComponent),
    },
    {
        path: 'auth/register',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./auth/register/register').then((m) => m.RegisterComponent),
    },
    {
        path: 'auth/verify-email',
        loadComponent: () =>
            import('./auth/verify-email/verify-email').then((m) => m.VerifyEmailComponent),
    },

    // ═══════════════════ PROTECTED ═══════════════════
    {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/checkout/checkout').then((m) => m.CheckoutComponent),
    },
    {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/order-history/order-list/order-list').then(
                (m) => m.OrderListComponent
            ),
    },
    {
        path: 'orders/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/order-history/order-detail/order-detail').then(
                (m) => m.OrderDetailComponent
            ),
    },

    // ═══════════════════ PROFILE ═══════════════════
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/profile/profile-layout/profile-layout').then(
                (m) => m.ProfileLayoutComponent
            ),
        children: [
            { path: '', redirectTo: 'info', pathMatch: 'full' },
            {
                path: 'info',
                loadComponent: () =>
                    import('./features/profile/view-profile/view-profile').then(
                        (m) => m.ViewProfileComponent
                    ),
            },
            {
                path: 'password',
                loadComponent: () =>
                    import('./features/profile/change-password/change-password').then(
                        (m) => m.ChangePasswordComponent
                    ),
            },
        ],
    },

    // ═══════════════════ ADMIN ═══════════════════
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () =>
            import('./admin/admin-layout/admin-layout').then(
                (m) => m.AdminLayoutComponent
            ),
        children: [
            { path: '', redirectTo: 'books', pathMatch: 'full' },
            {
                path: 'books',
                loadComponent: () =>
                    import('./admin/manage-books/manage-books').then(
                        (m) => m.ManageBooksComponent
                    ),
            },
            {
                path: 'authors',
                loadComponent: () =>
                    import('./admin/manage-authors/manage-authors').then(
                        (m) => m.ManageAuthorsComponent
                    ),
            },
            {
                path: 'categories',
                loadComponent: () =>
                    import('./admin/manage-categories/manage-categories').then(
                        (m) => m.ManageCategoriesComponent
                    ),
            },
            {
                path: 'orders',
                loadComponent: () =>
                    import('./admin/manage-orders/manage-orders').then(
                        (m) => m.ManageOrdersComponent
                    ),
            },
        ],
    },

    // ═══════════════════ 404 ═══════════════════
    {
        path: '**',
        loadComponent: () =>
            import('./core/not-found/not-found').then((m) => m.NotFoundComponent),
    },
];