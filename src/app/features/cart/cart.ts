import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="p-4 text-center">
  <h2>Shopping Cart</h2>
  <p>Your cart is empty (stub page).</p>
</div>`,
})
export class CartComponent {}
