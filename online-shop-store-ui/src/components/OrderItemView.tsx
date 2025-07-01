import { useState } from 'react';
import { Order, OrderStatus } from '../types/types';
import toast from 'react-hot-toast';
import React from 'react';

type Props = {
    order: Order;
};

export default function OrderItemView({ order }: Props) {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
    const [loading, setLoading] = useState(false);

    const statusFlow: OrderStatus[] = ['PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED'];
    const nextStatus = statusFlow[statusFlow.indexOf(currentStatus) + 1];
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleStatusUpdate = () => {
        if (!nextStatus) return;
        setLoading(true);

        fetch(`${apiUrl}/orders/${order.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update order status');
                return res.json();
            })
            .then((updatedOrder) => {
                setCurrentStatus(updatedOrder.status);
                toast.success(`Order marked as ${updatedOrder.status.replace('_', ' ')}`);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Status update error:', err);
                toast.error('Failed to update order status.');
                setLoading(false);
            })
    };

    const groupedProducts = order.products.reduce((acc, product) => {
        const key = product.id;
        if (!acc[key]) {
            acc[key] = { ...product, quantity: 1 };
        } else {
            acc[key].quantity += 1;
        }
        return acc;
    }, {} as Record<string, { id: string; name: string; price: number; quantity: number }>);

    const total = Object.values(groupedProducts).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <li className="border p-6 rounded shadow-sm bg-white">
            <div className="mb-2">
                <p className="font-semibold text-gray-800">Order ID: <span className="text-gray-600">{order.id.slice(0, 8)}</span></p>
                <p className="text-sm text-gray-600">Customer: {order.customer.firstName} {order.customer.lastName}</p>
                <p className="text-sm text-gray-600 mb-2">Address: {order.customer.address}</p>
            </div>

            <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-1">Products:</p>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                    {Object.values(groupedProducts).map((item) => (
                        <li key={item.id} className="flex justify-between">
                            <span>{item.name} <span className="text-gray-500">×{item.quantity}</span></span>
                            <span>{(item.price * item.quantity).toFixed(2)} RON</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-bold text-gray-800">Total: {total.toFixed(2)} RON</p>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentStatus === 'PENDING'
                            ? 'bg-yellow-200 text-yellow-800'
                            : currentStatus === 'PROCESSING'
                                ? 'bg-blue-200 text-blue-800'
                                : currentStatus === 'IN_TRANSIT'
                                    ? 'bg-purple-200 text-purple-800'
                                    : 'bg-green-200 text-green-800'
                    }`}
                >
                {currentStatus.replace('_', ' ')}
            </span>
            </div>

            {nextStatus && (
                <div className="text-right">
                    <button
                        onClick={handleStatusUpdate}
                        disabled={loading}
                        className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : `Mark as ${nextStatus.replace('_', ' ')}`}
                    </button>
                </div>
            )}
        </li>
    );
}
