import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { API_URL } from '../api.config';
import { Cart } from '../../shared/models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private API = inject(API_URL);
  private readonly testHeaders = new HttpHeaders({
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTljYjI4ZmQ5YmQ5NGY4ZTRjMTNkYzkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MjE5MjE2MSwiZXhwIjoxNzcyMTkzMDYxfQ.LlJ3h2iqCF6-_Jzj1_wSAT9COVTWy8eErGmovh9QeA4`,
  });

  addBook(payload: AddToCartPayload) {
    return this.http.post<CartResponse>(`${this.API}/cart`, payload, {
      headers: this.testHeaders,
    });
  }

  getCart() {
    return this.http.get<CartResponse>(`${this.API}/cart`, {
      headers: this.testHeaders,
    });
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
