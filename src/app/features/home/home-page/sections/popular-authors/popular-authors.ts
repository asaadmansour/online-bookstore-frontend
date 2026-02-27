import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../../../../../core/services/authors.service';
import { Author } from '../../../../../shared/models/author.model';
import { RouterLink } from '@angular/router';

type PagedResponse<T> = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: T[];
};

@Component({
  selector: 'app-popular-authors',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './popular-authors.html',
  styleUrl: './popular-authors.css',
})

export class PopularAuthorsComponent implements OnInit {
  authors: Author[] = [];
  loading = true;
  error = '';

  constructor(private authorsService: AuthorsService) {}

 ngOnInit(): void {
  this.loading = true;
  this.error = '';

  this.authorsService.getPopular().subscribe({
    next: (authors: Author[]) => {
      this.authors = authors;  
      this.loading = false;
    },
    error: (err: any) => {
      this.error = err?.message || 'Failed to load authors';
      this.loading = false;
    }
  });
}

  trackById(index: number, a: any) {
    return a?._id ?? a?.id ?? index;
  }

  avatar(a: any) {
    return a?.photo || a?.imageUrl || 'images/default-avatar.jpg';
  }

}