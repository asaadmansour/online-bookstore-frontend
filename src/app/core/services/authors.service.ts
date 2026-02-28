import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../api.config';
import { Observable } from 'rxjs';
import { Author } from '../../shared/models/author.model';
import { AuthorResponse } from '../../shared/models/authorResponse';
 import { map } from 'rxjs/operators';
 
type PagedResponse<T> = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: T[];
};
@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

 private http = inject(HttpClient);
  private API = inject(API_URL);

  getAuthors() {
    return this.http.get<AuthorResponse>(`${this.API}/authors`);
  }

  getAll(): Observable<Author[]> {
    return this.http.get<PagedResponse<Author>>(`${this.API}/authors`)
      .pipe(map(res => res?.items ?? []));
  }

  getPopular(): Observable<Author[]> {
  return this.http.get<PagedResponse<Author>>(`${this.API}/authors/popular`)
    .pipe(map(res => res?.items ?? []));
}

  getById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.API}/authors/${id}`);
  }

  createWithImage(author: FormData): Observable<Author> {
  return this.http.post<Author>(`${this.API}/authors`, author);

  }
  updateWithImage(id: string, author: FormData): Observable<Author> {
  return this.http.patch<Author>(`${this.API}/authors/${id}`, author);
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/authors/${id}`);
  }
}