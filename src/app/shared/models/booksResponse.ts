import { Book } from './book.model';

export interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}
