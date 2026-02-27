import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Address } from '../../shared/models/address.model';
import { Order } from '../../shared/models/order.model';
import { OrderResponse } from '../../shared/models/orderResponse';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _httpClient = inject(HttpClient);
  private base_url = 'http://127.0.0.1:5000/orders';

  // get user all orders
  getOrders(page = 1): Observable<OrderResponse> {
    const params = new HttpParams().set('page', page.toString());
    return this._httpClient.get<OrderResponse>(`${this.base_url}`, { params });
  }

  // create order
  createOrder(shippingAddress: Address, paymentMethod: string): Observable<Order> {
    const body = {
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    };
    return this._httpClient.post<Order>(`${this.base_url}`, body);
  }

  // get all order admin
  getAllOrders(page = 1, status?: string, user?: string) {
    let params = new HttpParams().set('page', page.toString());
    if (status) params = params.append('status', status);
    if (user) params = params.append('user', user);
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTlhMjgxNThlYTgyY2YxZDQzYmFjZTAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzIxODQ2MjcsImV4cCI6MTc3MjE4NTUyN30.dYccUMfrbsleETh9mg6j_mitbGQAEwxoo2suUqmMVzw`,
    };
    return this._httpClient.get<OrderResponse>(`${this.base_url}/admin/all`, { params, headers });
  }

  // get specific order
  getSpecificOrder(id: string): Observable<Order> {
    return this._httpClient.get<Order>(`${this.base_url}/${id}`);
  }

  // update order status
  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this._httpClient.patch<Order>(`${this.base_url}/${id}/status`, { status });
  }

  // update order payment
  updatePaymentStatus(id: string, payment: string): Observable<Order> {
    return this._httpClient.patch<Order>(`${this.base_url}/${id}/payment`, { payment });
  }
}
