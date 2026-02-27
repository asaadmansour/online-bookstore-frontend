import { Component, inject } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { HomeImage } from '../home-image/home-image';
import { TrendingBooks } from '../trending-books/trending-books';
import { HomeCategories } from '../home-categories/home-categories';
import { PopularAuthors } from '../popular-authors/popular-authors';

@Component({
  selector: 'app-home-page',
  imports: [HomeImage, TrendingBooks, HomeCategories, PopularAuthors],
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
