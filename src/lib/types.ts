export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface CartItem extends Product {
    qty: number;
}

export interface Bill {
    id: number;
    date: string; // ISO string
    items: Record<number, number>; // ProductID -> Qty
    total: number;
    mode: 'cash' | 'upi' | 'credit';
    customer?: string; // Phone number for credit
}

export interface ShopProfile {
    name: string;
    category: string;
    phone: string;
}

export interface User {
    phone: string;
    isVerified: boolean;
}
