
"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { HiOutlineShoppingCart, HiOutlineSearch, HiMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { cart } = useStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const hasItems = cart.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <nav className="static z-50 bg-white border-b border-gray-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
            <img src="/logo.png" alt="Mr Hero Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-2xl tracking-tight text-orange-500">مستر هيرو</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a
              onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
              className="text-gray-600 hover:text-orange-500 font-medium px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
              الرئيسية
            </a>
            <a
              onClick={() => {
                if (window.location.pathname !== '/') {
                   navigate('/');
                   setTimeout(() => {
                     document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' });
                   }, 100);
                } else {
                   document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-600 hover:text-orange-500 font-medium px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
              الأصناف
            </a>
            <a
              className="text-gray-600 hover:text-orange-500 font-medium px-3 py-2 rounded-md transition-colors cursor-pointer"
              onClick={() => navigate('/category/all')}
            >
              عروض الباليتات
            </a>
            <a
              onClick={() => navigate('/about')}
              className="text-gray-600 hover:text-orange-500 font-medium px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
              من نحن
            </a>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={onCartClick}
              className="p-2 cursor-pointer text-gray-500 hover:text-orange-500 transition-colors relative"
            >
              <span className="text-2xl"><HiOutlineShoppingCart /></span>
              {hasItems && (
                <span className="absolute top-2 left-2 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              )}
            </button>
            <button 
              onClick={() => setSearchOpen(true)}
              className="md:hidden cursor-pointer p-2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <span className="text-2xl"><HiOutlineSearch /></span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 cursor-pointer text-gray-500 hover:text-orange-500 transition-colors"
            >
              <span className="text-2xl"><HiMenuAlt3 /></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 bottom-0 right-0 w-[80%] bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">القائمة</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="text-2xl"><HiOutlineX /></span>
              </button>
            </div>
            <nav className="space-y-4">
              <a
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                className="block text-gray-600 hover:text-orange-500 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                الرئيسية
              </a>
              <a
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (window.location.pathname !== '/') {
                     navigate('/');
                     setTimeout(() => {
                       document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' });
                     }, 100);
                  } else {
                     document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-gray-600 hover:text-orange-500 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                الأصناف
              </a>
              <a
                className="block text-gray-600 hover:text-orange-500 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => { navigate('/category/all'); setMobileMenuOpen(false); }}
              >
                عروض الباليتات
              </a>
              <a
                onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}
                className="block text-gray-600 hover:text-orange-500 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                من نحن
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Search */}
      {searchOpen && (
        <div className="fixed inset-0 z-[120] md:hidden flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-gray-900">البحث</h2>
              <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="text-xl"><HiOutlineX /></span>
              </button>
            </div>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 text-xl"><HiOutlineSearch /></span>
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-orange-500 rounded-xl py-3 pr-12 pl-4 text-right font-bold outline-none transition-all"
                  dir="rtl"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
              >
                بحث
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
