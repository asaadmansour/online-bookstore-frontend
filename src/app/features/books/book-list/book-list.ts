import { Component, inject, signal, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { LucideAngularModule, Filter, ArrowUpDown } from 'lucide-angular';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../shared/models/book.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category.model';
import { OverlayModule } from '@angular/cdk/overlay';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../shared/models/author.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  imports: [BookCard, LucideAngularModule, OverlayModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  readonly Filter = Filter;
  route = inject(ActivatedRoute);
  router = inject(Router);
  readonly ArrowUpDown = ArrowUpDown;
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private authorService = inject(AuthorService);
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
  search = signal<string | null>('');

  ngOnInit() {
    this.loadAuthors();
    this.categoryService.getCategories().subscribe((data) => {
      this.categories.set(data.items);
    });
    this.route.queryParams.subscribe((params) => {
      const category = params['category'] || null;
      const author = params['author'] ?? null;
      const sort = params['sort'] ?? null;
      const minPrice = params['minPrice'] ? +params['minPrice'] : null;
      const maxPrice = params['maxPrice'] ? +params['maxPrice'] : null;
      const search = params['search'] ?? null;
      this.selectedCategoryId.set(category);
      this.selectedAuthorId.set(author);
      this.selectedSort.set(sort);
      this.minPrice.set(minPrice);
      this.maxPrice.set(maxPrice);
      this.search.set(search);
      this.fetchBooks();
    });
  }
  fetchBooks() {
    this.bookService
      .getBooks({
        categoryId: this.selectedCategoryId() ?? undefined,
        authorId: this.selectedAuthorId() ?? undefined,
        sort: this.selectedSort() ?? undefined,
        minPrice: this.minPrice() ?? undefined,
        maxPrice: this.maxPrice() ?? undefined,
        search: this.search() ?? undefined,
      })
      .subscribe((data) => this.books.set(data.books));
  }

  loadBooks() {
    this.router.navigate(['books'], {
      queryParams: {
        category: this.selectedCategoryId(),
        sort: this.selectedSort(),
        author: this.selectedAuthorId(),
        minPrice: this.minPrice(),
        maxPrice: this.maxPrice(),
        search: this.search() || null,
      },
      queryParamsHandling: 'merge',
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
    this.search.set(null);
    this.loadBooks();
  }

  clearSearch() {
    this.search.set(null);
    this.loadBooks();
  }
}
