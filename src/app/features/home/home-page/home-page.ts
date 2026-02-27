import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopularAuthorsComponent } from './sections/popular-authors/popular-authors';
import { AuthorsService } from '../../../core/services/authors.service';
import { HomeImage } from '../home-image/home-image';
import { TrendingBooks } from '../trending-books/trending-books';
import { HomeCategories } from '../home-categories/home-categories';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    PopularAuthorsComponent,
    HomeImage,
    TrendingBooks,
    HomeCategories,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  popularAuthors: any[] = [];
  loadingAuthors = true;
  private authorsService = inject(AuthorsService);

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
      },
    });
  }
  onImgError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.src = 'images/default-avatar.jpg';
  }
}
