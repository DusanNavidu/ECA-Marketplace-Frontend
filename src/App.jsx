import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AlertProvider } from './context/AlertContext';
import { CartProvider } from './context/CartContext';
import { getUserFromToken } from './utils/auth';
import Error403 from './pages/errors/Error403';
import Error404 from './pages/errors/Error404';
import Error500 from './pages/errors/Error500';
import ManageSellers from './pages/admin/ManageSellers';
import ManageBuyers from './pages/admin/ManageBuyers';
import AddProduct from './pages/seller/AddProduct';
import SellerDashboard from './pages/seller/SellerDashboard';
import MyOrders from './pages/buyer/MyOrders';
import ManageProducts from './pages/admin/ManageProducts';

function App() {

  const RoleBasedRedirect = () => {
    const user = getUserFromToken();
    if (!user) return <Navigate to="/login" replace />;

    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
    if (user.role === 'BUYER') return <Navigate to="/" replace />;

    return <Navigate to="/" replace />;
  };

  return (
    <AlertProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<RoleBasedRedirect />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sellers"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageSellers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/buyers"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageBuyers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/catalog"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />


            {/* ================= SELLER ROUTES ================= */}
            <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />

            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SELLER']}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/add-product"
              element={
                <ProtectedRoute allowedRoles={['SELLER']}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/my-orders" 
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <MyOrders />
                </ProtectedRoute>
              } 
            />


            <Route path="/403" element={<Error403 />} />
            <Route path="/500" element={<Error500 />} />
            <Route path="*" element={<Error404 />} />

          </Routes>
        </Router>
      </CartProvider>
    </AlertProvider>
  );
}

export default App;