import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShippingAddress, PaymentMethod } from '../../../shared/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { CartFacade } from '../../../core/services/cart.facade';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-checkout-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  readonly cartFacade = inject(CartFacade);
  readonly cart = this.cartFacade.cart;

  readonly subtotal = computed(() => {
    const currentCart = this.cart();
    if (!currentCart) return 0;
    return currentCart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  });

  shippingAddress: ShippingAddress = {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };

  paymentMethod: PaymentMethod = 'COD';
  placing = signal(false);
  orderError = signal('');

  ngOnInit() {
    if (!this.cart()) {
      this.cartFacade.loadCart();
    }
  }

  placeOrder(): void {
    const addr = this.shippingAddress;
    if (!addr.street || !addr.city || !addr.state || !addr.zip || !addr.country) {
      this.orderError.set('Please fill in all shipping fields before placing your order.');
      return;
    }

    this.placing.set(true);
    this.orderError.set('');

    this.orderService.createOrder(this.shippingAddress, this.paymentMethod).subscribe({
      next: () => {
        this.placing.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Order placed!',
          detail: 'Payment successful. Thank you for your order!',
          life: 4000,
        });
        this.cartFacade.clearCart();
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        this.placing.set(false);
        this.orderError.set(
          err?.error?.message || err?.error?.error || 'Failed to place order. Please try again.'
        );
      },
    });
  }
}

