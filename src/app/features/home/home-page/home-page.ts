import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {OrderService} from '../../../core/services/order.service';
import {HomeImage} from '../home-image/home-image';

@Component({
  selector: 'app-home-page',
  imports: [RouterOutlet, HomeImage],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private orderService = inject(OrderService);

  getUserOrders() {
    this.orderService.getAllOrders().subscribe((res) => {
      console.log(res);
    });
  }
}
