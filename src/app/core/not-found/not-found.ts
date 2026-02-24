// src/app/core/not-found/not-found.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="text-center">
        <h1 class="text-8xl font-bold text-gray-200">404</h1>
        <h2 class="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p class="text-gray-500 mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a routerLink="/"
           class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Go Home
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent { }