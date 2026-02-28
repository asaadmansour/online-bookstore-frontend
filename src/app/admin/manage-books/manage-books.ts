import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { BooksResponse } from '../../shared/models/booksResponse';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-books',
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
    this.bookService.getBooks().subscribe((data) => {
      this.books.set(data);
      this.currentPage.set(data.page);
      this.totalPages.set(data.totalPages);
    });
  }

  deleteBook() {
    const id = this.bookToDelete();
    if (!id) return;
    console.log('Deleting book with ID:', id);
    this.bookService.deleteBook(id).subscribe(
      (data) => {
        console.log('Book deleted successfully:', data);
        // Close modal and reset
        this.showDeleteModal.set(false);
        this.bookToDelete.set(null);
        // Remove deleted book from the signal directly
        const currentBooks = this.books();
        if (currentBooks) {
          this.books.set({
            ...currentBooks,
            books: currentBooks.books.filter((book) => book._id !== id),
            total: currentBooks.total - 1,
          });
        }
      },
      (error) => {
        console.error('Error deleting book:', error);
      },
    );
  }

  confirmDelete(id: string) {
    this.bookToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.bookToDelete.set(null);
  }
}
