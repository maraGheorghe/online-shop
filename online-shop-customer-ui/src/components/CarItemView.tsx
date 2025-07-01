import {CartItem, Product} from "../types/types";

type Props = {
    cartItem: CartItem;
    onAddToCart: (product: Product) => void;
    onRemoveFromCart: (product: Product) => void;
};

export default function CartItemView({ cartItem, onAddToCart, onRemoveFromCart }: Props) {
    return (
        <li className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
                <p className="font-medium">{cartItem.name}</p>
                <p className="text-sm text-gray-600">Price: {cartItem.price} RON</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative group">
                    <button
                        onClick={() => onRemoveFromCart(cartItem)}
                        className="bg-gray-500 hover:bg-gray-700 text-white text-lg font-bold w-10 h-10 rounded flex items-center justify-center cursor-pointer"
                    >
                        –
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 shadow whitespace-nowrap">
                        Remove from cart
                    </div>
                </div>

                <p className="text-sm text-gray-800 bg-gray-200 rounded-full px-3 py-1 min-w-[40px] text-center">
                    {cartItem.quantity}
                </p>

                <div className="relative group">
                    <button
                        onClick={() => onAddToCart(cartItem)}
                        className="bg-gray-500 hover:bg-gray-700 text-white text-lg font-bold w-10 h-10 rounded flex items-center justify-center cursor-pointer"
                    >
                        +
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 shadow whitespace-nowrap">
                        Add to cart
                    </div>
                </div>
            </div>
        </li>
    );
}