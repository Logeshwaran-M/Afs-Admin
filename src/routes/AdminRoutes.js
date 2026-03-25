import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import Products from '../pages/admin/Products';
import Orders from '../pages/admin/Orders';
import Users from '../pages/admin/Users';
import Categories from '../pages/admin/Categories';
import Reviews from '../pages/admin/Reviews';
import Settings from '../pages/admin/Settings';
import ProductForm from '../pages/admin/ProductForm';
import OrderDetails from '../pages/admin/OrderDetails';
import AdminLogin from '../pages/admin/Login';

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin } = useFirebase();
  
  if (!user) {
    return <Navigate to="/admin/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Admin Login */}
      <Route path="login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="/" element={
        <ProtectedAdminRoute>
          <Dashboard />
        </ProtectedAdminRoute>
      } />
      
      <Route path="dashboard" element={
        <ProtectedAdminRoute>
          <Dashboard />
        </ProtectedAdminRoute>
      } />
      
      <Route path="products" element={
        <ProtectedAdminRoute>
          <Products />
        </ProtectedAdminRoute>
      } />
      
      <Route path="products/new" element={
        <ProtectedAdminRoute>
          <ProductForm />
        </ProtectedAdminRoute>
      } />
      
      <Route path="products/edit/:id" element={
        <ProtectedAdminRoute>
          <ProductForm />
        </ProtectedAdminRoute>
      } />
      
      <Route path="orders" element={
        <ProtectedAdminRoute>
          <Orders />
        </ProtectedAdminRoute>
      } />
      
      <Route path="orders/:id" element={
        <ProtectedAdminRoute>
          <OrderDetails />
        </ProtectedAdminRoute>
      } />
      
      <Route path="users" element={
        <ProtectedAdminRoute>
          <Users />
        </ProtectedAdminRoute>
      } />
      
      <Route path="categories" element={
        <ProtectedAdminRoute>
          <Categories />
        </ProtectedAdminRoute>
      } />
      
      <Route path="reviews" element={
        <ProtectedAdminRoute>
          <Reviews />
        </ProtectedAdminRoute>
      } />
      
      <Route path="settings" element={
        <ProtectedAdminRoute>
          <Settings />
        </ProtectedAdminRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;