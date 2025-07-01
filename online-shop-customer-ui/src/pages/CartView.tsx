import {useEffect, useState} from "react";
import {CartItem, Product} from "../types/types";
import {useNavigate} from "react-router-dom";
import TopBar from "../components/TopBar";
import CartItemView from "../components/CarItemView";
import {addToCart, removeFromCart} from "../utils/cart";
import toast from "react-hot-toast";
import CustomButton from "../components/CustomButton";
import {ArchiveBoxIcon} from "@heroicons/react/24/solid";
import OrderSocketListener from "../websocket/OrderSocketListener";

export default function CartView() {
    const [email, setEmail] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartChanged, setCartChanged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        const cartItems = JSON.parse(localStorage.getItem(savedEmail));
        if (!savedEmail) {
            navigate('/');
        } else {
            setEmail(savedEmail);
            setCartItems(cartItems);
            setCartChanged(false);
        }
    }, [navigate, cartChanged]);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast.success('Added to cart!');
        setCartChanged(true);
    };

    const handleRemoveFromCart = (product: Product) => {
        removeFromCart(product);
        toast.success('Removed from cart!');
        setCartChanged(true);
    }

    return (
        <div className="p-8">
            <TopBar
                email={email}
                customButtons={[
                    <CustomButton key="1" onClick={() => navigate('/products')}> Back to shopping </CustomButton>,
                    <CustomButton key="2" onClick={() => navigate('/orders')}> My Orders <ArchiveBoxIcon className="h-5 w-5" /> </CustomButton>]}
            />

            <h1 className="text-3xl font-bold tracking-tight mb-6 text-gray-800">My Cart</h1>

            {cartItems && cartItems.length > 0 ? (
                <>
                    <ul className="space-y-2">
                        {cartItems.map((cartItem) => (
                            <CartItemView
                                key={cartItem.id}
                                cartItem={cartItem}
                                onAddToCart={handleAddToCart}
                                onRemoveFromCart={handleRemoveFromCart}
                            />
                        ))}
                    </ul>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => navigate('/checkout')}
                            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            Checkout
                        </button>
                    </div>
                </>
            ) : (
                <div className="py-12 text-center text-gray-600 text-lg">
                    Your cart is empty.
                </div>
            )}
            <OrderSocketListener/>
        </div>
    );
}
