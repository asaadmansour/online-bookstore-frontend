import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './categories-page.html',
})
export class CategoriesPageComponent implements OnInit {
  categories: Category[] = [];

  // pagination
  page = 1;
  limit = 10;
  totalPages = 0;

  // UI state
  loading = true;
  error = '';

  constructor(private categoriesService: CategoriesService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.categoriesService.getAll(this.page, this.limit).subscribe({
      next: (res) => {
        this.categories = res.items;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Failed to load categories';
      },
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadCategories();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCategories();
    }
  }

  refresh(): void {
    this.loadCategories();
  }

  trackById(index: number, item: Category): string {
 return item._id;
  }

goToCategory(categoryId: number | string): void {
  this.router.navigate(['/books'], {
    queryParams: { category: categoryId }
  });
}
}