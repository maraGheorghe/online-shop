export type Product = {
    id: string;
    name: string;
    price: number;
};

export type Customer = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
};

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'IN_TRANSIT' | 'DELIVERED';

export type Order = {
    id: string;
    products: Product[];
    status: OrderStatus;
    customer: Customer;
};
