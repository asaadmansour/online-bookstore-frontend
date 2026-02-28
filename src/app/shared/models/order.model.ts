import { Book } from './book.model';
import { User } from './user.model';
export type OrderStatus = 'processing' | 'out_for_delivery' | 'delivered';
export type PaymentMethod = 'COD' | 'online';
export type PaymentStatus = 'pending' | 'success';

export interface OrderItem {
  book: Book | null;
  quantity: number;
  unit_price: number;
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
  user: User | string;
  items: OrderItem[];
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  shipping_address: ShippingAddress;
  total_price: number;
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
