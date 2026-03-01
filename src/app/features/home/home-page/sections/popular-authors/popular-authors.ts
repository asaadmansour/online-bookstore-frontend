import { Component, OnInit, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { AuthorsService } from '../../../../../core/services/authors.service';
import { Author } from '../../../../../shared/models/author.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-trending-authors',
  templateUrl: './popular-authors.html',
  standalone: true,
  imports: [ButtonModule, CarouselModule, TagModule, RouterLink, NgOptimizedImage, ProgressSpinnerModule],
})
export class TrendingAuthors implements OnInit {
  private authorService = inject(AuthorsService);

  authors = signal<Author[]>([]);
  loading = signal<boolean>(true);
  responsiveOptions = [
    { breakpoint: '1920px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '576px', numVisible: 1, numScroll: 1 },
  ];

  ngOnInit() {
    this.loading.set(true);
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors.set(data.items.slice(0, 9));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  avatar(a: Author): string {
    return a.authorImage || 'images/default-avatar.jpg';
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'images/default-avatar.jpg';
  }
}
