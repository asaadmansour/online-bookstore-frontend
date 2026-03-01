import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../core/services/categories.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressSpinnerModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryFormComponent implements OnInit {
  name = '';
  description = '';
  categoryImage = '';
  selectedFile: File | null = null;
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length ? input.files[0] : null;
  }
  editId: string | null = null;
  loading = false;
  saving = false;
  error = '';

  get isEdit(): boolean {
    return !!this.editId;
  }
  get pageTitle(): string {
    return this.isEdit ? 'Edit Category' : 'New Category';
  }
  get submitLabel(): string {
    if (this.saving) return this.isEdit ? 'Saving…' : 'Creating…';
    return this.isEdit ? 'Save Changes' : 'Create Category';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.loading = true;
      this.categoriesService.getById(id).subscribe({
        next: (cat) => {
          this.name = cat.name ?? '';
          this.description = cat.description ?? '';
          this.categoryImage = cat.categoryImage ?? '';
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load category data.';
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load category data' });
        },
      });
    }
  }

  save() {
    if (!this.name.trim()) {
      this.error = 'Name is required.';
      return;
    }
    if (!this.isEdit && !this.selectedFile) {
      this.error = 'Image is required.';
      return;
    }
    this.error = '';
    this.saving = true;
    const formData = new FormData();
    formData.append('name', this.name.trim());
    formData.append('description', this.description.trim());
    if (this.selectedFile) {
      formData.append('categoryImage', this.selectedFile);
    }

    const req$ = this.isEdit
      ? this.categoriesService.updateWithImage(this.editId!, formData)
      : this.categoriesService.createWithImage(formData);

    req$.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category saved successfully' });
        this.router.navigate(['/admin/categories']);
      },
      error: () => {
        this.error = 'Failed to save. Please try again.';
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save category' });
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
