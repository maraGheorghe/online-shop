import { useEffect, useState } from 'react';
import OrderItemView from "../components/OrderItemView";
import OrderSocketListener from "../websocket/OrderSocketListener";
import {Order} from "../types/types";
import React from 'react';


export default function OrdersView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const loadOrders = () => {
        fetch(`${apiUrl}/orders`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch orders');
                return res.json();
            })
            .then((data) => setOrders(data))
            .catch((err) => console.error('Orders fetch error:', err));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-800">Orders</h1>
            <ul className="space-y-2">
                {orders.map((order) => (
                    <OrderItemView key={order.id} order={order} />
                ))}
            </ul>

            <OrderSocketListener onOrderReceived={loadOrders} />
        </div>
    );
}
