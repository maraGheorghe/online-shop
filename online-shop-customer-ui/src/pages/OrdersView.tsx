import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "../components/TopBar"
import '../output.css';
import {ShoppingCartIcon} from "@heroicons/react/24/solid";
import CustomButton from "../components/CustomButton";
import {Order} from "../types/types";
import OrderItemView from "../components/OrderItemView";
import OrderSocketListener from "../websocket/OrderSocketListener";

export default function OrdersView() {
    const [email, setEmail] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const loadOrders =  (userEmail: string) => {
        fetch(`${apiUrl}/orders/customer/${userEmail}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch orders");
                return res.json();
            })
            .then((data) => setOrders(data))
            .catch((err) => console.error('Orders fetch error:', err));
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        if (!savedEmail) {
            navigate('/');
            return;
        }
        setEmail(savedEmail);
        loadOrders(savedEmail);
    }, [navigate]);

    return (
        <div className="p-8">
            <TopBar
                email={email}
                customButtons={[
                    <CustomButton key="1" onClick={() => navigate('/cart')}> Proceed to <ShoppingCartIcon className="h-5 w-5" /> </CustomButton>,
                    <CustomButton key="2" onClick={() => navigate('/products')}> Back to shopping </CustomButton>]}
            />
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-800">My Orders</h1>
            <ul className="space-y-2">
                {orders.map((order) => (
                   <OrderItemView key={order.id} order={order}  />
                ))}
            </ul>
            <OrderSocketListener onOrderUpdated={loadOrders} userEmail={email} />
        </div>
    );
}
