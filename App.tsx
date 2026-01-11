import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './store/StoreContext';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Dashboard from './components/Admin/Dashboard';
import AdminLogin from './components/Admin/AdminLogin';
import HomePage from './components/Storefront/HomePage';
import CategoryPage from './components/Storefront/CategoryPage';
import ProductPage from './components/Storefront/ProductPage';
import AboutPage from './components/Storefront/AboutPage';
import Cart from './components/Storefront/Cart';
import OrderConfirmation from './components/Storefront/OrderConfirmation';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated } = useStore();
  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }
  return <>{children}</>;
};

import NotificationManager from './components/Shared/NotificationManager';

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { isAdmin, cart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background-light transition-colors duration-300 flex flex-col" dir="rtl">
      <ScrollToTop />
      {!isAdminRoute && <Navbar onCartClick={() => setCartOpen(true)} />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      {!isAdmin && !isAdminRoute && (
        <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      )}

      <NotificationManager />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
};

export default App;
