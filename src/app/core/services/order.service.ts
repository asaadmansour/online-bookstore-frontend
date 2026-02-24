// src/app/core/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    Order,
    OrderListResponse,
    OrderDetailResponse,
} from '../../shared/models/order.model';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private readonly api = `${environment.apiUrl}/orders`;
    constructor(private http: HttpClient) { }

    getMyOrders(
        page = 1,
        limit = 10,
        status?: string
    ): Observable<OrderListResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (status && status !== 'all') {
            params = params.set('status', status);
        }

        return this.http.get<OrderListResponse>(this.api, { params });
    }

    getOrderById(orderId: string): Observable<OrderDetailResponse> {
        return this.http.get<OrderDetailResponse>(`${this.api}/${orderId}`);
    }

    cancelOrder(orderId: string): Observable<{ message: string; order: Order }> {
        return this.http.put<{ message: string; order: Order }>(
            `${this.api}/${orderId}/cancel`,
            {}
        );
    }
}