import { Order, CartItem } from "../types/types";

type Props = {
    order: Order;
};

export default function OrderItemView({ order }: Props) {
    const productsMap = new Map<string, CartItem>();

    order.products.forEach((product) => {
        const existing = productsMap.get(product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            productsMap.set(product.id, {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
            });
        }
    });

    const productSummary = Array.from(productsMap.values());

    const totalPrice = productSummary.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
    );

    return (
        <li key={order.id} className="border p-4 rounded shadow-sm">
            <p className="font-medium mb-2">Order ID: {order.id.slice(0, 8)}</p>
            <p className="text-sm text-gray-600 mb-2">Status: {order.status}</p>

            <div className="mb-2">
                <p className="font-semibold">Products:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                    {productSummary.map((item) => (
                        <li key={item.id}>
                            {item.name} {item.quantity > 1 && (
                                <span className="text-gray-500 ml-1">×{item.quantity}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <p className="text-sm font-semibold text-right text-gray-800">
                Price: {totalPrice.toFixed(2)} RON
            </p>
        </li>
    );
}
