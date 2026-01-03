
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './store/StoreContext';
import Navbar from './components/Shared/Navbar';
import Dashboard from './components/Admin/Dashboard';
import AdminLogin from './components/Admin/AdminLogin';
import HomePage from './components/Storefront/HomePage';
import CategoryPage from './components/Storefront/CategoryPage';
import ProductPage from './components/Storefront/ProductPage';
import Cart from './components/Storefront/Cart';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated } = useStore();
  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAdmin, cart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300" dir="rtl">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
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

      {/* Global WhatsApp Cart Button */}
      {!isAdmin && !isAdminRoute && (
        <>
          <button 
            onClick={() => setCartOpen(true)}
            className="fixed bottom-10 left-10 bg-orange-600 text-white p-4 rounded-3xl z-40 hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-gray-950 shadow-lg shadow-orange-300/50 group"
          >
            <div className="relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-3 -right-3 bg-white text-orange-700 text-[10px] font-black h-6 w-6 rounded-full border-2 border-orange-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
          </button>
          
          <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
      )}
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
