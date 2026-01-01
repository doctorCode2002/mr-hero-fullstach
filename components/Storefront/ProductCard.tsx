
"use client";

import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../store/StoreContext';
import { calculateProductPricing } from '../../utils/calculations';
import FormattedPrice from '../Shared/FormattedPrice';

interface Props {
  product: Product;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onViewDetails }) => {
  const { language, addToCart, settings } = useStore();
  const pricing = calculateProductPricing(product, settings.conversionRate);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const t = {
    perItem: 'للقطعة',
    perPallet: 'للطبلية',
    items: 'قطعة',
    addPallet: 'إضافة طبلية',
    margin: 'هامش الربح',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col text-sm">
      <div className="aspect-square bg-gray-50 dark:bg-gray-800/50 overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.name[language]} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border-2 border-white dark:border-gray-900">
          ربح {pricing.profitMarginPercent.toFixed(1)}%
        </div>
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <h3 className="font-black text-gray-900 dark:text-white text-base md:text-lg mb-1 truncate">
          {product.name[language]}
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm font-bold mb-4">
          {product.itemsPerPallet} {t.items} {t.perPallet}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mb-1">{t.perItem}</p>
              <FormattedPrice 
                amount={pricing.wholesalePricePerItemILS} 
                currency="ILS" 
                className="text-sm text-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-1">{t.perPallet}</p>
              <div className="flex flex-col items-end">
                <FormattedPrice 
                  amount={pricing.wholesalePricePerPalletILS} 
                  currency="ILS" 
                  className="text-2xl font-black text-gray-900 dark:text-white"
                />
                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold mt-1">شامل التوصيل</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onViewDetails(product)}
              className="flex-1 text-[11px] md:text-xs font-black py-3 px-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all uppercase tracking-widest"
            >
              التفاصيل
            </button>
            <button 
              onClick={handleAddToCart}
              className={`text-white p-3 rounded-xl transition-all shadow-md active:scale-95 ${
                isAdded 
                ? 'bg-gray-900 dark:bg-white text-emerald-500 dark:text-emerald-600 scale-110' 
                : 'bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500'
              }`}
              title={t.addPallet}
            >
              {isAdded ? (
                <svg className="w-5 h-5 md:w-6 md:h-6 animate-in zoom-in spin-in-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
