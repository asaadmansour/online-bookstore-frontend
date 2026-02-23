import { Component, inject, input } from '@angular/core';
import { Book } from '../../../shared/models/book.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {
  book = input.required<Book>();
  private router = inject(Router);
  goToDetail() {
    console.log(this.book()._id);
    this.router.navigate(['/books', this.book()._id]);
  }
}
