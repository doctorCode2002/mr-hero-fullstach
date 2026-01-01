
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { Product } from '../../types';

const HomePage: React.FC = () => {
  const { categories, language, isAdmin, searchTerm, setSearchTerm } = useStore();
  const navigate = useNavigate();
  
  // Only show generic/featured products or all products if no category selected (since categories have their own pages now)
  // Actually, standard homepage usually shows "Popular" or just categories.
  // The original code had "Category Grid" AND "Products Section" (filtered by selected category).
  // Now, clicking a category should Navigate.
  // So the Homepage should likely just show the Hero, Features, and Category Grid.
  // Maybe a "Featured Products" section at the bottom?
  // I will keep the "Products" section but maybe show ALL products or just remove the category filter part.
  
  // Let's modify: Clicking category -> navigate.
  // Below checks if we need to show products.

  const t = {
    b2bPartner: 'شريك مبيعات الجملة B2B الموثوق',
    heroTitle: 'ملابس بالجملة بنظام الطبلية المتكاملة',
    heroSub: 'تصفح مخزوننا الضخم من البضائع المخفضة، الطبليات، والمزيد. أسعار لا تقبل المنافسة للتجار وأصحاب الأعمال.',
    cta: 'تصفح العروض',
    features: [
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
    },
    shopByCategory: 'تسوق حسب الفئة',
    shopSub: 'استكشف مجموعتنا الواسعة من الفئات لتجد ما يناسب تجارتك.',
    search: 'ابدأ البحث...',
    browse: 'تصفح الآن',
    howItWorks: 'كيف نعمل',
    verified: 'مخزون موثوق',
    fastShipping: 'شحن سريع'
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
        <div className="mb-12 relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t.search} // You might need to add 'search' to t object or use literal
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-4 pr-12 pl-6 text-lg dark:text-white shadow-sm transition-all outline-none text-right placeholder-gray-400"
              dir="rtl"
            />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.filter(c => 
             searchTerm === '' || 
             c.name.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
             c.name.ar.includes(searchTerm)
          ).map((c) => (
            <div 
              key={c.id} 
              onClick={() => navigate(`/category/${c.id}`)}
              className="group cursor-pointer rounded-[3.5rem] overflow-hidden border-2 transition-all duration-500 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={c.name[language]} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
                   <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-5 py-4 md:px-8 md:py-5 rounded-[1.5rem] md:rounded-[2rem] flex justify-between items-center shadow-2xl border border-white/20 dark:border-gray-800/50 gap-3">
                      <span className="font-black text-gray-900 dark:text-white text-base md:text-lg truncate">{c.name[language]}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 dark:bg-emerald-600 text-white rounded-xl md:rounded-2xl flex-shrink-0 flex items-center justify-center transform group-hover:-translate-x-2 transition-all">
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

      {/* Footer */}
    </div>
  );
};

export default HomePage;
