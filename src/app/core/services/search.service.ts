import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../shared/models/book.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private API = inject(API_URL);
  private http = inject(HttpClient);
  getSuggestions(query: string) {
    return this.http.get<Book[]>(`${this.API}/books/suggestions`, { params: { q: query } });
  }
}
