import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshed$ = new BehaviorSubject<string | null>(null);

const SKIP_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/verify-email',
  '/auth/resend-verification',
];

function shouldSkip(url: string): boolean {
  return SKIP_URLS.some((u) => url.includes(u));
}

function cloneWithToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (shouldSkip(req.url)) return next(req);

  const accessToken = tokenService.getAccessToken();
  const authReq = accessToken ? cloneWithToken(req, accessToken) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && accessToken) {
        return handle401(req, next, authService, tokenService);
      }
      return throwError(() => error);
    }),
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  tokenService: TokenService,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshed$.next(null);
    return authService.refreshToken().pipe(
      switchMap((tokens) => {
        isRefreshing = false;
        refreshed$.next(tokens.accessToken);
        return next(cloneWithToken(req, tokens.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshed$.next(null);
        authService.forceLogout();
        return throwError(() => err);
      }),
    );
  }

  return refreshed$.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(cloneWithToken(req, token!))),
  );
}
