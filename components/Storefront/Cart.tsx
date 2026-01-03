
"use client";

import React from 'react';
import { useStore } from '../../store/StoreContext';
import { calculateProductPricing, formatCurrency } from '../../utils/calculations';
import FormattedPrice from '../Shared/FormattedPrice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<Props> = ({ isOpen, onClose }) => {
  const { cart, products, language, settings, updateCartQuantity, removeFromCart } = useStore();

  const cartTotal = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return acc;
    const pricing = calculateProductPricing(product, settings.conversionRate);
    return acc + (pricing.wholesalePricePerPalletILS * item.quantity);
  }, 0);

  const cartTotalProfit = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return acc;
    const pricing = calculateProductPricing(product, settings.conversionRate);
    return acc + (pricing.totalPotentialProfitPerPalletILS * item.quantity);
  }, 0);

  const handleCheckout = () => {
    let message = 'مرحباً،\n\nأرغب في شراء:\n';
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        message += `• ${item.quantity} طبلية - ${product.name[language]}\n`;
      }
    });
    message += `\nالسعر الإجمالي: ${formatCurrency(cartTotal, 'ILS', language)}\n`;
    message += 'يرجى تأكيد التوفر.';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="absolute top-0 bottom-0 left-0 w-full max-w-lg bg-white dark:bg-gray-950 shadow-3xl flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-100 dark:border-gray-800">
        <div className="p-6 border-b-2 border-primary-100 dark:border-gray-900 flex items-center justify-between bg-primary-50/50 dark:bg-gray-900">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">عربة التسوق</h2>
          <button onClick={onClose} className="p-2 hover:bg-primary-100 dark:hover:bg-gray-800 rounded-full transition-colors text-primary-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
              <div className="w-24 h-24 bg-primary-50 dark:bg-gray-900 rounded-full flex items-center justify-center border-2 border-primary-100">
                <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-black text-lg text-primary-900">عربة التسوق فارغة</p>
            </div>
          ) : (
            cart.map(item => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;
              const pricing = calculateProductPricing(product);

              return (
                <div key={item.productId} className="flex gap-4 p-4 border-2 border-primary-50 dark:border-gray-900 rounded-2xl bg-white dark:bg-gray-900/50 hover:border-primary-200 transition-colors">
                  <img src={product.images[0]} className="w-20 h-20 rounded-xl object-cover" alt="" />
                  <div className="flex-grow text-right">
                    <h4 className="font-black text-gray-900 dark:text-white text-base line-clamp-1 mb-1">{product.name[language]}</h4>
                    <p className="text-xs text-primary-600 font-bold mb-3"><span className="english-nums">{product.itemsPerPallet}</span> قطعة/طبلية</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-primary-100 dark:border-gray-800 rounded-lg text-primary-500 hover:text-white hover:bg-primary-500 dark:hover:text-white transition-colors font-bold"
                        >-</button>
                        <span className="text-sm font-black w-6 text-center text-gray-900 dark:text-white english-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-primary-100 dark:border-gray-800 rounded-lg text-primary-500 hover:text-white hover:bg-primary-500 dark:hover:text-white transition-colors font-bold"
                        >+</button>
                      </div>
                      <p className="text-lg font-black text-primary-700 dark:text-white">
                        <FormattedPrice 
                          amount={pricing.wholesalePricePerPalletILS * item.quantity} 
                          currency="ILS" 
                          className="text-lg font-black text-primary-700 dark:text-white"
                        />
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30 space-y-6">
             <div className="flex justify-between items-center text-2xl font-black text-gray-900 dark:text-white">
               <span>الإجمالي</span>
               <FormattedPrice amount={cartTotal} currency="ILS" className="text-2xl" />
             </div>
             <div className="flex justify-between items-center text-sm font-bold text-primary-600">
                <span>إجمالي الربح المتوقع</span>
                <FormattedPrice amount={cartTotalProfit} currency="ILS" className="text-sm" />
             </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#20ba59] transition-all shadow-xl shadow-primary-200/30 active:scale-95"
            >
              إتمام الطلب عبر واتساب
            </button>
            <p className="text-[11px] text-center text-gray-400 font-black uppercase tracking-widest">
              السعر يشمل تكلفة القطع والتوصيل حتى باب المستودع.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
