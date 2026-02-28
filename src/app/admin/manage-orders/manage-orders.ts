import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { OrderResponse } from '../../shared/models/orderResponse';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-orders',
  imports: [DatePipe],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrders implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<OrderResponse | null>(null);
  processingOrders = signal<OrderResponse | null>(null);
  outForDeliveryOrders = signal<OrderResponse | null>(null);
  deliveredOrders = signal<OrderResponse | null>(null);
  currentPage = signal<number>(1);
  selectedStatus = signal<string>('');
  searchedId = signal<string | null>(null);
  ngOnInit() {
    this.loadOrders();
    this.loadProccessingOrders();
    this.loadOutForDeliveryOrders();
    this.loadDeliveredOrders();
  }
  setSearchId(event: Event) {
    const input = event.target as HTMLInputElement;
    const id = input.value.trim();
    if (!id) {
      this.loadOrders(); // reset if empty
      return;
    }
    this.searchedId.set(id);
    this.orderService.getOrderById(id).subscribe(
      (data) => {
        this.orders.set({
          total: 1,
          pages: 1,
          orders: [data.order],
        });
      },
      (error) => {
        console.error('Order not found:', error);
      },
    );
  }
  filterByStatus(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value);
    this.loadOrders(1, select.value || undefined);
  }
  loadOrders(page = 1, status?: string) {
    this.orderService.getAllOrders(page, status).subscribe((data) => {
      this.orders.set(data);
      this.currentPage.set(page);
    });
  }

  loadProccessingOrders(page = 1) {
    this.orderService.getAllOrders(page, 'processing').subscribe((data) => {
      this.processingOrders.set(data);
    });
  }
  loadOutForDeliveryOrders(page = 1) {
    this.orderService.getAllOrders(page, 'out_for_delivery').subscribe((data) => {
      this.outForDeliveryOrders.set(data);
    });
  }

  loadDeliveredOrders(page = 1) {
    this.orderService.getAllOrders(page, 'delivered').subscribe((data) => {
      this.deliveredOrders.set(data);
    });
  }

  getPages() {
    return Array.from({ length: this.orders()?.pages ?? 1 }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > (this.orders()?.pages ?? 1)) return;
    this.loadOrders(page, this.selectedStatus() || undefined);
  }

  updateStatus(id: string, status: string) {
    this.orderService.updateOrderStatus(id, status).subscribe(() => {
      this.loadOrders(this.currentPage(), this.selectedStatus() || undefined);
    });
  }

  updatePayment(id: string, payment: string) {
    this.orderService.updatePaymentStatus(id, payment).subscribe(() => {
      this.loadOrders(this.currentPage(), this.selectedStatus() || undefined);
    });
  }
}
