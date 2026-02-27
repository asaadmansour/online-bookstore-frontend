import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { DatePipe } from '@angular/common';

import { OrderResponse } from '../../shared/models/orderResponse';
//import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-admin-panel',
  imports: [DatePipe],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  private orderService = inject(OrderService);
  totalOrder = signal<number>(0);
  totalPayment = signal<number>(0);
  pendingOrders = signal<OrderResponse | null>(null);
  processingOrder = signal<OrderResponse | null>(null);
  deliveredOrder = signal<OrderResponse | null>(null);
  orders = signal<OrderResponse | null>(null);
  ngOnInit() {
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders.set(data);
    });
    this.orderService.getAllOrders(1, 'pending').subscribe((data) => {
      this.pendingOrders.set(data);
    });
    this.orderService.getAllOrders(1, 'processing').subscribe((data) => {
      this.processingOrder.set(data);
    });
    this.orderService.getAllOrders(1, 'delivered').subscribe((data) => {
      this.deliveredOrder.set(data);
    });
  }
}
