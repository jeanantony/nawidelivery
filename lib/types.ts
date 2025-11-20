export interface Profile {
    id: string;
    full_name: string | null;
    address: string | null;
    phone: string | null;
    avatar_url: string | null;
    updated_at: string | null;
}

export interface Order {
    id: number;
    user_id: string;
    created_at: string;
    total: number;
    status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    item_name: string;
    quantity: number;
    price: number;
}
