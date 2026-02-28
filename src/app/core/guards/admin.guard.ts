import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
    const router = inject(Router);

    // Support common token key variations
    const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('jwt');

    // Support common role key variations
    const role =
        localStorage.getItem('role') ||
        localStorage.getItem('userRole') ||
        localStorage.getItem('user_role');

    if (token && role === 'admin') {
        return true;
    }

    // Redirect to the public home page if not authenticated as admin
    return router.createUrlTree(['/home']);
};
