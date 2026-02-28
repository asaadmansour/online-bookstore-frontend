import { Author } from './author.model';

export interface AuthorResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Author[];
}
