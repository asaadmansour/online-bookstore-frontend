import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { DatePipe } from '@angular/common';

import { OrderResponse } from '../../shared/models/orderResponse';
import { UserService } from '../../core/services/user.service';
import { AuthorsService } from '../../core/services/authors.service';
import { AuthorResponse } from '../../shared/models/authorResponse';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../shared/models/category.model';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  imports: [DatePipe, ProgressSpinnerModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private authorService = inject(AuthorsService);
  private categoryService = inject(CategoriesService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  loading = signal<boolean>(true);
  currentUser = signal<User | null>(this.authService.currentUser);
  totalOrder = signal<number>(0);
  orders = signal<OrderResponse | null>(null);
  processingOrder = signal<OrderResponse | null>(null);
  deliveredOrder = signal<OrderResponse | null>(null);
  pendingOrders = signal<OrderResponse | null>(null);
  users = signal<any>(null);
  authors = signal<AuthorResponse | null>(null);
  categories = signal<any>(null);
  userCurrentPage = signal<number>(1);
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });

    this.loading.set(true);

    forkJoin({
      users: this.userService.getAllUsers(1),
      orders: this.orderService.getAllOrders(),
      processing: this.orderService.getAllOrders(1, 'processing'),
      delivered: this.orderService.getAllOrders(1, 'delivered'),
      authors: this.authorService.getAuthors(),
      categories: this.categoryService.getAll(),
    }).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (results) => {
        this.users.set(results.users);
        this.userCurrentPage.set(1);
        this.orders.set(results.orders);
        this.processingOrder.set(results.processing);
        this.deliveredOrder.set(results.delivered);
        this.authors.set(results.authors);
        this.categories.set(results.categories);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard data',
        });
      },
    });
  }

  loadUsers(page = 1) {
    this.loading.set(true);
    this.userService.getAllUsers(page).subscribe({
      next: (data) => {
        this.users.set(data);
        this.userCurrentPage.set(page);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
        });
      }
    });
  }

  loadOrders(page = 1) {
    this.loading.set(true);
    this.orderService.getAllOrders(page).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load orders',
        });
      }
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
