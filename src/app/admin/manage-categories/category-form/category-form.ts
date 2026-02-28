import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../core/services/categories.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryFormComponent implements OnInit {
  // Form fields
  name = '';
  description = '';

  // State
  editId: string | null = null;
  loading = false;
  saving = false;
  error = '';

  get isEdit(): boolean { return !!this.editId; }
  get pageTitle(): string { return this.isEdit ? 'Edit Category' : 'New Category'; }
  get submitLabel(): string {
    if (this.saving) return this.isEdit ? 'Saving…' : 'Creating…';
    return this.isEdit ? 'Save Changes' : 'Create Category';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.loading = true;
      this.categoriesService.getById(id).subscribe({
        next: (cat) => {
          this.name = cat.name ?? '';
          this.description = cat.description ?? '';
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load category data.';
          this.loading = false;
        }
      });
    }
  }

  save() {
    if (!this.name.trim()) { this.error = 'Name is required.'; return; }
    this.error = '';
    this.saving = true;
    const payload = { name: this.name.trim(), description: this.description.trim() };

    const req$ = this.isEdit
      ? this.categoriesService.update(this.editId!, payload)
      : this.categoriesService.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/admin/categories']),
      error: () => {
        this.error = 'Failed to save. Please try again.';
        this.saving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
