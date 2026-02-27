// src/app/core/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Order, OrderListResponse, OrderDetailResponse } from '../../shared/models/order.model';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PaymentMethod, ShippingAddress } from '../../shared/models/order.model';
import { API_URL } from '../api.config';
import { OrderResponse } from '../../shared/models/orderResponse';
@Injectable({ providedIn: 'root' })
export class OrderService {
  private API = inject(API_URL);
  private http = inject(HttpClient);
  private _httpClient = inject(HttpClient);
  getOrders(page = 1, limit = 10, status?: string): Observable<OrderListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<OrderListResponse>(this.API, { params });
  }

  getOrderById(orderId: string): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(`${this.API}/${orderId}`);
  }

  createOrder(shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Observable<Order> {
    const body = {
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    };
    return this._httpClient.post<Order>(this.API, body);
  }
  getAllOrders(page = 1, status?: string, user?: string) {
    let params = new HttpParams().set('page', page.toString());
    if (status) params = params.append('status', status);
    if (user) params = params.append('user', user);

    return this._httpClient.get<OrderResponse>(`${this.API}/orders/admin/all`, {
      params,
    });
  }
  // update order status
  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this._httpClient.patch<Order>(`${this.API}/${id}/status`, {
      status,
    });
  }

  // update order payment
  updatePaymentStatus(id: string, payment: string): Observable<Order> {
    return this._httpClient.patch<Order>(`${this.API}/${id}/payment`, {
      payment,
    });
  }
}
