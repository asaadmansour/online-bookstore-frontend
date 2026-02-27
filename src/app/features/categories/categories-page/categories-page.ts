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
  loading = true;
  error = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories() {
    this.loading = true;
    this.error = '';

    this.categoriesService.getAll(1, 50).subscribe({
      next: (res) => {
        this.categories = res.items ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load categories';
        this.loading = false;
      },
    });
  }

  trackById(_: number, item: Category) {
    return item._id;
  }
}