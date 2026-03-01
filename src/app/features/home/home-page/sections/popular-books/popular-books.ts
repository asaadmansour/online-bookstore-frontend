import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-popular-books',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './popular-books.html',
  styleUrl: './popular-books.css'
})
export class PopularBooksComponent {
defaultBookCover = 'images/default-book.jpg';

onBookImgError(e: Event) {
  (e.target as HTMLImageElement).src = this.defaultBookCover;
}
  popularBooks = [
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      price: 120,
  
    },
    {
      title: '1984',
      author: 'George Orwell',
      price: 150,
   
    },
    {
      title: 'Murder on the Orient Express',
      author: 'Agatha Christie',
      price: 135,
     
    },
    {
      title: 'The Prophet',
      author: 'Khalil Gibran',
      price: 110,
      
    }
  ];
}