import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GuestLayout from './components/GuestLayout';
import GuestOnly from './components/GuestOnly';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import BuyerDashboard from './pages/BuyerDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import Welcome from './pages/Welcome';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GuestOnly />}>
              <Route element={<GuestLayout />}>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
            </Route>

            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute role="Buyer">
                      <BuyerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute role="Seller">
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
