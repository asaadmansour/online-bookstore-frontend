import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_KEY = 'accessToken';
  private readonly REFRESH_KEY = 'refreshToken';

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  private decodeToken(token: string): Record<string, any> | null {
    try {
      const base64url = token.split('.')[1];
      const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    const decoded = this.decodeToken(token);
    if (!decoded?.['exp']) return true;
    return decoded['exp'] * 1000 <= Date.now() + 30_000;
  }

  isLoggedIn(): boolean {
    return !this.isTokenExpired(this.getRefreshToken());
  }

  getUserRole(): 'user' | 'admin' | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.decodeToken(token)?.['role'] ?? null;
  }

  getUserId(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.decodeToken(token)?.['userId'] ?? null;
  }
}
