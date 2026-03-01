import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderResponse } from '../../shared/models/orderResponse';
import { OrderService } from '../../core/services/order.service';
import { DatePipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-manage-orders',
  imports: [DatePipe, ProgressSpinnerModule],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrders implements OnInit {
  private orderService = inject(OrderService);
  private messageService = inject(MessageService);

  loading = signal<boolean>(true);
  orders = signal<OrderResponse | null>(null);
  processingOrders = signal<OrderResponse | null>(null);
  outForDeliveryOrders = signal<OrderResponse | null>(null);
  deliveredOrders = signal<OrderResponse | null>(null);
  currentPage = signal<number>(1);
  selectedStatus = signal<string>('');
  searchedId = signal<string | null>(null);

  ngOnInit() {
    this.loading.set(true);
    forkJoin({
      all: this.orderService.getAllOrders(),
      processing: this.orderService.getAllOrders(1, 'processing'),
      delivery: this.orderService.getAllOrders(1, 'out_for_delivery'),
      delivered: this.orderService.getAllOrders(1, 'delivered'),
    }).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (res) => {
        this.orders.set(res.all);
        this.processingOrders.set(res.processing);
        this.outForDeliveryOrders.set(res.delivery);
        this.deliveredOrders.set(res.delivered);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load initial orders' });
      }
    });
  }
  setSearchId(event: Event) {
    const input = event.target as HTMLInputElement;
    const id = input.value.trim();
    if (!id) {
      this.loadOrders();
      return;
    }
    this.searchedId.set(id);
    this.loading.set(true);
    this.orderService.getOrderById(id).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {
        this.orders.set({
          total: 1,
          pages: 1,
          orders: [data.order],
        });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order not found' });
      }
    });
  }
  filterByStatus(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value);
    this.loadOrders(1, select.value || undefined);
  }
  loadOrders(page = 1, status?: string) {
    this.loading.set(true);
    this.orderService.getAllOrders(page, status).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load orders' });
      }
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
    this.orderService.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order status updated' });
        this.loadOrders(this.currentPage(), this.selectedStatus() || undefined);
        this.refreshStats();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
      }
    });
  }

  updatePayment(id: string, payment: string) {
    this.orderService.updatePaymentStatus(id, payment).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payment status updated' });
        this.loadOrders(this.currentPage(), this.selectedStatus() || undefined);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update payment' });
      }
    });
  }

  private refreshStats() {
    this.orderService.getAllOrders(1, 'processing').subscribe(data => this.processingOrders.set(data));
    this.orderService.getAllOrders(1, 'out_for_delivery').subscribe(data => this.outForDeliveryOrders.set(data));
    this.orderService.getAllOrders(1, 'delivered').subscribe(data => this.deliveredOrders.set(data));
  }
}
