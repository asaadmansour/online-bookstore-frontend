import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { BooksResponse } from '../../shared/models/booksResponse';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage-books.html',
  styleUrl: './manage-books.css',
})
export class ManageBooks implements OnInit {
  private bookService = inject(BookService);

  books = signal<BooksResponse | null>(null);
  totalPages = signal<number>(1);
  currentPage = signal<number>(1);

  showDeleteModal = signal<boolean>(false);
  bookToDelete = signal<string | null>(null);

  ngOnInit() {
    this.loadBooks(1);
  }

  loadBooks(page: number) {
    this.bookService.getBooks({ page }).subscribe({
      next: (data) => {
        this.books.set(data);
        this.currentPage.set(data.page);
        this.totalPages.set(data.totalPages);
      },
      error: (err) => console.error(err),
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadBooks(page);
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  confirmDelete(id: string) {
    this.bookToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.bookToDelete.set(null);
  }

  deleteBook() {
    const id = this.bookToDelete();
    if (!id) return;

    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.showDeleteModal.set(false);
        this.bookToDelete.set(null);

        // reload current page
        this.loadBooks(this.currentPage());
      },
      error: (err) => console.error(err),
    });
  }
}
