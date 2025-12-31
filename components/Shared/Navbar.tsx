
"use client";

import React from 'react';
import { useStore } from '../../store/StoreContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme, isAdmin, setIsAdmin, searchTerm, setSearchTerm } = useStore();

  const t = {
    search: 'بحث عن فئات، ماركات، أو أصناف...',
    adminDashboard: 'لوحة الإدارة',
    store: 'المتجر الرئيسي',
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 py-3 md:py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4 md:gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0 group"
            onClick={() => setIsAdmin(false)}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-900 dark:bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-md">
              <span className="text-white font-black text-lg md:text-xl leading-none">H</span>
            </div>
            <span className="text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Mr Hero
            </span>
          </div>

          <div className="hidden md:flex flex-grow max-w-lg relative">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2.5 pr-10 pl-4 text-sm dark:text-gray-100 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 transition-all outline-none text-right"
              dir="rtl"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 md:p-2.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              )}
            </button>

            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-gray-900 dark:bg-emerald-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-black shadow-lg shadow-gray-200/50 dark:shadow-none hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              {isAdmin ? t.store : t.adminDashboard}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
