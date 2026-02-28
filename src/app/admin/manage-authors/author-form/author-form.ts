import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../../../core/services/authors.service';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css',
})
export class AuthorFormComponent implements OnInit {
  // Form fields
  name = '';
  bio = '';
  photo = '';

  // State
  editId: string | null = null;
  loading = false;   // loading existing author for edit
  saving = false;
  error = '';

  get isEdit(): boolean { return !!this.editId; }
  get pageTitle(): string { return this.isEdit ? 'Edit Author' : 'New Author'; }
  get submitLabel(): string {
    if (this.saving) return this.isEdit ? 'Saving…' : 'Creating…';
    return this.isEdit ? 'Save Changes' : 'Create Author';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorsService: AuthorsService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.loading = true;
      this.authorsService.getById(id).subscribe({
        next: (author) => {
          this.name = author.name ?? '';
          this.bio = author.bio ?? '';
          this.photo = author.photo ?? author.imageUrl ?? '';
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load author data.';
          this.loading = false;
        }
      });
    }
  }

  save() {
    if (!this.name.trim()) { this.error = 'Name is required.'; return; }
    this.error = '';
    this.saving = true;
    const payload = { name: this.name.trim(), bio: this.bio.trim(), photo: this.photo.trim() };

    const req$ = this.isEdit
      ? this.authorsService.update(this.editId!, payload)
      : this.authorsService.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/admin/authors']),
      error: () => {
        this.error = 'Failed to save. Please try again.';
        this.saving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/authors']);
  }
}