import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Order, PaymentMethod, ShippingAddress } from '../../shared/models/order.model';
import { API_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _httpClient = inject(HttpClient);
  private API = inject(API_URL);

  // get user all orders
  getOrders(page = 1): Observable<Order[]> {
    const params = new HttpParams().set('page', page.toString());
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTljYjI4ZmQ5YmQ5NGY4ZTRjMTNkYzkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MjE5MDA2MywiZXhwIjoxNzcyMTkwOTYzfQ.OLpPGu5Qb9taYf4UXZExv6zFA2v1Cs3lBl9IakwGE4s`,
    };
    return this._httpClient.get<Order[]>(`${this.API}/orders`, { params, headers });
  }

  // create order
  createOrder(shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Observable<Order> {
    const body = {
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    };
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTljYjI4ZmQ5YmQ5NGY4ZTRjMTNkYzkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MjEzOTAzMCwiZXhwIjoxNzcyMTM5OTMwfQ.PJ2-AfU5M5nosIC6TDyXzV61mewmGa3LLgPBXZMhkvA`,
    };
    return this._httpClient.post<Order>(this.API, body, { headers: headers });
  }

  // get all order admin
  // getAllOrders(page = 1, status?: string, user?: string): Observable<Order[]> {
  //   let params = new HttpParams().set('page', page.toString());
  //   if (status) params = params.append('status', status);
  //   if (user) params = params.append('user', user);

  //   return this._httpClient.get<Order[]>(`${this.API}/admin/all`, {
  //     params,
  //     headers,
  //   });
  // }

  // get specific order
  getSpecificOrder(id: string): Observable<Order> {
    return this._httpClient.get<Order>(`${this.API}/${id}`);
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
