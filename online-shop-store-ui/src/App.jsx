import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import OrdersView from "./pages/OrdersView.js";

function App() {
    return (
        <Router>
            <Toaster position="top-left" />
            <Routes>
                <Route path="/" element={<OrdersView />} />
                <Route path="/orders" element={<OrdersView />} />
            </Routes>
        </Router>
    );
}

export default App;
