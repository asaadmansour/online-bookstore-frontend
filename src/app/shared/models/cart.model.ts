import { Book } from './book.model';

export interface CartItem {
  book: Book;
  quantity: number;
  _id?: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  updatedAt: string;
}
