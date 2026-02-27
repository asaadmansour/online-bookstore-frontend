import { Book } from './book.model';

export type OrderStatus = 'processing' | 'out_for_delivery' | 'delivered';
export type PaymentStatus = 'pending' | 'success';
export type PaymentMethod = 'COD' | 'online';
export type DeliveryMethod = 'standard' | 'express';

export interface OrderItem {
  book: Book | string;
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
  user: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
