import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from "../types/types";
import ProductItemView from "../components/ProductItemView"
import SearchBar from "../components/SearchBar"
import TopBar from "../components/TopBar"
import '../output.css';
import {ShoppingCartIcon, ArchiveBoxIcon} from "@heroicons/react/24/solid";
import { addToCart } from '../utils/cart';
import toast from "react-hot-toast";
import CustomButton from "../components/CustomButton";
import OrderSocketListener from "../websocket/OrderSocketListener";

export default function ProductsView() {
    const [email, setEmail] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        if (!savedEmail) {
            navigate('/');
        } else {
            setEmail(savedEmail);
        }
    }, [navigate]);

    useEffect(() => {
        const url = search.trim()
            ? `${apiUrl}/products/${search}`
            : `${apiUrl}/products`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error('Product fetch error:', err));
    }, [search]);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast.success('Added to cart!');
    };

    return (
        <div className="p-8">
            <TopBar
                email={email}
                customButtons={[
                    <CustomButton key="1" onClick={() => navigate('/cart')}> Proceed to <ShoppingCartIcon className="h-5 w-5" /> </CustomButton>,
                    <CustomButton key="2" onClick={() => navigate('/orders')}> My Orders <ArchiveBoxIcon className="h-5 w-5" /> </CustomButton>]}
            />
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-800">Products</h1>
            <SearchBar value={search} onChange={setSearch} />
            <ul className="space-y-2">
                {products.map((product) => (
                    <ProductItemView key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
            </ul>
            <OrderSocketListener/>
        </div>
    );
}
