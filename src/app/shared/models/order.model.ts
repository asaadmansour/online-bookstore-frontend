export interface OrderItem {
    _id: string;
    book: {
        _id: string;
        title: string;
        coverUrl?: string;
        price: number;
        author?: {
            _id: string;
            name: string;
        };
    } | null; 
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

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    total_price: number; 
    status: OrderStatus;
    payment_status: PaymentStatus; 
    payment_method: string; 
    shipping_address: ShippingAddress; 
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