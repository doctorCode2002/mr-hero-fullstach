
import React, { useState } from 'react';
import { StoreProvider, useStore } from './store/StoreContext';
import Navbar from './components/Shared/Navbar';
import ProductCard from './components/Storefront/ProductCard';
import Cart from './components/Storefront/Cart';
import Dashboard from './components/Admin/Dashboard';
import { Product } from './types';
import { calculateProductPricing, formatCurrency } from './utils/calculations';

// New Admin Login Component
const AdminLogin: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(password);
    if (success) {
      onLogin?.();
      return;
    }
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 transition-colors">
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

        <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800 text-center">
          <p className="text-gray-400 text-[11px] font-bold">
            هذه المنطقة مخصصة لمسؤولي مستر هيرو فقط.
          </p>
        </div>
      </div>
    </div>
  );
};

const Storefront: React.FC = () => {
  const { products, categories, language, addToCart, isAdmin, settings, searchTerm } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const searchValue = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter(p => 
    p.isActive &&
    (selectedCategory ? p.categoryId === selectedCategory : true) &&
    (searchValue === '' ||
      p.name.en.toLowerCase().includes(searchValue) ||
      p.name.ar.toLowerCase().includes(searchValue) ||
      p.description.en.toLowerCase().includes(searchValue) ||
      p.description.ar.toLowerCase().includes(searchValue))
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
      {
        title: 'أسعار شفافة تماماً',
        desc: 'شاهد التكاليف لكل قطعة مقدماً دون أي رسوم خفية أو مفاجآت.',
        icon: '🏷️'
      },
      {
        title: 'لوجستيات متكاملة',
        desc: 'نحن نتولى الشحن والتوصيل المباشر إلى مستودعك بأمان تام.',
        icon: '🚚'
      },
      {
        title: 'جودة مضمونة 100%',
        desc: 'يتم فحص كل طبلية من قبل خبرائنا لضمان مطابقتها لأعلى المعايير.',
        icon: '🛡️'
      }
    ],
    details: {
      items: 'القطع المتوفرة في الطبلية',
      cost: 'تفصيل التكلفة',
      add: 'أضف الطبلية للسلة',
      included: 'تكلفة التوصيل مشمولة في السعر النهائي',
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
          <span className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-emerald-900/30 text-gray-900 dark:text-emerald-400 rounded-full text-xs font-black tracking-widest uppercase">{t.b2bPartner}</span>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.15]">
            {t.heroTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-2xl font-medium">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap gap-5 pt-4">
            <button 
              onClick={() => document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gray-900 dark:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-800 dark:hover:bg-emerald-700 transition-all transform active:scale-95 shadow-2xl shadow-gray-200/50 dark:shadow-none"
            >
              {t.browse}
            </button>
            <button className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
              {t.howItWorks}
            </button>
          </div>
          <div className="flex gap-8 pt-6 text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-[12px]">✓</div>
              {t.verified}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-[12px]">✓</div>
              {t.fastShipping}
            </div>
          </div>
        </div>
        <div className="flex-1 w-full animate-in fade-in zoom-in-95 duration-1000 relative">
          <div className="absolute -inset-4 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full" />
          <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-none transform hover:-rotate-1 transition-transform duration-700 border-8 border-white dark:border-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" 
              alt="المخازن" 
              className="w-full h-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800 py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {t.features.map((f, i) => (
              <div key={i} className="flex flex-col gap-6 items-center text-center group">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {f.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-bold text-sm max-w-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section id="categories-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">{t.shopByCategory}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-black text-lg max-w-2xl mx-auto">{t.shopSub}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
          {categories.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
              className={`group cursor-pointer rounded-[3.5rem] overflow-hidden border-2 transition-all duration-500 ${selectedCategory === c.id ? 'ring-[6px] ring-gray-900 dark:ring-emerald-600 border-transparent shadow-3xl scale-95' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm'}`}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={c.name[language]} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                <div className="absolute bottom-8 left-8 right-8">
                   <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-8 py-5 rounded-[2rem] flex justify-between items-center shadow-2xl border border-white/20 dark:border-gray-800/50">
                      <span className="font-black text-gray-900 dark:text-white text-lg">{c.name[language]}</span>
                      <div className="w-10 h-10 bg-gray-900 dark:bg-emerald-600 text-white rounded-2xl flex items-center justify-center transform group-hover:-translate-x-2 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Products Section */}
      {selectedCategory && (
        <section className="bg-gray-50 dark:bg-gray-900/30 py-32 border-y border-gray-100 dark:border-gray-800 transition-colors animate-in fade-in duration-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
               <div className="flex items-center gap-6">
                 <div className="w-2 h-14 bg-gray-900 dark:bg-emerald-600 rounded-full" />
                 <h3 className="text-5xl font-black text-gray-900 dark:text-white">
                  {categories.find(c => c.id === selectedCategory)?.name[language]}
                 </h3>
               </div>
               <button 
                onClick={() => setSelectedCategory(null)} 
                className="text-sm font-black text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all bg-white dark:bg-gray-800 px-10 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm active:scale-95"
               >
                 إغلاق المنتجات ✕
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
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

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-32 border-t border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg transition-colors">
                  <span className="text-white font-black text-xl">H</span>
                </div>
                <span className="text-2xl font-black dark:text-white">Mr Hero</span>
              </div>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                المنصة الرائدة في الشرق الأوسط لمبيعات الجملة ونظام الطبليات وتصفيات المخازن العالمية.
              </p>
            </div>
            {[
              { title: 'الشركة', links: ['من نحن', 'الوظائف', 'المدونة', 'الصحافة'] },
              { title: 'الدعم', links: ['مركز المساعدة', 'أسعار الشحن', 'سياسة المرتجعات', 'اتصل بنا'] },
              { title: 'قانوني', links: ['سياسة الخصوصية', 'شروط الخدمة', 'سياسة الكوكيز'] }
            ].map((col, i) => (
              <div key={i} className="space-y-8">
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] text-xs">{col.title}</h4>
                <ul className="space-y-5">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-base text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-black">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            <p dir="ltr">© 2024 Mr Hero Wholesale. All rights reserved.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md transition-all duration-300" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl rounded-[3.5rem] overflow-hidden shadow-3xl flex flex-col md:flex-row-reverse max-h-[95vh] animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 transition-colors">
             <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800 aspect-square md:aspect-auto">
                <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt="" />
             </div>
             <div className="p-10 md:p-16 md:w-1/2 overflow-y-auto flex flex-col text-right">
                <div className="flex-grow">
                  <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 rounded-full">إدراج رسمي موثق</span>
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{selectedProduct.name[language]}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold text-lg leading-relaxed">{selectedProduct.description[language]}</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-950/50 rounded-[2.5rem] p-8 space-y-5 mb-10 border border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex justify-between items-center text-base font-black">
                      <span className="text-gray-400">{t.details.items}</span>
                      <span className="text-gray-900 dark:text-white">{selectedProduct.itemsPerPallet} قطعة</span>
                    </div>
                    <div className="flex justify-between items-center text-base font-black">
                      <span className="text-gray-400">سعر القطعة الصافي</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(selectedProduct.sellingPricePerItemILS, 'ILS', language)}</span>
                    </div>
                    <div className="pt-8 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-end">
                      <div className="space-y-1">
                         <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">إجمالي الطبلية (شامل التوصيل)</span>
                         <p className="text-4xl font-black text-gray-900 dark:text-white leading-none">
                           {formatCurrency(calculateProductPricing(selectedProduct, settings.conversionRate).totalSellingPricePerPalletILS, 'ILS', language)}
                         </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-center text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest pt-4">{t.details.included}</p>
                  </div>
                </div>

                <div className="flex gap-5">
                   <button 
                    onClick={() => { addToCart(selectedProduct.id, 1); setSelectedProduct(null); }}
                    className="flex-grow bg-emerald-600 dark:bg-emerald-500 text-white py-6 rounded-3xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-200 dark:shadow-none"
                   >
                     {t.details.add}
                   </button>
                   <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-3xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                   >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="fixed bottom-10 left-10 bg-[#25D366] text-white p-6 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] z-40 hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-gray-950 group"
        >
          <div className="relative">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-4 -right-4 bg-red-500 text-[11px] font-black h-7 w-7 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              {useStore().cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
        </button>
      )}

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAdmin, isAdminAuthenticated } = useStore();
  
  // Decide what to show based on states
  const renderView = () => {
    if (isAdmin) {
      if (isAdminAuthenticated) {
        return <Dashboard />;
      } else {
        return <AdminLogin />;
      }
    }
    return <Storefront />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300" dir="rtl">
      <Navbar />
      <div className="animate-in fade-in duration-700">
        {renderView()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
