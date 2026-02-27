import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../../shared/models/category.model';

interface PageResponse<T> {
  _id: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: T[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl = 'http://localhost:5000/categories';

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10): Observable<PageResponse<Category>> {
    return this.http
      .get<PageResponse<Category>>(`${this.baseUrl}?page=${page}&limit=${limit}`);
      
  }

  // GET /categories/:id
  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  // POST /categories
  create(payload: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, payload);
  }

  // PATCH /categories/:id
  update(id: string, payload: { name?: string }): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, payload);
  }

  // DELETE /categories/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}