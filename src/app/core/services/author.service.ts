import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api.config';
import { AuthorResponse } from '../../shared/models/authorResponse';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private API = inject(API_URL);
  getAuthors() {
    return this.http.get<AuthorResponse>(`${this.API}/authors`);
  }
}
