import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { AuthorsService } from '../../core/services/authors.service';
import { Author } from '../../shared/models/author.model';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../shared/models/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);
  newBook: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    author: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    categories: [[] as string[], Validators.required],
  });
  private bookService = inject(BookService);
  private authorService = inject(AuthorsService);
  private categoryService = inject(CategoriesService);
  private route = inject(ActivatedRoute);
  bookId = signal<string | null>(null);
  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  loadAuthors() {
    this.authorService.getAuthors().subscribe((data) => {
      this.authors.set(data.items || data);
    });
  }
  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories.set(data.items);
    });
  }
  selectCategories(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValues = Array.from(select.selectedOptions).map((opt) => opt.value);
    this.newBook.get('categories')?.setValue(selectedValues);
    console.log('Selected categories:', selectedValues);
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
      console.log(this.selectedFile());
    }
  }
  clearCover() {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  ngOnInit() {
    this.loadAuthors();
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookById(id).subscribe((data) => {
        this.bookId.set(id);
        this.newBook.patchValue({
          name: data.name,
          description: data.description,
          author: data.author._id,
          price: data.price,
          stock: data.stock,
          categories: data.categories.map((c) => c._id),
        });
      });
    }
  }

  submit(formbody: FormGroup) {
    if (!formbody.valid && this.selectedFile() === null) {
      formbody.markAllAsTouched();
    } else {
      const formData = new FormData();
      // text fields
      formData.append('name', formbody.value.name);
      formData.append('description', formbody.value.description);
      formData.append('author', formbody.value.author);
      formData.append('price', formbody.value.price);
      formData.append('stock', formbody.value.stock);
      // Send categories as array of values
      formbody.value.categories.forEach((cat: string) => {
        formData.append('categories', cat);
      });
      // file
      formData.append('coverImage', this.selectedFile()!);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      if (this.bookId()) {
        this.bookService.updateBook(this.bookId()!, formData).subscribe((data) => {
          console.log(data);
        });
      } else {
        this.bookService.addBook(formData).subscribe(
          (response) => {
            console.log('Book added successfully:', response);
            formbody.reset();
            this.clearCover();
          },
          (error) => {
            console.error('Error adding book:', error);
          },
        );
      }
    }
  }
}
