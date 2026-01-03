
"use client";

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme, searchTerm, setSearchTerm } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const t = {
    search: 'بحث عن فئات، ماركات، أو أصناف...',
    adminDashboard: 'لوحة الإدارة',
    store: 'المتجر الرئيسي',
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b-2 border-primary-400 py-3 md:py-4 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4 md:gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0 group"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center justify-center transition-all group-hover:scale-105 drop-shadow-sm">
              <img src="/logo.png" alt="Mr Hero" className="h-24 w-auto object-contain" />
            </div>
          </div>

          <div className="hidden md:flex flex-grow max-w-lg relative">
            {/* Search moved to HomePage */}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             {/* Admin button removed, accessible via /admin */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
