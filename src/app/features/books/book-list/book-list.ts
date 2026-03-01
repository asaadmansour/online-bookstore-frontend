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
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-book-list',
  imports: [BookCard, LucideAngularModule, OverlayModule, ProgressSpinnerModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  readonly Filter = Filter;
  route = inject(ActivatedRoute);
  router = inject(Router);
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
  search = signal<string | null>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(0);
  loading = signal<boolean>(true);
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
      const page = params['page'] ? +params['page'] : 1;
      this.selectedCategoryId.set(category);
      this.selectedAuthorId.set(author);
      this.selectedSort.set(sort);
      this.minPrice.set(minPrice);
      this.maxPrice.set(maxPrice);
      this.search.set(search);
      this.currentPage.set(page);
      this.fetchBooks();
    });
  }
  fetchBooks() {
    this.loading.set(true);
    this.bookService
      .getBooks({
        categoryId: this.selectedCategoryId() ?? undefined,
        authorId: this.selectedAuthorId() ?? undefined,
        sort: this.selectedSort() ?? undefined,
        minPrice: this.minPrice() ?? undefined,
        maxPrice: this.maxPrice() ?? undefined,
        search: this.search() ?? undefined,
        page: this.currentPage(),
      })
      .subscribe((data) => {
        this.books.set(data.books);
        this.totalPages.set(data.totalPages);
        this.loading.set(false);
      });
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
        page: this.currentPage(),
      },
      queryParamsHandling: 'merge',
    });
  }
  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadBooks();
  }
  loadAuthors() {
    this.authorService.getAuthors().subscribe((data) => {
      this.authors.set(data.items);
    });
  }
  onSortChange(selected: string) {
    this.selectedSort.set(selected);
    this.currentPage.set(1);
    this.loadBooks();
  }
  selectCategory(id: string | null) {
    this.selectedCategoryId.set(id);
    this.currentPage.set(1);
    this.loadBooks();
  }

  selectAuthor(id: string | null) {
    this.selectedAuthorId.set(id);
    this.currentPage.set(1);
    this.loadBooks();
  }

  setPriceRange(min: number | null, max: number | null) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.currentPage.set(1);
    this.loadBooks();
  }

  resetFilters() {
    this.selectedCategoryId.set(null);
    this.selectedAuthorId.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.selectedSort.set(null);
    this.search.set(null);
    this.currentPage.set(1);
    this.loadBooks();
  }

  clearSearch() {
    this.search.set(null);
    this.currentPage.set(1);
    this.loadBooks();
  }
}
