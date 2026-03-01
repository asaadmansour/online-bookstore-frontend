import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../core/services/categories.service';
import { Category } from '../../../shared/models/category.model';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressSpinnerModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error = '';
  pendingDeleteId: string | null = null;
  pendingDeleteName = '';
  deleting = false;

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.categories = res.items ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load categories. Make sure the backend is running.';
        this.loading = false;
      }
    });
  }

  openDelete(cat: Category) {
    this.pendingDeleteId = cat._id;
    this.pendingDeleteName = cat.name;
  }

  cancelDelete() {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
  }

  confirmDelete() {
    if (!this.pendingDeleteId) return;
    this.deleting = true;
    this.categoriesService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c._id !== this.pendingDeleteId);
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.deleting = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted' });
      },
      error: () => {
        this.deleting = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
      }
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
