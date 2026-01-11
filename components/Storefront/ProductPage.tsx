import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { calculateProductPricing } from '../../utils/calculations';
import FormattedPrice from '../Shared/FormattedPrice';
import { calculateItemPalletContribution } from '../../utils/calculations';
import { HiOutlineArrowRight, HiOutlineStar, HiOutlineTrendingUp, HiOutlineShoppingCart, HiOutlineBookmark, HiOutlineCheckCircle, HiOutlineTruck } from 'react-icons/hi';

const ProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, language, settings, addToCart } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === productId);

  if (!product) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900">المنتج غير موجود</h2>
              <button 
                  onClick={() => navigate('/')} 
                  className="mt-4 text-orange-500 font-bold hover:underline"
              >
                  العودة للرئيسية
              </button>
          </div>
      );
  }

  const pricing = calculateProductPricing(product, settings.conversionRate);

  const handleAddToCart = () => {
      addToCart(product.id, quantity);
      // Stay on the same page - notification will show via NotificationManager
  };

  return (
    <div className="bg-white min-h-screen py-10 transition-colors duration-300 font-tajawal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <button 
            onClick={() => navigate(-1)}
            className="mb-8 cursor-pointer flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-bold"
        >
            <span className="text-xl"><HiOutlineArrowRight /></span>
            <span>عودة</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-6">
                <div className="aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden border-2 border-gray-100 relative shadow-lg">
                    <img 
                        src={product.images[selectedImageIndex]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-orange-600 px-4 py-2 rounded-xl font-black shadow-sm border border-orange-100">
                        للطبلية
                    </div>
                </div>
                {product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden border-2 transition-all ${
                                    selectedImageIndex === idx 
                                    ? 'border-orange-500 ring-2 ring-orange-500/30' 
                                    : 'border-transparent hover:border-orange-200'
                                }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="space-y-8 animate-in slide-in-from-left-10 duration-700">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg">
                            {product.itemsPerPallet} قطعة / طبلية
                        </span>
                        <span className="flex items-center gap-1 text-yellow-500">
                            <span className="text-base"><HiOutlineStar /></span>
                            <span>4.9 (١٢٠ تقييم)</span>
                        </span>
                    </div>
                </div>

                <div className="prose prose-lg text-gray-500 leading-relaxed">
                    <p>{product.description}</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl">
                        <p className="text-sm text-gray-500 font-bold mb-1">سعر القطعة (بالجملة)</p>
                        <FormattedPrice 
                            amount={product.baseCostEGP} 
                            currency="EGP" 
                            className="text-2xl font-black text-gray-900"
                        />
                        <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1">
                            <span className="text-sm"><HiOutlineTrendingUp /></span>
                            فرصة ربح عالية
                        </p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-200/50 rounded-full blur-2xl"></div>
                        <p className="text-sm text-orange-800 font-bold mb-1">ربحك المتوقع (للطبلية)</p>
                        <FormattedPrice 
                            amount={pricing.profitPerPalletUSD} 
                            currency="USD" 
                            className="text-3xl font-black text-orange-600"
                        />
                        <p className="text-xs text-orange-700 mt-2 font-bold">
                            هامش ربح {pricing.profitMarginPercent.toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Main Price & Action */}
                <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-sm text-gray-500 font-bold">إجمالي سعر الكمية</p>
                            <FormattedPrice 
                                amount={product.baseCostEGP * quantity} 
                                currency="EGP" 
                                className="text-4xl font-black text-gray-900"
                            />
                            <p className="text-xs text-orange-600 font-bold mt-1">
                                هذا المقدار يملأ {calculateItemPalletContribution(product.itemsPerPallet, quantity)}٪ من الطبلية
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 border border-gray-200">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-colors"
                            >
                                -
                            </button>
                            <input 
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                                className="text-xl font-black w-14 text-center bg-transparent border-none focus:ring-0 outline-none"
                            />
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 cursor-pointer bg-orange-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="text-2xl"><HiOutlineShoppingCart /></span>
                            <span >إضافة للسلة</span>
                        </button>
                        {/* <button 
                            className="w-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border-2 border-orange-100 hover:bg-orange-100 transition-colors"
                            title="حفظ"
                        >
                            <span className="text-2xl"><HiOutlineBookmark /></span>
                        </button> */}
                    </div>
                    {/* <p className="text-center text-xs text-gray-400 mt-4 font-bold flex items-center justify-center gap-2">
                        <span className="text-sm text-green-500"><HiOutlineCheckCircle /></span>
                        <span>ضمان الجودة</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm text-green-500"><HiOutlineTruck /></span>
                        <span>شحن مجاني</span>
                    </p> */}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
