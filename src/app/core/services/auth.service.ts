import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environments';
import {
  User,
  AuthResponse,
  TokenResponse,
  LoginPayload,
  RegisterPayload,
} from '../../shared/models/user.model';

const USER_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  private userSubject = new BehaviorSubject<User | null>(this.storedUser());
  currentUser$ = this.userSubject.asObservable();

  private http = inject(HttpClient);
  private token = inject(TokenService);
  private router = inject(Router);

  private storedUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw && this.token.isLoggedIn() ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.token.isLoggedIn();
  }

  updateCurrentUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/register`, payload)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/login`, payload)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.token.getRefreshToken();
    return this.http
      .post<TokenResponse>(`${this.api}/refresh`, { refreshToken })
      .pipe(tap((tokens) => this.token.setTokens(tokens.accessToken, tokens.refreshToken)));
  }

  logout(): void {
    const refreshToken = this.token.getRefreshToken();
    const userId = this.token.getUserId();
    const accessToken = this.token.getAccessToken();

    if (refreshToken && userId) {
      const options = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined;

      this.http.post(`${this.api}/logout`, { userId, refreshToken }, options).subscribe({
        next: () => console.log('Server: refresh token invalidated'),
        error: () => console.warn('Server logout failed — tokens cleared locally'),
      });
    }

    this.clearAllState();
    this.router.navigate(['/auth/login']);
  }

  logoutWithConfirmation(): Observable<any> {
    const refreshToken = this.token.getRefreshToken();
    const userId = this.token.getUserId();
    const accessToken = this.token.getAccessToken();

    return new Observable((observer) => {
      if (refreshToken && userId) {
        const options = accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined;

        this.http.post(`${this.api}/logout`, { userId, refreshToken }, options).subscribe({
          next: (res) => {
            this.clearAllState();
            observer.next(res);
            observer.complete();
          },
          error: () => {
            this.clearAllState();
            observer.next({ message: 'Logged out locally' });
            observer.complete();
          },
        });
      } else {
        this.clearAllState();
        observer.next({ message: 'Logged out' });
        observer.complete();
      }
    });
  }

  forceLogout(): void {
    this.clearState();
    this.router.navigate(['/']);
  }

  verifyEmail(code: string): Observable<{ message: string }> {
    // Backend expects POST with { verificationCode }
    return this.http.post<{ message: string }>(`${this.api}/verify-email`, {
      verificationCode: code,
    });
  }

  resendVerification(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/resend-verification`, { email });
  }

  private handleAuth(res: AuthResponse): void {
    this.token.setTokens(res.tokens.accessToken, res.tokens.refreshToken);
    this.userSubject.next(res.user);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  private clearState(): void {
    this.token.clearTokens();
    this.userSubject.next(null);
    localStorage.removeItem(USER_KEY);
  }

  private clearAllState(): void {
    this.token.clearTokens();
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
  }
}
