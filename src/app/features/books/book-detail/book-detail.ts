import { Component, inject, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { CartFacade } from '../../../core/services/cart.facade';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../shared/models/book.model';

@Component({
  selector: 'app-book-detail',
  imports: [LucideAngularModule, ProgressSpinnerModule, NgOptimizedImage],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {
  readonly ShoppingCart = ShoppingCart;

  private readonly cartFacade = inject(CartFacade);
  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly book = signal<Book | null>(null);
  readonly quantity = signal<number>(1);
  readonly suggestedBooks = signal<Book[]>([]);
  readonly loadingSuggestions = signal<boolean>(false);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) return;

      this.book.set(null);
      this.suggestedBooks.set([]);
      this.quantity.set(1);

      this.bookService.getBookById(id).subscribe((data) => {
        this.book.set(data);
        this.loadSuggestedBooks(data.categories?.[0]?._id);
      });
    });
  }

  decreaseQuantity() {
    this.quantity.update((value) => Math.max(1, value - 1));
  }

  increaseQuantity() {
    this.quantity.update((value) => value + 1);
  }

  addCurrentBookToCart() {
    const currentBook = this.book();
    if (!currentBook) return;
    this.cartFacade.addItemWithValues(currentBook._id, this.quantity());
  }

  goToBook(id: string) {
    this.router.navigate(['/books', id]);
  }

  private loadSuggestedBooks(categoryId?: string, page = 1) {
    if (!categoryId) {
      this.suggestedBooks.set([]);
      this.loadingSuggestions.set(false);
      return;
    }
    this.loadingSuggestions.set(true);
    this.bookService.getBooks({ categoryId, page }).subscribe({
      next: (response) => {
        const currentId = this.book()?._id;
        const filtered = response.books.filter((item) => item._id !== currentId).slice(0, 8);
        this.suggestedBooks.set(filtered);
      },
      error: () => {
        this.suggestedBooks.set([]);
        this.loadingSuggestions.set(false);
      },
      complete: () => {
        this.loadingSuggestions.set(false);
      },
    });
  }
}
