import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-book-detail',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="p-4 text-center">
  <h2>Book Detail</h2>
  <p>Details are coming soon.</p>
</div>`,
})
export class BookDetailComponent {}
