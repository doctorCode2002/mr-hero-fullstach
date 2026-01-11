
"use client";

import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../store/StoreContext';
import { calculateProductPricing } from '../../utils/calculations';
import FormattedPrice from '../Shared/FormattedPrice';
import { HiOutlineCheckCircle, HiOutlineShoppingCart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: Product;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onViewDetails }) => {
  const { language, addToCart, settings } = useStore();
  const navigate = useNavigate();
  const pricing = calculateProductPricing(product, settings.conversionRate);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Add a full pallet worth of items by default
    addToCart(product.id, product.itemsPerPallet);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  const t = {
    perItem: 'للقطعة',
    perPallet: 'للطبلية',
    items: 'قطعة',
    addPallet: 'إضافة طبلية',
    margin: 'هامش الربح',
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-orange-500 hover:shadow-xl transition-all group flex flex-col text-sm duration-300">
      {/* Clickable Image */}
      <div 
        onClick={handleNavigate}
        className="aspect-square bg-gray-50 overflow-hidden relative cursor-pointer"
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">
          ربح {pricing.profitMarginPercent.toFixed(0)}٪
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col grow">
        {/* Clickable Title */}
        <h3 
          onClick={handleNavigate}
          className="font-black text-gray-900 text-sm md:text-base mb-1 line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors"
        >
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs font-bold mb-3">
          {product.itemsPerPallet} {t.items}
        </p>

        <div className="mt-auto space-y-3">
          {/* Price Highlight */}
          <div className="bg-linear-to-br from-orange-500/5 to-orange-50 p-3 rounded-xl border border-orange-500/20">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">سعر القطعة (جملة)</p>
            <FormattedPrice 
              amount={product.baseCostEGP} 
              currency="EGP" 
              className="text-xl md:text-2xl font-black text-orange-500" 
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-[9px] text-gray-400">ربح متوقع (للطبلية):</span>
              <FormattedPrice 
                amount={pricing.profitPerPalletUSD} 
                currency="USD" 
                className="font-bold text-green-600 text-xs" 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
              className="flex-1 cursor-pointer text-[10px] md:text-xs font-black py-2.5 px-3 border-2 border-orange-500/20 rounded-xl hover:bg-orange-500 hover:text-white hover:border-orange-500 text-orange-500 transition-all uppercase tracking-wider"
            >
              التفاصيل
            </button>
            <button 
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold ${
                isAdded 
                ? 'bg-green-500 text-white shadow-green-500/20' 
                : 'bg-orange-500 text-white hover:bg-primary-hover shadow-orange-500/20'
              }`}
              title={t.addPallet}
            >
              {isAdded ? (
                <span className="text-base"><HiOutlineCheckCircle /></span>
              ) : (
                <span className="text-base"><HiOutlineShoppingCart /></span>
              )}
              <span className="hidden sm:inline ">{isAdded ? 'تمت' : 'إضافة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
