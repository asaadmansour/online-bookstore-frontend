
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'theme';

  initTheme(): void {
    const saved = (localStorage.getItem(this.key) as 'light' | 'dark') || 'light';
    this.apply(saved);
  }

  toggle(): void {
    const current = this.getTheme();
    const next: 'light' | 'dark' = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem(this.key, next);
  }

  isDark(): boolean {
    return this.getTheme() === 'dark';
  }

  private getTheme(): 'light' | 'dark' {
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
  }

  private apply(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}