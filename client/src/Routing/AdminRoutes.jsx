import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Dashboard from '../Admin/Pages/Dashboard';
import Products from '../Admin/Pages/Products';
import Orders from '../Admin/Pages/Order';
import AdminLayout from '../section/Admin-Section/AdminLayout';
import CalendarPage from '../Admin/Pages/CalendarPage';
import Categories from '../Admin/Pages/Categories';
import Chat from '../Admin/Pages/Chat';
import UserManagement from '../Admin/Pages/UserManagement';
import Voucher from '../Admin/Pages/Voucher';
import SubCategories from '../Admin/Pages/SubCategories';
import PaymentDetails from '../Admin/Pages/PaymentDetails';
import ProtectedRoute from '../pages/SignIn/ProtectedRoute';
import LoadingScreen from '../Admin/components/LoadingScreen';
import BusinessVerification from '../Admin/Pages/BusinessVerification';
import ContactDetail from '../Admin/Pages/ContactDetail';
import Banner from '../Admin/Pages/Banner';

const AdminRoutes = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // navigate('/admin/dashboard');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AdminLayout>
      <Routes>
        {/* This is the /admin route: redirect to /admin/dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="/dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute requireAdmin={true}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute requireAdmin={true}>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute requireAdmin={true}>
            <CalendarPage />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute requireAdmin={true}>
            <Categories />
          </ProtectedRoute>
        } />
        <Route path="/subcategories" element={
          <ProtectedRoute requireAdmin={true}>
            <SubCategories />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute requireAdmin={true}>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute requireAdmin={true}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/voucher" element={
          <ProtectedRoute requireAdmin={true}>
            <Voucher />
          </ProtectedRoute>
        } />
        <Route path="/banner" element={
          <ProtectedRoute requireAdmin={true}>
            <Banner />
          </ProtectedRoute>
        } />
        <Route path="/payment-details" element={
          <ProtectedRoute requireAdmin={true}>
            <PaymentDetails />
          </ProtectedRoute>
        } />
        <Route path="/business-verfication" element={
          <ProtectedRoute requireAdmin={true}>
            <BusinessVerification />
          </ProtectedRoute>
        } />
        <Route path="/contact-details" element={
          <ProtectedRoute requireAdmin={true}>
            <ContactDetail />
          </ProtectedRoute>
        } />

        <Route path="/banner" element={
          <ProtectedRoute requireAdmin={true}>
            <Banner />
          </ProtectedRoute>
        } />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;