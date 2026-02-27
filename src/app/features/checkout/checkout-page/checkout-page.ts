import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order, ShippingAddress } from '../../../shared/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { CartFacade } from '../../../core/services/cart.facade';

@Component({
  selector: 'app-checkout-page',
  imports: [FormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly cartFacade = inject(CartFacade);
  readonly cart = this.cartFacade.cart;
  readonly subtotal = computed(() => {
    const currentCart = this.cart();
    if (!currentCart) return 0;
    return currentCart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  });
  readonly orders = signal<Order[]>([]);
  shippingAddress: ShippingAddress = {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };
  test() {
    console.log(this.shippingAddress);
  }
  ngOnInit() {
    if (!this.cart()) {
      this.cartFacade.loadCart();
    }
  }
}
