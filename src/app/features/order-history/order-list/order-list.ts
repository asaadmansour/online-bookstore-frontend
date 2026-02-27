import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './order-list.html',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';

  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  limit = 10;

  selectedStatus = 'all';
  statuses: { value: string; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  private orderService = inject(OrderService);
  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getOrders(this.currentPage, this.limit, this.selectedStatus).subscribe({
      next: (res) => {
        this.orders = res.items;
        this.totalItems = res.total;
        this.totalPages = res.PagesNumber;
        this.loading = false;

        console.log('Orders loaded:', this.orders);
      },
      error: (err) => {
        this.loading = false;
        // 404 = no orders yet for this user, treat as empty list
        if (err?.status === 404) {
          this.orders = [];
          return;
        }
        this.error =
          err?.error?.message || err?.error?.error || 'Failed to load orders. Please try again.';
        console.error('Order load error:', err);
      },
    });
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);

    return pages;
  }

  getStatusConfig(status: OrderStatus): { color: string; icon: string } {
    const config: Record<OrderStatus, { color: string; icon: string }> = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '🕐',
      },
      processing: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '⚙️',
      },
      shipped: {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🚚',
      },
      delivered: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅',
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌',
      },
    };
    return config[status] || { color: 'bg-gray-100 text-gray-800', icon: '📦' };
  }

  getItemsSummary(order: Order): string {
    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return `${count} item${count !== 1 ? 's' : ''}`;
  }

  trackByOrderId(_index: number, order: Order): string {
    return order._id;
  }
}
