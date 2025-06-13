import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './Routing/Routes';
import { CartProvider } from './context/CartContext';
import Footer from './components/Footer';
import FeaturesSection from './section/FeaturesSection';
import { Provider } from 'react-redux';
import store from './store/store';
import AdminRoutes from './Routing/AdminRoutes';
import ScrollToTop from './components/ScrollToTop'
import AboutUsB2B from '../src/pages/About/About';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <CartProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <div id="main-content" className="transition-transform">
                    <AppRoutes />
                    <FeaturesSection />
                    <Footer />
                  </div>
                </>
              }
            />
          </Routes>
        </CartProvider>
      </Router>
    </Provider>
  );
};

export default App;
