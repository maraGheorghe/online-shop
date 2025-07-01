import {Product} from "../types/types";

type Props = {
    product: Product;
    onAddToCart: (product: Product) => void;
};

export default function ProductItemView({ product, onAddToCart }: Props) {
    return (
        <li key={product.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">Price: {product.price} RON</p>
            </div>

            <div className="relative group">
                <button
                    onClick={() => onAddToCart(product)}
                    className="bg-gray-500 hover:bg-gray-700 text-white text-lg font-bold w-10 h-10 rounded flex items-center justify-center cursor-pointer"
                >
                    +
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 shadow whitespace-nowrap">
                    Add to cart
                </div>
            </div>
        </li>
    );
};
