import { inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Cart } from '../../shared/models/cart.model';
import { AddToCartPayload, CartResponse, CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);
  readonly cart = signal<Cart | null>(null);
  readonly selectedBookId = signal<string | null>(null);
  readonly selectedQuantity = signal<number>(1);

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response) => {
        const nextCart = this.getCartFromResponse(response);
        if (!nextCart) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Cart empty',
            detail: 'No cart data available yet.',
          });
          return;
        }
        this.cart.set(nextCart);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cart error',
          detail: error?.error?.message ?? 'Could not load cart. Try again.',
        });
      },
    });
  }

  addItem(payload?: AddToCartPayload) {
    const effectivePayload = payload ?? this.buildPayloadFromSelection();
    if (!effectivePayload) {
      return;
    }

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
        const lastItemName = nextCart.items.at(-1)?.book.name ?? 'Cart';
        this.messageService.add({
          severity: 'success',
          summary: 'Added to cart',
          detail: `${lastItemName} updated`,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cart error',
          detail: error?.error?.message ?? 'Could not add item. Try again.',
        });
      },
    });
  }

  addItemWithValues(bookId: string, quantity: number) {
    if (!bookId || quantity <= 0) {
      return;
    }
    this.addItem({ book: bookId, quantity });
  }

  setSelectedBook(bookId: string) {
    this.selectedBookId.set(bookId);
  }

  setQuantity(quantity: number) {
    this.selectedQuantity.set(quantity);
  }

  private buildPayloadFromSelection(): AddToCartPayload | null {
    const bookId = this.selectedBookId();
    const quantity = this.selectedQuantity();

    if (!bookId || quantity <= 0) {
      return null;
    }

    return { book: bookId, quantity };
  }

  private getCartFromResponse(response: CartResponse): Cart | null {
    return response.userCart ?? response.cart ?? null;
  }
}
