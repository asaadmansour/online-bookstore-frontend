import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api.config';
import { Author } from '../../shared/models/author.model';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private API = inject(API_URL);
  getAuthors() {
    return this.http.get<{
      items: Author[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>(`${this.API}/authors`);
  }
}
