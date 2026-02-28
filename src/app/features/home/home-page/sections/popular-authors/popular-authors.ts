import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { AuthorService } from '../../../../../core/services/author.service';
import { Author } from '../../../../../shared/models/author.model';

@Component({
  selector: 'app-trending-authors',
  templateUrl: './popular-authors.html',
  standalone: true,
  imports: [ButtonModule, CarouselModule, TagModule, RouterLink],
})
export class TrendingAuthors implements OnInit {
  private authorService = inject(AuthorService);

  authors = signal<Author[]>([]);
  responsiveOptions = [
    { breakpoint: '1920px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px',  numVisible: 2, numScroll: 1 },
    { breakpoint: '576px',  numVisible: 1, numScroll: 1 },
  ];

  ngOnInit() {
    this.authorService.getAuthors().subscribe((data) => {
      this.authors.set(data.items.slice(0, 9));
    });
  }

  avatar(a: Author): string {
    return a.authorImage || 'images/default-avatar.jpg';
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'images/default-avatar.jpg';
  }
}
