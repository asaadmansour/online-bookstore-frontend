import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { API_URL } from '../api.config';
import { Cart } from '../../shared/models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private API = inject(API_URL);

  addBook(payload: AddToCartPayload) {
    return this.http.post<CartResponse>(`${this.API}/cart`, payload);
  }

  getCart() {
    return this.http.get<CartResponse>(`${this.API}/cart`);
  }

  updateQuantity(bookId: string, quantity: number) {
    return this.http.patch<{ message: string; item: any }>(`${this.API}/cart/${bookId}`, {
      quantity,
    });
  }

  removeItem(bookId: string) {
    return this.http.delete<{ message: string; item: any }>(`${this.API}/cart/${bookId}`);
  }
}

export interface AddToCartPayload {
  book: string;
  quantity: number;
}

export interface CartResponse {
  message?: string;
  cart?: Cart;
  userCart?: Cart; // keep for backward compatibility
}
