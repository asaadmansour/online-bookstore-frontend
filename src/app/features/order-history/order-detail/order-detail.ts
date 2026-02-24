// src/app/features/order-history/order-detail/order-detail.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../shared/models/order.model';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe],
    templateUrl: './order-detail.html',
})
export class OrderDetailComponent implements OnInit {
    order: Order | null = null;
    loading = true;
    error = '';

    showCancelModal = false;
    cancelLoading = false;
    cancelError = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService
    ) { }

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
                console.log('Order detail:', this.order);
            },
            error: (err) => {
                this.loading = false;
                this.error =
                    err?.error?.error || err?.message || 'Failed to load order';
            },
        });
    }

    get canCancel(): boolean {
        return this.order?.status === 'pending';
    }

    openCancelModal(): void {
        this.showCancelModal = true;
        this.cancelError = '';
    }

    closeCancelModal(): void {
        this.showCancelModal = false;
    }

    confirmCancel(): void {
        if (!this.order) return;
        this.cancelLoading = true;
        this.cancelError = '';

        this.orderService.cancelOrder(this.order._id).subscribe({
            next: (res) => {
                this.cancelLoading = false;
                this.showCancelModal = false;
                this.order = res.order;
            },
            error: (err) => {
                this.cancelLoading = false;
                this.cancelError =
                    err?.error?.error || err?.message || 'Failed to cancel';
            },
        });
    }

    getStatusConfig(status: OrderStatus): {
        color: string;
        bgColor: string;
        icon: string;
    } {
        const config: Record<
            OrderStatus,
            { color: string; bgColor: string; icon: string }
        > = {
            pending: {
                color: 'text-yellow-800',
                bgColor: 'bg-yellow-100 border-yellow-200',
                icon: '🕐',
            },
            processing: {
                color: 'text-blue-800',
                bgColor: 'bg-blue-100 border-blue-200',
                icon: '⚙️',
            },
            shipped: {
                color: 'text-purple-800',
                bgColor: 'bg-purple-100 border-purple-200',
                icon: '🚚',
            },
            delivered: {
                color: 'text-green-800',
                bgColor: 'bg-green-100 border-green-200',
                icon: '✅',
            },
            cancelled: {
                color: 'text-red-800',
                bgColor: 'bg-red-100 border-red-200',
                icon: '❌',
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

        const statusOrder: OrderStatus[] = [
            'pending',
            'processing',
            'shipped',
            'delivered',
        ];

        if (this.order.status === 'cancelled') {
            return [
                { label: 'Placed', done: true, active: false },
                { label: 'Cancelled', done: true, active: true },
            ];
        }

        const currentIdx = statusOrder.indexOf(this.order.status);
        return statusOrder.map((s, i) => ({
            label: s.charAt(0).toUpperCase() + s.slice(1),
            done: i <= currentIdx,
            active: i === currentIdx,
        }));
    }

    get subtotal(): number {
        if (!this.order) return 0;
        return this.order.items.reduce(
            (sum, item) => sum + item.unit_price * item.quantity,
            0
        );
    }

    get totalQuantity(): number {
        if (!this.order) return 0;
        return this.order.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    trackByItemId(_index: number, item: any): string {
        return item._id;
    }
}