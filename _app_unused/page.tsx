
"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/StoreContext';
import Navbar from '../components/Shared/Navbar';
import ProductCard from '../components/Storefront/ProductCard';
import Cart from '../components/Storefront/Cart';
import Dashboard from '../components/Admin/Dashboard';
import { Product } from '../types';
import { calculateProductPricing, formatCurrency } from '../utils/calculations';

// Admin Login Component
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 transition-colors">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-900 dark:bg-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-black text-3xl">H</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">دخول المسؤول</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">يرجى إدخال كلمة المرور للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-800 border-2 ${error ? 'border-red-500' : 'border-transparent'} focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl py-5 px-6 outline-none text-gray-900 dark:text-white font-black transition-all shadow-inner text-right`}
                placeholder="••••••••"
                dir="rtl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-[10px] font-black mt-2 text-right">كلمة المرور غير صحيحة، حاول مجدداً.</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gray-200 dark:shadow-none mt-4"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

const Storefront: React.FC = () => {
  const { products, categories, language, addToCart, isAdmin } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = products.filter(p => 
    p.isActive && (selectedCategory ? p.categoryId === selectedCategory : true)
  );

  const t = {
    b2bPartner: 'شريك مبيعات الجملة B2B الموثوق',
    heroTitle: 'ملابس بالجملة بنظام الطبلية المتكاملة',
    heroSub: 'مخزون عالي الجودة لعملك التجاري. أسعار شفافة وشحن مباشر إلى مستودعك في جميع أنحاء البلاد.',
    browse: 'تصفح جميع الفئات',
    howItWorks: 'كيفية العمل',
    verified: 'مخزون موثق ومفحوص',
    fastShipping: 'شحن سريع ومضمون',
    shopByCategory: 'تسوق حسب الفئة',
    shopSub: 'استكشف مجموعتنا الواسعة من طبليات الملابس الفاخرة المخصصة للتجار.',
    features: [
      { title: 'أسعار شفافة تماماً', desc: 'شاهد التكاليف لكل قطعة مقدماً دون أي رسوم خفية.', icon: '🏷️' },
      { title: 'لوجستيات متكاملة', desc: 'نتولى الشحن والتوصيل المباشر إلى مستودعك.', icon: '🚚' },
      { title: 'جودة مضمونة 100%', desc: 'يتم فحص كل طبلية لضمان مطابقتها للمعايير.', icon: '🛡️' }
    ],
    details: {
      items: 'القطع المتوفرة في الطبلية',
      cost: 'تفصيل التكلفة',
      add: 'أضف الطبلية للسلة',
      included: 'التوصيل مشمول في السعر',
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16 overflow-hidden">
        <div className="flex-1 space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-6 duration-700 text-center md:text-right">
          <span className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-emerald-900/30 text-gray-900 dark:text-emerald-400 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase">{t.b2bPartner}</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.2] md:leading-[1.15]">
            {t.heroTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 font-medium">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gray-900 dark:bg-emerald-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-gray-800 dark:hover:bg-emerald-700 transition-all transform active:scale-95 shadow-xl md:shadow-2xl shadow-gray-200/50 dark:shadow-none"
            >
              {t.browse}
            </button>
            <button className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
              {t.howItWorks}
            </button>
          </div>
        </div>
        <div className="flex-1 w-full animate-in fade-in zoom-in-95 duration-1000 relative">
          <div className="absolute -inset-4 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full" />
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none transform md:hover:-rotate-1 transition-transform duration-700 border-4 md:border-8 border-white dark:border-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" 
              alt="المخازن" 
              className="w-full h-[350px] md:h-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800 py-16 md:py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {t.features.map((f, i) => (
              <div key={i} className="flex flex-col gap-4 md:gap-6 items-center text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {f.icon}
                </div>
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-bold text-xs md:text-sm max-w-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mb-12 md:mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">{t.shopByCategory}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-black text-base md:text-lg max-w-2xl mx-auto px-4">{t.shopSub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {categories.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
              className={`group cursor-pointer rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-2 transition-all duration-500 ${selectedCategory === c.id ? 'ring-[4px] md:ring-[6px] ring-gray-900 dark:ring-emerald-600 border-transparent scale-95 md:scale-95' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm'}`}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={c.name[language]} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
                   <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] flex justify-between items-center shadow-2xl border border-white/20 dark:border-gray-800/50">
                      <span className="font-black text-gray-900 dark:text-white text-base md:text-lg">{c.name[language]}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 dark:bg-emerald-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center transform group-hover:-translate-x-2 transition-all">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedCategory && (
        <section className="bg-gray-50 dark:bg-gray-900/30 py-20 md:py-32 border-y border-gray-100 dark:border-gray-800 transition-colors animate-in fade-in duration-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 gap-6 md:gap-8">
               <div className="flex items-center gap-4 md:gap-6">
                 <div className="w-1.5 md:w-2 h-10 md:h-14 bg-gray-900 dark:bg-emerald-600 rounded-full" />
                 <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">
                  {categories.find(c => c.id === selectedCategory)?.name[language]}
                 </h3>
               </div>
               <button 
                onClick={() => setSelectedCategory(null)} 
                className="w-full md:w-auto text-sm font-black text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all bg-white dark:bg-gray-800 px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm active:scale-95"
               >
                 إغلاق المنتجات ✕
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {filteredProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onViewDetails={(prod) => setSelectedProduct(prod)} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-hidden">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md transition-all duration-300" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white dark:bg-gray-900 w-full h-full md:h-auto md:max-w-5xl md:rounded-[3rem] overflow-hidden shadow-3xl flex flex-col md:flex-row-reverse animate-in zoom-in-95 duration-200 border-none md:border border-gray-100 dark:border-gray-800">
             <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800 h-[40vh] md:h-auto">
                <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt="" />
             </div>
             <div className="p-8 md:p-16 md:w-1/2 overflow-y-auto flex flex-col text-right">
                <div className="flex-grow">
                  <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 rounded-full">إدراج رسمي موثق</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">{selectedProduct.name[language]}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 md:mb-10 font-bold text-sm md:text-lg leading-relaxed">{selectedProduct.description[language]}</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-950/50 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 space-y-4 md:space-y-5 mb-8 md:mb-10 border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center text-sm md:text-base font-black">
                      <span className="text-gray-400">{t.details.items}</span>
                      <span className="text-gray-900 dark:text-white">{selectedProduct.itemsPerPallet} قطعة</span>
                    </div>
                    <div className="flex justify-between items-center text-sm md:text-base font-black">
                      <span className="text-gray-400">سعر القطعة الصافي</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(selectedProduct.sellingPricePerItemILS, 'ILS', language)}</span>
                    </div>
                    <div className="pt-6 md:pt-8 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-end">
                      <div className="space-y-1">
                         <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">إجمالي الطبلية</span>
                         <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-none">
                           {formatCurrency(calculateProductPricing(selectedProduct).totalSellingPricePerPalletILS, 'ILS', language)}
                         </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 md:gap-5">
                   <button 
                    onClick={() => { addToCart(selectedProduct.id, 1); setSelectedProduct(null); }}
                    className="flex-grow bg-emerald-600 dark:bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg md:text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                   >
                     {t.details.add}
                   </button>
                   <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                   >
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* WhatsApp Cart Button */}
      {!isAdmin && (
        <button 
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:left-10 bg-[#25D366] text-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_15px_30px_-5px_rgba(37,211,102,0.4)] z-40 hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-gray-950 group"
        >
          <div className="relative">
            <svg className="w-7 h-7 md:w-9 md:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-red-500 text-[10px] md:text-[11px] font-black h-6 w-6 md:h-7 md:w-7 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center shadow-lg">
              {useStore().cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
        </button>
      )}

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default function Home() {
  const { isAdmin } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const renderView = () => {
    if (isAdmin) {
      if (isAuthenticated) {
        return <Dashboard />;
      } else {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
      }
    }
    return <Storefront />;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="animate-in fade-in duration-700">
        {renderView()}
      </main>
    </div>
  );
}
