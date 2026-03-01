import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Book } from '../../../shared/models/book.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {
  book = input.required<Book>();
  private router = inject(Router);
  goToDetail() {
    this.router.navigate(['/books', this.book()._id]);
  }
}
