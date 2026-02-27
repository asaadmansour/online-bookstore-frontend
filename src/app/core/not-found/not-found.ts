// src/app/core/not-found/not-found.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 class="font-bold text-gray-400" style="font-size: 8rem; opacity: 0.15;">404</h1>
        <h3 class="font-bold mb-2">Page Not Found</h3>
        <p class="text-gray-500 mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/" class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          Go Home
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent { }