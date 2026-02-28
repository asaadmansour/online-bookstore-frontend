import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { OrderResponse } from '../../shared/models/orderResponse';
import { UserService } from '../../core/services/user.service';
import { AuthorService } from '../../core/services/author.service';
import { AuthorResponse } from '../../shared/models/authorResponse';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../shared/models/category.model';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';
//import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-admin-panel',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private authorService = inject(AuthorService);
  private categoryService = inject(CategoriesService);
  private authService = inject(AuthService);
  currentUser = signal<User | null>(this.authService.currentUser);
  totalOrder = signal<number>(0);
  orders = signal<OrderResponse | null>(null);
  users = signal<any>(null);
  authors = signal<AuthorResponse | null>(null);
  categories = signal<Category[] | null>(null);
  userCurrentPage = signal<number>(1);
  ngOnInit() {
    this.loadUsers();
    console.log(this.authService.currentUser?._id);
    this.authService.currentUser$.subscribe((user) => {
      console.log(user);
      this.currentUser.set(user);
    });
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders.set(data);
    });
    this.authorService.getAuthors().subscribe((data) => {
      this.authors.set(data);
    });
    this.categoryService.getAll().subscribe((data) => {
      this.categories.set(data.items);
    });
  }

  loadUsers(page = 1) {
    this.userService.getAllUsers(page).subscribe((data) => {
      this.users.set(data);
      this.userCurrentPage.set(page);
    });
  }

  loadOrders(page = 1) {
    this.orderService.getAllOrders(page).subscribe((data) => {
      this.orders.set(data);
    });
  }

  getUserPages() {
    return Array.from({ length: this.users()?.pagination?.totalPages ?? 1 }, (_, i) => i + 1);
  }

  changeUserPage(page: number) {
    if (page < 1 || page > (this.users()?.pagination?.totalPages ?? 1)) return;
    this.loadUsers(page);
  }

  getPages() {
    return Array.from({ length: this.orders()?.pages ?? 1 }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > (this.orders()?.pages ?? 1)) return;
    this.loadOrders(page);
  }
}
