import { Component, inject, signal, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { LucideAngularModule, Filter, ArrowUpDown } from 'lucide-angular';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../shared/models/book.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category.model';
@Component({
  selector: 'app-book-list',
  imports: [BookCard, LucideAngularModule, ProgressSpinner, Navbar],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  readonly Filter = Filter;
  readonly ArrowUpDown = ArrowUpDown;
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);

  books = signal<Book[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string | null>(null);
  selectedAuthorId = signal<string | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  ngOnInit() {
    this.loadBooks();
    this.categoryService.getCategories().subscribe((data) => {
      this.categories.set(data.items);
    });
  }
  loadBooks() {
    this.bookService
      .getBooks({
        categoryId: this.selectedCategoryId() ?? undefined,
        authorId: this.selectedAuthorId() ?? undefined,
        minPrice: this.minPrice() ?? undefined,
        maxPrice: this.maxPrice() ?? undefined,
      })
      .subscribe((data) => {
        this.books.set(data.books);
      });
  }

  selectCategory(id: string | null) {
    this.selectedCategoryId.set(id);
    this.loadBooks();
  }

  selectAuthor(id: string | null) {
    this.selectedAuthorId.set(id);
    this.loadBooks();
  }

  setPriceRange(min: number | null, max: number | null) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.loadBooks();
  }

  resetFilters() {
    this.selectedCategoryId.set(null);
    this.selectedAuthorId.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.loadBooks();
  }
}
