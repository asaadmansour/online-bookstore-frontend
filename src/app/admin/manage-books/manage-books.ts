import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { BooksResponse } from '../../shared/models/booksResponse';

@Component({
  selector: 'app-manage-books',
  imports: [],
  templateUrl: './manage-books.html',
  styleUrl: './manage-books.css',
})
export class ManageBooks implements OnInit {
  private bookService = inject(BookService);
  books = signal<BooksResponse | null>(null);
  totalPages = signal<number>(1);
  currentPage = signal<number>(1);
  ngOnInit() {
    this.bookService.getBooks().subscribe((data) => {
      this.books.set(data);
      this.currentPage.set(data.page);
      this.totalPages.set(data.totalPages);
    });
  }
}
