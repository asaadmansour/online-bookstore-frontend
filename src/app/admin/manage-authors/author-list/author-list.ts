import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../../../core/services/authors.service';
import { Author } from '../../../shared/models/author.model';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressSpinnerModule],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css',
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  loading = true;
  error = '';
  pendingDeleteId: string | null = null;
  pendingDeleteName = '';
  deleting = false;

  constructor(
    private authorsService: AuthorsService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.authorsService.getAll().subscribe({
      next: (data) => {
        this.authors = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load authors. Make sure the backend is running.';
        this.loading = false;
      }
    });
  }

  getId(a: Author): string {
    return (a._id);
  }

  openDelete(author: Author) {
    this.pendingDeleteId = this.getId(author);
    this.pendingDeleteName = author.name;
  }

  cancelDelete() {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
  }

  confirmDelete() {
    if (!this.pendingDeleteId) return;
    this.deleting = true;
    this.authorsService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.authors = this.authors.filter(a => this.getId(a) !== this.pendingDeleteId);
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.deleting = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Author deleted' });
      },
      error: () => {
        this.deleting = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete author' });
      }
    });
  }
}