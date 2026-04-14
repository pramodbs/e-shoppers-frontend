// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdsList from './pages/ads/AdsList';
import OffersList from './pages/offers/OffersList';
import AnnouncementsList from './pages/announcements/AnnouncementsList';
import RulesList from './pages/rules/RulesList';
import CategoriesList from './pages/categories/CategoriesList';
import AdminProducts from './pages/products/AdminProducts';
import ProductDetails from './pages/products/ProductDetails';
import AdminOrders from './pages/orders/AdminOrders';
import AdminUsers from './pages/users/AdminUsers';
import SellersList from './pages/logistics/SellersList';
import StoreroomsList from './pages/logistics/StoreroomsList';
import InventoryList from './pages/logistics/InventoryList';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import CartPage from './pages/cart/CartPage';
import Checkout from './pages/checkout/Checkout';
import ProtectedByRole from './auth/ProtectedByRole';

export default function App() {
    return (
        <MainLayout>
            <Routes>
                {/* Public */}
                <Route path='/' element={<Home />} />
                <Route path='/search' element={<SearchPage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/product/:id' element={<ProductDetails />} />

                {/* Authenticated customer routes */}
                <Route path='/cart' element={<CartPage />} />
                <Route path='/checkout' element={<ProtectedByRole><Checkout /></ProtectedByRole>} />

                {/* Role-aware admin/staff routes */}
                <Route path='/admin' element={<ProtectedByRole><Dashboard /></ProtectedByRole>} />
                <Route path='/admin/categories' element={<ProtectedByRole><CategoriesList /></ProtectedByRole>} />
                <Route path='/admin/products' element={<ProtectedByRole><AdminProducts /></ProtectedByRole>} />
                <Route path='/admin/ads' element={<ProtectedByRole><AdsList /></ProtectedByRole>} />
                <Route path='/admin/offers' element={<ProtectedByRole><OffersList /></ProtectedByRole>} />
                <Route path='/admin/announcements' element={<ProtectedByRole><AnnouncementsList /></ProtectedByRole>} />
                <Route path='/admin/rules' element={<ProtectedByRole><RulesList /></ProtectedByRole>} />
                <Route path='/admin/orders' element={<ProtectedByRole><AdminOrders /></ProtectedByRole>} />
                <Route path='/admin/users' element={<ProtectedByRole><AdminUsers /></ProtectedByRole>} />
                <Route path='/admin/sellers' element={<ProtectedByRole><SellersList /></ProtectedByRole>} />
                <Route path='/admin/storerooms' element={<ProtectedByRole><StoreroomsList /></ProtectedByRole>} />
                <Route path='/admin/inventory' element={<ProtectedByRole><InventoryList /></ProtectedByRole>} />
                <Route path='/delivery' element={<ProtectedByRole><DeliveryDashboard /></ProtectedByRole>} />

                {/* Redirects */}
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </MainLayout>
    );
}
