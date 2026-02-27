import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthorsService } from '../../core/services/authors.service';
import { Author } from '../../shared/models/author.model';


@Component({
  selector: 'app-authors',
  imports:[CommonModule], 
  templateUrl: './authors.html',
  styleUrls: ['./authors.css'],
})
export class AuthorsComponent implements OnInit {

  authors: Author[] = [];
  loading = true;
  error = '';

  defaultAvatar = 'images/default-avatar.jpg';

  constructor(private authorsService: AuthorsService,
              private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe((params) => {
    const id = params.get('id');

    this.loading = true;
    this.error = '';

    if (id) {
      // single author
      this.authorsService.getById(id).subscribe({
        next: (author) => {
          this.authors = author ? [author] : [];
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load author';
          this.loading = false;
        },
      });
    } else {
      // all authors
      this.authorsService.getAll().subscribe({
        next: (authors) => {
          this.authors = authors;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load authors';
          this.loading = false;
        },
      });
    }
  });
}

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.defaultAvatar;
  }
}