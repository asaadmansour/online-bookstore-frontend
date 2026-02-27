import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api.config';
import { BooksResponse } from '../../shared/models/booksResponse';
import { Book } from '../../shared/models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private API = inject(API_URL);
  getBooks(filters?: {
    categoryId?: string;
    authorId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    let params = new HttpParams();
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTljYjI4ZmQ5YmQ5NGY4ZTRjMTNkYzkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MjE5MjE2MSwiZXhwIjoxNzcyMTkzMDYxfQ.LlJ3h2iqCF6-_Jzj1_wSAT9COVTWy8eErGmovh9QeA4`,
    };
    if (filters?.categoryId) params = params.append('category', filters.categoryId);
    if (filters?.authorId) params = params.append('author', filters.authorId);
    if (filters?.minPrice) params = params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params = params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sort) params = params.append('sort', filters.sort);
    return this.http.get<BooksResponse>(`${this.API}/books`, { params, headers });
  }
  getBookById(id: string) {
    return this.http.get<Book>(`${this.API}/books/${id}`);
  }
  getPopularBooks() {
    return this.http.get<BooksResponse>(`${this.API}/books/popular`);
  }
  addBook(book: Book) {
    return this.http.post<Book>(`${this.API}/books`, book);
  }
  deleteBook(id: string) {
    return this.http.delete<Book>(`${this.API}/books/${id}`);
  }
  updateBook(id: string, updates: Partial<Book>) {
    return this.http.patch(`${this.API}/books/${id}`, updates);
  }
}
