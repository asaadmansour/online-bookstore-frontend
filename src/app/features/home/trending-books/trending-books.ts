import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../shared/models/book.model';
import { BookCard } from '../../books/book-card/book-card';
import { RouterLink } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-trending-books',
  templateUrl: './trending-books.html',
  standalone: true,
  imports: [ButtonModule, CarouselModule, TagModule, BookCard, RouterLink, ProgressSpinnerModule],
})
export class TrendingBooks implements OnInit {
  private bookService = inject(BookService);

  products = signal<Book[]>([]);
  loading = signal<boolean>(true);
  responsiveOptions: any[] | undefined;

  ngOnInit() {
    this.loading.set(true);
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.products.set(data.books.slice(0, 9));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });

    this.responsiveOptions = [
      {
        breakpoint: '1920px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '1200px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '576px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  getSeverity(stock: number) {
    if (stock > 10) {
      return 'success';
    } else if (stock > 0) {
      return 'warn';
    } else {
      return 'danger';
    }
  }
}
