import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api.config';
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
  private http = inject(HttpClient);
  private API = inject(API_URL);
  getCategories() {
    return this.http.get<{ items: Category[] }>(`${this.API}/categories`);
  }

  getAll(page = 1, limit = 10): Observable<PageResponse<Category>> {
    return this.http
      .get<PageResponse<Category>>(`${this.API}/categories?page=${page}&limit=${limit}`);

  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.API}/categories/${id}`);
  }
  createWithImage(category: FormData): Observable<Category> {
  return this.http.post<Category>(`${this.API}/categories`, category);
  }
  updateWithImage(id: string, category: FormData): Observable<Category> {
  return this.http.patch<Category>(`${this.API}/categories/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/categories/${id}`);
  }
}