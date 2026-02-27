import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../core/services/categories.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPageComponent implements OnInit {
  categories: Category[] = [];

  // Pagination state
  page = 1;
  limit = 10;

  loading = true;
  error = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.categoriesService.getAll(this.page, this.limit).subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Failed to load categories';
      },
    });
  }

 // Pagination controls
  nextPage(): void {
    this.page++;
    this.loadCategories();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCategories();
    }
  }

// Refresh the list (e.g. after creating/updating/deleting a category)
  refresh(): void {
    this.loadCategories();
  }
}