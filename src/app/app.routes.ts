import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { RegisterComponent } from './auth/register/register';

export const routes: Routes = [
    {
        path: 'auth/login',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
    },
    {
        path: 'auth/register',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/register/register').then((m) => m.RegisterComponent),
    },
    {
        path: 'auth/verify-email',
        loadComponent: () => import('./auth/verify-email/verify-email').then((m) => m.VerifyEmailComponent),
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
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        children: []
    },
    {
        path: '',
        loadComponent: () => import('./features/home/home-page/home-page').then((m) => m.HomePageComponent),
    },
    { path: '**', redirectTo: '' }
];
