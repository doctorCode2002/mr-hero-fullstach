
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
          <span className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-black tracking-widest uppercase border border-orange-100">{t.b2bPartner}</span>
          <h1 className="text-3xl md:text-6xl font-black text-gray-900 leading-tight">
            {t.heroTitle.split(' ').map((word, i) => i === t.heroTitle.split(' ').length - 1 ? <span key={i} className="text-orange-600">{word}</span> : word + ' ')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-2xl font-medium">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap gap-5 pt-4">
            <button 
              onClick={() => document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white-600 hover:border-white-600 border-orange-500 border-2 text-orange-500 px-10 py-5 rounded-2xl font-black text-xl hover:bg-orange-500 hover:text-white transition-all transform active:scale-95 "
            >
              {t.browse}
            </button>
            {/* <button className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
              {t.howItWorks}
            </button> */}
          </div>
          <div className="flex gap-8 pt-6 text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-[12px]">✓</div>
              {t.verified}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-[12px]">✓</div>
              {t.fastShipping}
            </div>
          </div>
        </div>
        <div className="flex-1 w-full animate-in fade-in zoom-in-95 duration-1000 relative">
          <div className="absolute -inset-4 bg-orange-500/10 dark:bg-orange-500/5 blur-[100px] rounded-full" />
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
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-orange-500 transition-all duration-500">
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
      <section id="categories-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-orange-50 rounded-[3rem] my-10">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">{t.shopByCategory}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-black text-lg max-w-2xl mx-auto">{t.shopSub}</p>
        </div>
        <div className="mb-12 relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t.search} // You might need to add 'search' to t object or use literal
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-transparent focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 rounded-2xl py-4 pr-12 pl-6 text-lg shadow-sm transition-all outline-none text-right placeholder-gray-400"
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
              className="group cursor-pointer rounded-[3.5rem] overflow-hidden border-4 border-transparent transition-all duration-500 hover:border-orange-500 hover:shadow-[0_10px_40px_-10px_rgba(254,102,1,0.3)] shadow-sm bg-white dark:bg-gray-900"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={c.name[language]} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                   <div className="glass-effect bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-2 py-2 md:px-4 md:py-3 rounded-[2rem] flex justify-between items-center shadow-xl border border-white/20 dark:border-gray-800/50 gap-2 group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors duration-300">
                      <span className="font-black text-gray-900 text-sm md:text-lg truncate group-hover:text-white transition-colors px-2">{c.name[language]}</span>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-orange-600 rounded-full flex-shrink-0 flex items-center justify-center transform group-hover:-translate-x-1 transition-all group-hover:bg-white group-hover:text-orange-500">
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

      {/* Trust / Testimonials Strip */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            <div className="flex-1 space-y-4 text-center md:text-right">
              <span className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-black tracking-widest uppercase border border-orange-100">
                موثوقية التجار
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">شركاء يعتمد عليهم</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                نضمن لك انتقاء الموردين والتحقق من جودة البضائع مع متابعة من فريق مختص بالعقود والشحن.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {['+500 شحنة ناجحة', 'دعم عربي كامل', 'سياسات وضوح الأسعار'].map((badge) => (
                  <span key={badge} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs font-black tracking-widest">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { title: 'شهادات التجار', desc: '“استلمنا الطلبيات في الوقت المحدد وبجودة ممتازة” – تاجر جملة في الرياض', icon: '💬' },
                { title: 'ضمان التحقق', desc: 'فريق تدقيق يراجع كل صفقة ويؤكد المواصفات قبل الشحن.', icon: '✅' },
                { title: 'دفع آمن', desc: 'خيارات دفع مرنة مع إيصالات وفواتير واضحة.', icon: '💳' },
                { title: 'تتبع الطلبات', desc: 'لوحة تتبع للشحنات مع تحديثات مباشرة.', icon: '📦' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-black mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logistics & Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-br from-orange-700 via-orange-600 to-orange-700 rounded-[3rem] overflow-hidden shadow-[0_30px_80px_-30px_rgba(249,115,22,0.6)] text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_10%_80%,rgba(255,255,255,0.08),transparent_20%)] opacity-50 pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 relative">
            {[
              { title: 'شحن سريع ومؤمن', desc: 'خيارات شحن بري وجوي مع تأمين على البضائع.', icon: '🚚' },
              { title: 'إرجاع واستبدال', desc: 'سياسة إرجاع واضحة للعيوب التصنيعية خلال 7 أيام.', icon: '↩️' },
              { title: 'دعم مباشر', desc: 'فريق دعم متواجد عبر واتساب والهاتف خلال ساعات العمل.', icon: '🤝' },
            ].map((item) => (
              <div key={item.title} className="p-10 flex flex-col gap-3 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">{item.icon}</div>
                <h3 className="text-2xl font-black drop-shadow-sm">{item.title}</h3>
                <p className="text-sm md:text-base text-white/90 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="px-8 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/10 backdrop-blur relative">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] font-black text-white/80 drop-shadow-sm">جاهزون للطلب؟</p>
              <h4 className="text-2xl md:text-3xl font-black drop-shadow-sm">تحدث مع منسق اللوجستيات الآن</h4>
            </div>
            <button
              className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
              onClick={() => window.open('https://wa.me/1234567890', '_blank')}
            >
              تواصل عبر واتساب
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default HomePage;
