import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api.config';
import { Category } from '../../shared/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private API = inject(API_URL);
  getCategories() {
    return this.http.get<{ items: Category[] }>(`${this.API}/categories`);
  }
}
