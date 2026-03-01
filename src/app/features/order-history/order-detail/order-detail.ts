
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, ProgressSpinnerModule],
  templateUrl: './order-detail.html',
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error = '';

  showCancelModal = false;
  cancelLoading = false;
  cancelError = '';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid order ID';
      this.loading = false;
      return;
    }
    this.loadOrder(id);
  }

  loadOrder(id: string): void {
    this.loading = true;
    this.error = '';

    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        this.order = res.order;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || err?.message || 'Failed to load order';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
      },
    });
  }

  openCancelModal(): void {
    this.showCancelModal = true;
    this.cancelError = '';
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  getStatusConfig(status: OrderStatus): {
    color: string;
    bgColor: string;
    icon: string;
  } {
    const config: Record<OrderStatus, { color: string; bgColor: string; icon: string }> = {
      processing: {
        color: 'text-blue-800',
        bgColor: 'bg-blue-100 border-blue-200',
        icon: '⚙️',
      },
      out_for_delivery: {
        color: 'text-purple-800',
        bgColor: 'bg-purple-100 border-purple-200',
        icon: '🚚',
      },
      delivered: {
        color: 'text-green-800',
        bgColor: 'bg-green-100 border-green-200',
        icon: '✅',
      },
    };
    return (
      config[status] || {
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: '📦',
      }
    );
  }

  get timelineSteps(): { label: string; done: boolean; active: boolean }[] {
    if (!this.order) return [];

    const statusOrder: OrderStatus[] = ['processing', 'out_for_delivery', 'delivered'];

    const currentIdx = statusOrder.indexOf(this.order.status);
    return statusOrder.map((s, i) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      done: i <= currentIdx,
      active: i === currentIdx,
    }));
  }

  get subtotal(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }

  get totalQuantity(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  trackByItemId(_index: number, item: any): string {
    return item._id;
  }
}
