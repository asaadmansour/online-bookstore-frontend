import { Book } from './book.model';
import { User } from './user.model';
export type OrderStatus = 'processing' | 'out_for_delivery' | 'delivered';
export type PaymentMethod = 'COD' | 'online';
export type PaymentStatus = 'pending' | 'success';

export interface OrderItem {
  book: Book | null;
  quantity: number;
  unitPrice: number;
}
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  total: number;
  PagesNumber: number;
  items: Order[];
}

export interface OrderDetailResponse {
  message?: string;
  order: Order;
}
