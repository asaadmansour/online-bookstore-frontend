import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { AuthorsService } from '../../core/services/authors.service';
import { Author } from '../../shared/models/author.model';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../shared/models/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, RouterModule, ProgressSpinnerModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);
  newBook: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
    author: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    categories: [[] as string[], Validators.required],
  });
  private bookService = inject(BookService);
  private authorService = inject(AuthorsService);
  private categoryService = inject(CategoriesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  bookId = signal<string | null>(null);
  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  selectCategories(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValues = Array.from(select.selectedOptions).map((opt) => opt.value);
    this.newBook.get('categories')?.setValue(selectedValues);
  }
  getSelectedCategoryNames(): string {
    const selectedIds = this.newBook.get('categories')?.value || [];
    return this.categories()
      .filter((cat) => selectedIds.includes(cat._id))
      .map((cat) => cat.name)
      .join(', ');
  }
  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile.set(input.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  clearCover() {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  ngOnInit() {
    this.loading.set(true);
    const id = this.route.snapshot.paramMap.get('id');
    const calls: any = {
      authors: this.authorService.getAuthors(),
      categories: this.categoryService.getAll(),
    };
    if (id) {
      calls.book = this.bookService.getBookById(id);
    }
    forkJoin(calls).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (res: any) => {
        this.authors.set(res.authors.items || res.authors);
        this.categories.set(res.categories.items);
        if (res.book) {
          const data = res.book;
          this.bookId.set(id);
          this.newBook.patchValue({
            name: data.name,
            description: data.description,
            author: data.author._id,
            price: data.price,
            stock: data.stock,
            categories: data.categories.map((c: any) => c._id),
          });
          this.previewUrl.set(data.coverUrl);
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load basic data' });
      }
    });
  }

  submit(formbody: FormGroup) {
    if (!formbody.valid || (this.selectedFile() === null && this.bookId() === null)) {
      formbody.markAllAsTouched();
      return;
    } else {
      const formData = new FormData();
      formData.append('name', formbody.value.name);
      formData.append('description', formbody.value.description);
      formData.append('author', formbody.value.author);
      formData.append('price', formbody.value.price);
      formData.append('stock', formbody.value.stock);
      const categories = Array.isArray(formbody.value.categories)
        ? formbody.value.categories
        : [formbody.value.categories];

      categories.forEach((cat: string) => formData.append('categories', cat));
      if (this.selectedFile()) {
        formData.append('coverImage', this.selectedFile()!);
      }
      this.saving.set(true);
      if (this.bookId()) {
        this.bookService.updateBook(this.bookId()!, formData).pipe(finalize(() => this.saving.set(false))).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book updated successfully' });
            this.router.navigate(['/admin/manage-books']);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update book' });
          },
        });
      } else {
        this.bookService.addBook(formData).pipe(finalize(() => this.saving.set(false))).subscribe({
          next: () => {
             this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book added successfully' });
             formbody.reset();
             this.router.navigate(['/admin/manage-books']);
             this.clearCover();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add book' });
          },
        });
      }
    }
  }
}
