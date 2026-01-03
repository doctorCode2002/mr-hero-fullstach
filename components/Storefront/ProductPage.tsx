
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { calculateProductPricing } from '../../utils/calculations';
import FormattedPrice from '../Shared/FormattedPrice';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { products, language, addToCart, settings, isLoading } = useStore();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    const product = products.find(p => p.id === productId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    if(isLoading) {
         return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">المنتج غير موجود</h2>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
                >
                    العودة للرئيسية
                </button>
            </div>
        );
    }

    const pricing = calculateProductPricing(product, settings.conversionRate);
    
    const handleAddToCart = () => {
        addToCart(product.id, 1);
        setIsAdding(true);
        setTimeout(() => setIsAdding(false), 2000);
    };

    const t = {
        back: 'عودة',
        itemsPerPallet: 'قطع / طبلية',
        pricePerItem: 'سعر القطعة',
        pricePerPallet: 'سعر الطبلية',
        margin: 'هامش الربح',
        addToCart: 'إضافة للسلة',
        added: 'تمت الإضافة بنجاح',
        desc: 'وصف المنتج',
        deliveryIncluded: 'السعر شامل التوصيل',
        profit: 'ربح متوقع'
    };

    return (
        <div className="min-h-screen bg-orange-50 dark:bg-gray-950/50 pt-20 pb-20 animate-in fade-in duration-500">
            {/* Breadcrumb / Back */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                 <button 
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold transition-colors"
                >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t.back}
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-orange-100 dark:border-gray-800 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x lg:divide-x-reverse divide-orange-100 dark:divide-gray-800">
                        
                        {/* Right Column: Gallery (RTL: actually appears on right visually, but first in DOM normally. Flex-row-reverse or grid handles it) */}
                        {/* Note: In RTL grid-cols-2, the first element is on the right. */}
                        
                        <div className="p-6 md:p-10 lg:p-12 space-y-6">
                            {/* Main Image */}
                            <div className="aspect-square w-full bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-700 relative group">
                                <img 
                                    src={product.images[selectedImageIndex]} 
                                    alt={product.name[language]}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                                />
                                <div className="absolute top-6 right-6 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl border-4 border-white z-10">
                                    {t.margin} {pricing.profitMarginPercent.toFixed(1)}%
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                                selectedImageIndex === idx 
                                                ? 'border-orange-500 shadow-lg scale-95' 
                                                : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Left Column: Details */}
                        <div className="p-6 md:p-10 lg:p-12 flex flex-col h-full bg-orange-50/30 dark:bg-gray-900/50">
                            <div className="mb-0">
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                                    {product.name[language]}
                                </h1>
                                
                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-orange-100 dark:border-gray-700">
                                        <span className="text-[10px] uppercase tracking-widest text-orange-400 font-black block mb-1">{t.itemsPerPallet}</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white english-nums">{product.itemsPerPallet}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-orange-100 dark:border-gray-700">
                                        <span className="text-[10px] uppercase tracking-widest text-orange-400 font-black block mb-1">{t.pricePerItem}</span>
                                        <FormattedPrice amount={pricing.wholesalePricePerItemILS} currency="ILS" className="text-xl font-black text-gray-900 dark:text-white" />
                                    </div>
                                </div>

                                <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{t.desc}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-medium">
                                        {product.description[language]}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-8">
                                    <div>
                                        <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">{t.profit}</p>
                                        <div className="flex items-center gap-2">
                                            <FormattedPrice amount={pricing.totalPotentialProfitPerPalletILS} currency="ILS" className="text-3xl font-black text-orange-600" />
                                            <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-lg">لكل طبلية</span>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t.pricePerPallet}</p>
                                        <FormattedPrice amount={pricing.wholesalePricePerPalletILS} currency="ILS" className="text-4xl font-black text-gray-900 dark:text-white" />
                                        <p className="text-[10px] text-gray-400 font-bold mt-1">{t.deliveryIncluded}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 border-b-4 active:border-b-0 active:translate-y-1 ${
                                        isAdding 
                                        ? 'bg-gray-900 text-orange-500 border-gray-900' 
                                        : 'bg-orange-500 text-white border-orange-700 hover:bg-orange-400 hover:border-orange-600'
                                    }`}
                                >
                                     {isAdding ? (
                                        <>
                                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t.added}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            {t.addToCart}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductPage;
