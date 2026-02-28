import { Component, inject, signal, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { LucideAngularModule, Filter, ArrowUpDown } from 'lucide-angular';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../shared/models/book.model';
import { CategoriesService } from '../../../core/services/categories.service';
import { Category } from '../../../shared/models/category.model';
import { OverlayModule } from '@angular/cdk/overlay';
import { AuthorsService } from '../../../core/services/authors.service';
import { Author } from '../../../shared/models/author.model';

@Component({
  selector: 'app-book-list',
  imports: [BookCard, LucideAngularModule, OverlayModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  readonly Filter = Filter;
  readonly ArrowUpDown = ArrowUpDown;
  private bookService = inject(BookService);
  private categoryService = inject(CategoriesService);
  private authorService = inject(AuthorsService);
  sortOptions = [
    { label: 'Newest', value: '-createdAt' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Top Rated', value: '-averageRating' },
  ];
  books = signal<Book[]>([]);
  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string | null>(null);
  selectedAuthorId = signal<string | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  selectedSort = signal<string | null>(null);
  isFilterOpen = signal<boolean>(false);
  isSortOpen = signal<boolean>(false);

  ngOnInit() {
    this.loadBooks();
    this.loadAuthors();
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
        sort: this.selectedSort() ?? undefined,
      })
      .subscribe((data) => {
        this.books.set(data.books);
      });
  }
  loadAuthors() {
    this.authorService.getAuthors().subscribe((data) => {
      this.authors.set(data.items);
    });
  }
  onSortChange(selected: string) {
    this.selectedSort.set(selected);
    this.loadBooks();
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
    this.selectedSort.set(null);
    this.loadBooks();
  }
}
