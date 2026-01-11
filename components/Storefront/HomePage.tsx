
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { HiOutlineSearch, HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineTrendingUp, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineChartBar, HiOutlineCollection, HiOutlineSupport } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const { categories, products, language } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Get latest 4 products for "Latest Pallets" section
  const latestProducts = products.slice(0, 4);

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    products.some(p => p.categoryId === cat.id && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white font-tajawal">
      {/* Hero Section */}
      <section className="relative bg-orange-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-300/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-gray-800">أفضل منصة لتجارة الجملة</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1]">
                ابدأ تجارتك <br />
                <span className="text-orange-500 relative inline-block">
                  الناجحة
                  <div className="absolute w-full h-2 bottom-1 right-0 bg-orange-200/60 -z-10 rounded-full"></div>
                </span>
                <br />
                 مع مستر هيرو
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                نوفر لك أفضل البضائع العالمية بأسعار الجملة التنافسية. ابدأ رحلتك التجارية اليوم وحقق أرباحاً مضمونة.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-orange-500 hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-all  hover:-translate-y-1"
                >
                  تصفح الأصناف
                </button>
                {/* <button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1">
                  كيف نبدأ ؟
                </button> */}
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=2" alt="Client" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=3" alt="Client" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                    +1k
                  </div>
                </div>
                <div>
                  <div className="flex text-yellow-500 text-lg">
                    {'★★★★★'}
                  </div>
                  <p className="text-sm text-gray-500 font-bold">عميل يثق بنا</p>
                </div>
              </div>
            </div>
            <div className="relative animate-in slide-in-from-left-10 duration-1000">
              <div className="relative z-10 bg-white rounded-[3rem] p-4 shadow-2xl">
                <img 
                  src="data:image/jpeg;base64,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" 
                  alt="Hero" 
                  className="rounded-[2.5rem] w-full h-[500px] object-cover"
                />
                
                {/* Floating Cards */}
                <div className="absolute top-10 -right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce border border-white/50">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <HiOutlineTrendingUp className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold">توفير يصل إلى</p>
                        <p className="text-xl font-black text-gray-900">70٪</p>
                    </div>
                </div>

                <div className="absolute bottom-10 -left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse border border-white/50">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <HiOutlineTruck className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold">شحن سريع</p>
                        <p className="text-base font-black text-gray-900">لجميع المناطق</p>
                    </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-orange-600 rounded-[3rem] rotate-6 opacity-20 blur-xl -z-10 transform translate-y-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="bg-white pt-12 pb-6">
        <div className="max-w-xl mx-auto px-4">
          <div className="relative group shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
            <HiOutlineSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500 text-2xl group-focus-within:scale-110 transition-transform" />
            <input 
              type="text" 
              placeholder="ابحث عن باليتة أو صنف..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-4 border-orange-50 py-6 pr-16 pl-8 rounded-3xl outline-none focus:border-orange-500 focus:ring-8 focus:ring-orange-500/5 transition-all font-bold text-xl text-right"
              dir="rtl"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-grid" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-gray-900 mb-4">تصفح حسب الأصناف</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    اختر الصنف المناسب لتجارتك من مجموعتنا الواسعة من المنتجات عالية الجودة
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredCategories.map((category) => (
                    <div 
                        key={category.id}
                        onClick={() => navigate(`/category/${category.id}`)}
                        className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-xl hover:shadow-orange-500/20 transition-all duration-500 border-4 border-orange-500/30 hover:border-orange-500/70 "
                    >
                        <img 
                            src={category.image} 
                            alt={category.name} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        
                        <div className="absolute bottom-4 left-4 right-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-xl font-black text-white mb-1">{category.name}</h3>
                            <div className="flex items-center gap-2 text-white font-bold text-xs">
                                <span>تصفح الآن</span>
                                <HiOutlineArrowLeft className="text-sm" />
                            </div>
                        </div>
                        
                        <div className="absolute top-6 right-6 w-12 h-12 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 rotate-12 group-hover:rotate-0">
                            <HiOutlineCollection className="text-2xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Latest Pallets Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">أحدث باليتات الجملة</h2>
                    <p className="text-gray-500 text-lg">وصل حديثاً لمستودعاتنا</p>
                </div>
                <button 
                  onClick={() => navigate('/category/all')}
                  className="hidden cursor-pointer md:flex items-center gap-2 text-orange-500 font-bold hover:text-primary-hover transition-colors"
                >
                    <span>عرض الكل</span>
                    <HiOutlineArrowLeft className="text-lg" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {latestProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onViewDetails={(p) => navigate(`/product/${p.id}`)} 
                    />
                ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
                <button 
                  onClick={() => navigate('/category/all')}
                  className="bg-white border-2 border-gray-100 text-gray-900 px-8 py-3 rounded-xl font-bold w-full"
                >
                    عرض الكل
                </button>
            </div>
        </div>
      </section>

      {/* Features / Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center md:text-right">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-white">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto md:mr-0 text-orange-500">
                            <HiOutlineUserGroup className="text-3xl" />
                        </div>
                        <div>
                            <h4 className="text-5xl font-black text-orange-500">+10,000</h4>
                            <p className="text-gray-400 font-medium text-lg">عميل مسجل</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto md:mr-0 text-orange-500">
                            <HiOutlineChartBar className="text-3xl" />
                        </div>
                        <div>
                            <h4 className="text-5xl font-black text-orange-500">50M+</h4>
                            <p className="text-gray-400 font-medium text-lg">مبيعات سنوية</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto md:mr-0 text-orange-500">
                            <HiOutlineCollection className="text-3xl" />
                        </div>
                        <div>
                            <h4 className="text-5xl font-black text-orange-500">+50</h4>
                            <p className="text-gray-400 font-medium text-lg">تصنيف متنوع</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto md:mr-0 text-orange-500">
                            <HiOutlineSupport className="text-3xl" />
                        </div>
                        <div>
                            <h4 className="text-5xl font-black text-orange-500">24/7</h4>
                            <p className="text-gray-400 font-medium text-lg">دعم متواصل</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
