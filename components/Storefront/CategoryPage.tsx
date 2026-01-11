
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import ProductCard from './ProductCard';
import { Product } from '../../types';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, categories, language, addToCart } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const category = categories.find(c => c.id === categoryId);
  const isAllCategory = categoryId === 'all';
  
  if (!category && !isAllCategory && categories.length > 0) {
      return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-10">
              <h2 className="text-2xl font-black text-gray-900 mb-4">الفئة غير موجودة</h2>
              <button 
                  onClick={() => navigate('/')}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold"
              >
                  العودة للرئيسية
              </button>
          </div>
      )
  }

  const categoryProducts = products.filter(p => 
    (isAllCategory ? true : p.categoryId === categoryId) && 
    p.isActive &&
    (searchTerm === '' || p.name.includes(searchTerm))
  );

  return (
    <div className="animate-in fade-in duration-700">
      {/* Category Header */}
      <section className="bg-orange-50 pt-20 pb-32 border-b-4 border-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
            <button 
                onClick={() => navigate('/')}
                className="group mb-8 flex items-center gap-3 text-orange-700 hover:text-orange-900 transition-all w-fit p-2 -mr-2 rounded-xl active:bg-orange-100 touch-manipulation"
            >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white group-hover:scale-110 transition-all text-orange-600">
                    <svg className="w-5 h-5 md:w-6 md:h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                <span className="font-black text-lg md:text-xl">العودة للرئيسية</span>
            </button>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img src={isAllCategory ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' : category?.image} className="w-full h-full object-cover" alt={isAllCategory ? 'جميع المنتجات' : category?.name} />
                </div>
                <div className="text-center md:text-right">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
                        {isAllCategory ? 'جميع المنتجات' : category?.name}
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        {isAllCategory ? 'تصفح جميع منتجاتنا المتاحة' : `استكشف أحدث المنتجات في قسم ${category?.name[language]}`}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
        <div className="relative shadow-xl rounded-2xl">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-orange-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-4 border-white focus:border-orange-500 rounded-2xl py-5 pr-14 pl-6 text-lg font-bold transition-all outline-none text-right placeholder-gray-400 focus:ring-4 focus:ring-orange-500/20"
              dir="rtl"
            />
        </div>
      </div>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categoryProducts.length === 0 ? (
             <div className="text-center py-20">
                <p className="text-xl text-gray-400 font-black">لا توجد منتجات حالياً في هذا القسم.</p>
             </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {categoryProducts.map(p => (
                    <ProductCard 
                        key={p.id} 
                        product={p} 
                        onViewDetails={(prod) => navigate(`/product/${prod.id}`)} 
                    />
                ))}
            </div>
        )}
      </section>

      {/* Re-use Product Detail Modal Logic (Can be extracted to shared component later) */}
      {selectedProduct && (
         /* ... Simple re-implementation or shared component. For now I'll just render nothing or use the existing modal if refactored. 
            Actually, to keep it clean, I should probably expose the "Product Modal" as a global context or shared component.
            For this task, I will leave the modal specific to this page or refactor App.tsx to handle it globaly?
            
            Better: I'll include the modal markup here or move it to a shared component.
            Let's keep it simple and just show the modal inline here for now similarly to App.tsx
         */
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md transition-all duration-300" onClick={() => setSelectedProduct(null)} />
             {/* ... Modal content similar to App.tsx but simplified for this view ... */}
             <div className="relative bg-white w-full max-w-lg p-10 rounded-3xl z-10 text-center">
                 <h2 className="text-2xl font-black mb-4">{selectedProduct.name[language]}</h2>
                 <p className="mb-6 text-gray-500">{selectedProduct.description[language]}</p>
                 <button 
                    onClick={() => { addToCart(selectedProduct.id, 1); setSelectedProduct(null); }}
                    className="bg-orange-600 cursor-pointer text-white w-full py-4 rounded-xl font-bold hover:bg-orange-700"
                 >
                     إضافة للسلة
                 </button>
             </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
