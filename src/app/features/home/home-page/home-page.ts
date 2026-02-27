import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopularAuthorsComponent } from './sections/popular-authors/popular-authors';
import { PopularBooksComponent } from './sections/popular-books/popular-books';
import { AuthorsService } from '../../../core/services/authors.service';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, PopularAuthorsComponent, PopularBooksComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})

export class HomePageComponent implements OnInit {

  popularAuthors: any[] = [];
  loadingAuthors = true;

  constructor(private authorsService: AuthorsService) {}

  ngOnInit(): void {
    this.loadPopularAuthors();
  }

  loadPopularAuthors() {
    this.authorsService.getPopular().subscribe({
      next: (authors: any[]) => {
        this.popularAuthors = authors;
        this.loadingAuthors = false;
      },
      error: (err: any) => {
        console.error('Failed to load popular authors', err);
        this.loadingAuthors = false;
      }
    });
  }
  onImgError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = 'images/default-avatar.jpg';
}
}