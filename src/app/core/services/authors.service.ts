import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../../shared/models/author.model';
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

  private baseUrl = 'http://localhost:5000/authors';

  constructor(private http: HttpClient) {}

  // Get all authors
  getAll(): Observable<Author[]> {
    return this.http.get<PagedResponse<Author>>(this.baseUrl)
      .pipe(map(res => res?.items ?? []));
  }

  // Get popular authors
  getPopular(): Observable<Author[]> {
  return this.http.get<PagedResponse<Author>>(`${this.baseUrl}/popular`)
    .pipe(map(res => res?.items ?? []));
}

  // Get author by id
  getById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.baseUrl}/${id}`);
  }

  // Create author
  create(author: Partial<Author>): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, author);
  }

  // Update author
  update(id: string, author: Partial<Author>): Observable<Author> {
    return this.http.patch<Author>(`${this.baseUrl}/${id}`, author);
  }

  // Delete author
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}