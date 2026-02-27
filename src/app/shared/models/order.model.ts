import { Address } from './address.model';
import { OrderItems } from './orderItems.model';
import { User } from './user.model';

export interface Order {
  _id: string;
  user: User;
  items: OrderItems[];
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: Address;
  total_price: number;
  createdAt: string;
  updatedAt: string;
}
