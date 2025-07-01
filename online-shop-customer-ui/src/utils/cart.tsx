import { Product, CartItem } from '../types/types';

export function addToCart(product: Product): void {
    const userEmail = localStorage.getItem('userEmail');
    const existing = localStorage.getItem(userEmail);
    const cart: CartItem[] = existing ? JSON.parse(existing) : [];

    const itemIndex = cart.findIndex(p => p.id === product.id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(userEmail, JSON.stringify(cart));
}

export function removeFromCart(product: Product): void {
    const userEmail = localStorage.getItem('userEmail');
    const existing = localStorage.getItem(userEmail);
    const cart: CartItem[] = existing ? JSON.parse(existing) : [];

    const itemIndex = cart.findIndex(p => p.id === product.id);

    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }

    localStorage.setItem(userEmail, JSON.stringify(cart));
}

export function clearCart(): void {
    const userEmail = localStorage.getItem('userEmail');
    localStorage.removeItem(userEmail);
}
