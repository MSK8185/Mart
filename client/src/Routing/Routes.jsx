import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, } from "react-router-dom";
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import SearchResults from "../pages/SearchResults/SearchResults";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import ProductDetails from "../components/ProductDetails";
import Payment from "../pages/Payment/Payment";
import OrderPlaced from "../pages/OrderPlaced/OrderPlaced";
import Categorypage from "../components/Categorypage";
import MyAccount from "../pages/Account/MyAccount";
import OrderHistory from "../components/OrderHistory";
import ProtectedRoute from "../pages/SignIn/ProtectedRoute";
import LoadingScreen from '../Admin/components/LoadingScreen';
import { Link } from "react-router-dom";



const AppRoutes = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;

  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/search" element={<SearchResults />} />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orderplaced"
        element={
          <ProtectedRoute>
            <OrderPlaced />
          </ProtectedRoute>
        }
      />
      <Route path="/categories/:categoryName" element={<Categorypage />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      {/* Product Details Route */}
      <Route path="/product-details/:productId" element={<ProductDetails />} />
    </Routes>
  );
};

export default AppRoutes;
