import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from './authors.service';
import { Author } from '../../shared/models/author.model';

@Component({
  selector: 'app-authors-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authors.html',
  styleUrl: './authors.css',
})
export class AuthorsPage {
  private authorsService = inject(AuthorsService);

  authors: Author[] = this.authorsService.getAll();
}