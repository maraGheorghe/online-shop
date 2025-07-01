import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import ProductsView from './pages/ProductsView';
import CartView from './pages/CartView';
import Checkout from "./pages/Checkout.js";
import OrdersView from "./pages/OrdersView.js";

function App() {
    return (
        <Router>
            <Toaster position="top-left" />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/products" element={<ProductsView />} />
                <Route path="/cart" element={<CartView />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrdersView />} />
            </Routes>
        </Router>
    );
}

export default App;
