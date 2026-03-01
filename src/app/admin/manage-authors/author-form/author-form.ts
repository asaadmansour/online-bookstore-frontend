import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../../../core/services/authors.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressSpinnerModule],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css',
})
export class AuthorFormComponent implements OnInit {
  name = '';
  bio = '';
  authorImage = '';
  selectedFile: File | null = null;

  editId: string | null = null;
  loading = false;
  saving = false;
  error = '';

  get isEdit(): boolean {
    return !!this.editId;
  }
  get pageTitle(): string {
    return this.isEdit ? 'Edit Author' : 'New Author';
  }
  get submitLabel(): string {
    if (this.saving) return this.isEdit ? 'Saving…' : 'Creating…';
    return this.isEdit ? 'Save Changes' : 'Create Author';
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length ? input.files[0] : null;
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorsService: AuthorsService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.loading = true;
      this.authorsService.getById(id).subscribe({
        next: (author) => {
          this.name = author.name ?? '';
          this.bio = author.bio ?? '';
          this.authorImage = author.authorImage ?? '';
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load author data.';
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load author data' });
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
      this.error = 'Author Image is required.';
      return;
    }

    this.error = '';
    this.saving = true;

    const formData = new FormData();
    formData.append('name', this.name.trim());
    formData.append('bio', this.bio.trim());
    if (this.selectedFile) {
      formData.append('authorImage', this.selectedFile);
    }
    const req$ = this.isEdit
      ? this.authorsService.updateWithImage(this.editId!, formData)
      : this.authorsService.createWithImage(formData);

    req$.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Author saved successfully' });
        this.router.navigate(['/admin/authors']);
      },
      error: () => {
        this.error = 'Failed to save. Please try again.';
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save author' });
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/authors']);
  }
}
