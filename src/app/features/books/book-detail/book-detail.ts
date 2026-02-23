import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../shared/models/book.model';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-book-detail',
  imports: [LucideAngularModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {
  readonly ShoppingCart = ShoppingCart; // ← expose it as a class property

  book = signal<Book | null>(null);
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookService.getBookById(id!).subscribe((data) => {
      console.log(data);
      this.book.set(data);
    });
  }
}
