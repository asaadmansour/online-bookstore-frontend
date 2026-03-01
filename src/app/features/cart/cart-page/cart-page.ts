import { Component, computed, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { CartFacade } from '../../../core/services/cart.facade';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [ProgressSpinnerModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  readonly cartFacade = inject(CartFacade);
  readonly cart = this.cartFacade.cart;
  readonly loading = this.cartFacade.loading;
  readonly error = this.cartFacade.error;
  readonly subtotal = computed(() => {
    const currentCart = this.cart();
    if (!currentCart) return 0;
    return currentCart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  });
  readonly totalItems = computed(() => {
    const currentCart = this.cart();
    if (!currentCart) return 0;
    return currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
  });
  constructor() {
    this.cartFacade.loadCart();
  }

  addItem() {
    this.cartFacade.addItem();
  }

  updateQuantity(itemId: string | undefined, current: number, delta: number): void {
    if (!itemId) return;
    this.cartFacade.updateQuantity(itemId, current + delta);
  }

  removeItem(itemId: string | undefined): void {
    if (!itemId) return;
    this.cartFacade.removeItem(itemId);
  }
}
