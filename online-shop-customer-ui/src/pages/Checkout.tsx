import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import toast from 'react-hot-toast';
import { clearCart } from '../utils/cart';
import CustomButton from "../components/CustomButton";
import {ArchiveBoxIcon, ShoppingCartIcon} from "@heroicons/react/24/solid";
import OrderSocketListener from "../websocket/OrderSocketListener";

export default function CustomerDetailsView() {
    const [email, setEmail] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        if (!savedEmail) {
            navigate('/');
        } else {
            setEmail(savedEmail);
            fetchCustomerDetails(savedEmail);
        }
    }, [navigate]);

    const fetchCustomerDetails = (email: string) => {
        fetch(`${apiUrl}/customers/email/${email}`)
            .then(res => {
                if (!res.ok) throw new Error('Customer not found');
                return res.json();
            })
            .then(data => {
                setId(data.id);
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
                setAddress(data.address || '');
            })
            .catch(err => {
                console.error('Failed to retrieve customer account:', err);
                setError('Failed to load customer details.');
            });
    };

    const handleFinishOrder = (e: FormEvent) => {
        e.preventDefault();

        if (!id || !firstName || !lastName || !address) {
            toast.error('All fields are required!');
            return;
        }

        fetch(`${apiUrl}/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, address }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update customer');

                const cartData = localStorage.getItem(email);
                const cartItems = cartData ? JSON.parse(cartData) : [];

                if (cartItems.length === 0) {
                    toast.error('Cart is empty!');
                    throw new Error('Cart is empty!');
                }

                const order = {
                    customer: { id },
                    products: cartItems.map(item => Array(item.quantity).fill({ id: item.id })).flat(),
                    status: 'PENDING',
                };

                return fetch(`${apiUrl}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(order),
                });
            })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create order');

                toast.success('Order placed successfully!');
                clearCart();
                navigate('/products');
            })
            .catch((err) => {
                console.error('Order error:', err);
                if (err.message !== 'Cart is empty') {
                    toast.error('Something went wrong. Try again later.');
                }
            });
    };


    return (
        <div className="p-8">
            <TopBar
                email={email}
                customButtons={[
                    <CustomButton key="1" onClick={() => navigate('/cart')}> Back to <ShoppingCartIcon className="h-5 w-5" /> </CustomButton>,
                    <CustomButton key="2" onClick={() => navigate('/products')}> Back to shopping </CustomButton>,
                    <CustomButton key="3" onClick={() => navigate('/orders')}> My Orders <ArchiveBoxIcon className="h-5 w-5" /> </CustomButton>]}
            />

            <div className="flex justify-center mt-6">
                <div className="w-full max-w-xl">
                    <h1 className="text-3xl font-bold tracking-tight mb-6 text-gray-800 text-center">
                        Customer Details
                    </h1>

                    {error && (
                        <p className="text-red-600 mb-4 text-center">{error}</p>
                    )}

                    {!error && (
                        <form onSubmit={handleFinishOrder} className="bg-white p-6 rounded shadow max-w-lg mx-auto">
                            <p className="mb-4"><strong>Email:</strong> {email}</p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded w-full"
                            >
                                Finish Order
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <OrderSocketListener/>
        </div>
    );
}
