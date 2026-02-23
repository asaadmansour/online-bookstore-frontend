import { Address } from "./address.model";
import { OrderItems } from "./orderItems.model";

export interface Order{
  _id:string;
  user:string;
  items:OrderItems[];
  status:string;
  payment_status:string;
  payment_method:string;
  shipping_address:Address;
  total_price:number;
  createdAt:string;
  updatedAt:string;
}