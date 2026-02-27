import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthorsService } from '../../core/services/authors.service';
import { Author } from '../../shared/models/author.model';


@Component({
  selector: 'app-authors',
  standalone: true,
  imports:[CommonModule,FormsModule], 
  templateUrl: './authors.html',
  styleUrls: ['./authors.css'],
})
export class AuthorsComponent implements OnInit {

  authors: any[] = [];
  loading = false;
  error = '';

  defaultAvatar = 'images/default-avatar.png';

  constructor(private authorsService: AuthorsService,
              private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.authorsService.getAll().subscribe({
      next: (res: any) => {
        this.authors = res.items ?? res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load authors';
        this.loading = false;
      }
    });
  }

  trackById = (_: number, item: any) => item?._id ?? item?.id ?? _;

  setDefaultImage(e: Event) {
    const img = e.target as HTMLImageElement;
    img.src = this.defaultAvatar;
  }

  viewBooks(a: any) {
    const authorId = a?._id ?? a?.id;
    this.router.navigate(['/books'], { queryParams: { authorId } });
  }

}