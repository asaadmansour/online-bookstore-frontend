import { Order } from './order.model';

export interface OrderResponse {
  total: number;
  pages: number;
  orders: Order[];
}
