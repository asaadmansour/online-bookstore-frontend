import { inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Cart } from '../../shared/models/cart.model';
import { AddToCartPayload, CartResponse, CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);
  readonly cart = signal<Cart | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly selectedBookId = signal<string | null>(null);
  readonly selectedQuantity = signal<number>(1);

  loadCart(): void {
    this.loading.set(true);
    this.error.set('');
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cart.set(this.getCartFromResponse(response) ?? null);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err?.status === 404) {
          this.cart.set(null);
          return;
        }
        const msg = err?.error?.message || err?.error?.error || 'Could not load cart. Try again.';
        this.error.set(msg);
        this.messageService.add({ severity: 'error', summary: 'Cart error', detail: msg });
      },
    });
  }

  addItem(payload?: AddToCartPayload): void {
    const effectivePayload = payload ?? this.buildPayloadFromSelection();
    if (!effectivePayload) return;

    this.cartService.addBook(effectivePayload).subscribe({
      next: (response) => {
        const nextCart = this.getCartFromResponse(response);
        if (!nextCart) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Cart update',
            detail: response.message ?? 'The server did not return cart data.',
          });
          return;
        }
        this.cart.set(nextCart);
        const lastItemName = nextCart.items.at(-1)?.book.name ?? 'item';
        this.messageService.add({
          severity: 'success',
          summary: 'Added to cart',
          detail: `${lastItemName} updated`,
        });
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || 'Could not add item. Try again.';
        this.messageService.add({ severity: 'error', summary: 'Cart error', detail: msg });
      },
    });
  }

  updateQuantity(bookId: string, newQuantity: number): void {
    if (newQuantity < 1) return;
    this.cartService.updateQuantity(bookId, newQuantity).subscribe({
      next: () => {
        this.cart.update((c) => {
          if (!c) return c;
          return {
            ...c,
            items: c.items.map((i) =>
              i.book._id === bookId ? { ...i, quantity: newQuantity } : i,
            ),
          };
        });
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || 'Could not update quantity.';
        this.messageService.add({ severity: 'error', summary: 'Cart error', detail: msg });
      },
    });
  }

  removeItem(bookId: string): void {
    this.cartService.removeItem(bookId).subscribe({
      next: () => {
        // Backend returns { message, item } — remove locally
        this.cart.update((c) => {
          if (!c) return c;
          return { ...c, items: c.items.filter((i) => i.book._id !== bookId) };
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Removed',
          detail: 'Item removed from cart.',
        });
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || 'Could not remove item.';
        this.messageService.add({ severity: 'error', summary: 'Cart error', detail: msg });
      },
    });
  }

  addItemWithValues(bookId: string, quantity: number): void {
    if (!bookId || quantity <= 0) return;
    this.addItem({ book: bookId, quantity });
  }

  setSelectedBook(bookId: string): void {
    this.selectedBookId.set(bookId);
  }

  setQuantity(quantity: number): void {
    this.selectedQuantity.set(quantity);
  }

  private buildPayloadFromSelection(): AddToCartPayload | null {
    const bookId = this.selectedBookId();
    const quantity = this.selectedQuantity();
    if (!bookId || quantity <= 0) return null;
    return { book: bookId, quantity };
  }

  private getCartFromResponse(response: CartResponse): Cart | null {
    return response.userCart ?? response.cart ?? null;
  }
}
