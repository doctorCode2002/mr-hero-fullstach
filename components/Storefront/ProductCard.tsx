
"use client";

import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../store/StoreContext';
import { calculateProductPricing, formatCurrency } from '../../utils/calculations';

interface Props {
  product: Product;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onViewDetails }) => {
  const { language, addToCart, settings } = useStore();
  const pricing = calculateProductPricing(product, settings.conversionRate);

  const t = {
    perItem: 'للقطعة',
    perPallet: 'للطبلية',
    items: 'قطعة',
    addPallet: 'إضافة طبلية',
    margin: 'هامش الربح',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
      <div className="aspect-square bg-gray-50 dark:bg-gray-800/50 overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.name[language]} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-black text-emerald-700 dark:text-emerald-400 border border-emerald-50 dark:border-emerald-900 shadow-sm">
          {pricing.profitMarginPercent.toFixed(1)}% {t.margin}
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
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{t.perItem}</p>
              <p className="text-sm font-black text-gray-700 dark:text-gray-300">
                {formatCurrency(product.sellingPricePerItemILS, 'ILS', language)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-1">{t.perPallet}</p>
              <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none">
                {formatCurrency(pricing.totalSellingPricePerPalletILS, 'ILS', language)}
              </p>
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
              onClick={() => addToCart(product.id, 1)}
              className="bg-emerald-600 dark:bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-all shadow-md active:scale-95"
              title={t.addPallet}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
