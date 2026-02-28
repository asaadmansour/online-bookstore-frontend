import { Author } from './author.model';
import { Category } from './category.model';
export interface Book {
  _id: string;
  name: string;
  author: Author;
  categories: Category[];
  coverUrl: string;
  price: number;
  stock: number;
  description: string;
  averageRating: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
