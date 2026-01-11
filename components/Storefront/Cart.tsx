import React from 'react';
import { useStore } from '../../store/StoreContext';
import FormattedPrice from '../Shared/FormattedPrice';
import { calculateDeliveryCost } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineX, HiOutlineTrash, HiOutlineArrowNarrowLeft } from 'react-icons/hi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<Props> = ({ isOpen, onClose }) => {
  const { getCartItemsWithDetails, getPalletFillState, updateCartQuantity, removeFromCart, language, canCheckout, settings } = useStore();
  const navigate = useNavigate();

  const cartItems = getCartItemsWithDetails();
  const palletFillState = getPalletFillState();
  
  // Calculate Totals
  const totalItemsPriceEGP = cartItems.reduce((acc, item) => acc + (item.product.baseCostEGP * item.quantity), 0);
  const totalDeliveryCostUSD = calculateDeliveryCost(
      palletFillState.totalFillPercentage, 
      settings?.deliveryCostPerPalletUSD || 0, 
      settings?.halfPalletDeliveryCostUSD || 0
  );
  // Net Profit = Gross Profit - Delivery
  const totalGrossProfitUSD = cartItems.reduce((acc, item) => acc + (item.pricing.profitPerItemUSD * item.quantity), 0);
  const totalProfitUSD = totalGrossProfitUSD - totalDeliveryCostUSD;

  const handleCheckout = () => {
    if (!canCheckout) return;
    onClose();
    navigate('/order-confirmation');
  };

  if (!isOpen) return null;

  // Determine progress bar color based on status
  const getProgressColor = () => {
    switch (palletFillState.status) {
      case 'at-50':
      case 'at-100':
        return 'bg-green-500';
      case 'under-50':
        return 'bg-orange-500';
      case 'between-50-100':
      case 'over-100':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusColor = () => {
    switch (palletFillState.status) {
      case 'at-50':
      case 'at-100':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'under-50':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'between-50-100':
      case 'over-100':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute top-0 bottom-0 left-0 w-full sm:max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-100">
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="text-orange-500 text-3xl"><HiOutlineShoppingBag /></span>
            السلة
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <span className="text-2xl"><HiOutlineX /></span>
          </button>
        </div>

        {/* Pallet Fill Indicator - CRITICAL COMPONENT */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-gradient-to-br from-orange-50 to-white border-b-4 border-orange-100">
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-gray-600">نسبة ملء الطبلية</span>
                <span className="text-3xl font-black text-gray-900">
                  {palletFillState.totalFillPercentage.toFixed(1)}٪
                </span>
              </div>
              
              {/* Multiple Progress Bars for Segments */}
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                {palletFillState.segments.map((segmentFill, index) => {
                  const isLastSegment = index === palletFillState.segments.length - 1;
                  const isMultiPallet = palletFillState.segments.length > 1;
                  
                  return (
                    <div key={index} className="space-y-1">
                      {isMultiPallet && (
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          <span>طبلية #{index + 1}</span>
                          <span>{segmentFill.toFixed(1)}٪</span>
                        </div>
                      )}
                      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-gray-100">
                        {/* Fill */}
                        <div 
                          className={`h-full ${getProgressColor()} transition-all duration-500 ease-out relative`}
                          style={{ width: `${segmentFill}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse"></div>
                        </div>
                        
                        {/* 50% Marker - Only on the last segment if it's the active one */}
                        {isLastSegment && (
                          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/20">
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                              المحطة ٥٠٪
                            </div>
                          </div>
                        )}
                        
                        {/* 100% Marker */}
                        <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-black/20">
                          <div className="absolute -top-7 right-0 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                            الهدف ١٠٠٪
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Status Message */}
            <div className={`p-3 rounded-xl border-2 ${getStatusColor()} font-bold text-sm text-center`}>
              {palletFillState.message}
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <span className="text-6xl text-gray-300"><HiOutlineShoppingBag /></span>
              <p className="text-lg font-bold">السلة فارغة</p>
              <button 
                onClick={() => { navigate('/category/all'); onClose(); }}
                className="text-orange-500 font-bold hover:underline"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.productId} className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 relative group">
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="absolute top-2 left-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-lg"><HiOutlineTrash /></span>
                </button>
                
                <div className="w-24 h-24 bg-white rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-h-[6rem] px-2">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 leading-tight">{item.product.name}</h3>
                        <div className="text-left shrink-0 ml-2">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {item.product.itemsPerPallet} قطعة = طبلية كاملة
                            </p>
                            <p className="text-xs text-orange-600 font-black">
                            {item.quantity} قطعة • {item.fillPercentage.toFixed(1)}٪
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <FormattedPrice 
                          amount={item.product.baseCostEGP * item.quantity} 
                          currency="EGP" 
                          className="text-orange-500 font-black text-lg" 
                        />
                    <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 shadow-sm border border-gray-100">
                      <button 
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-500 font-bold"
                        disabled={item.quantity <= 1}
                      >-</button>
                      <input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
                        className="font-bold text-sm w-12 text-center bg-transparent border-none focus:ring-0 outline-none p-0"
                      />
                      <button 
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-500 font-bold"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-600">إجمالي المنتجات:</span>
                <FormattedPrice amount={totalItemsPriceEGP} currency="EGP" className="font-black text-lg text-gray-900" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-600">تكلفة التوصيل:</span>
                <FormattedPrice amount={totalDeliveryCostUSD} currency="USD" className="font-black text-lg text-orange-600" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-600">الربح المتوقع:</span>
                <FormattedPrice amount={totalProfitUSD} currency="USD" className="font-black text-lg text-green-600" />
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={!canCheckout}
              className={`w-full py-4 cursor-pointer rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                canCheckout 
                  ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-orange-500/30' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>إتمام الطلب عبر واتساب</span>
              <span className="text-2xl"><HiOutlineArrowNarrowLeft /></span>
            </button>
            
            {!canCheckout && (
              <p className="text-xs text-center text-red-500 font-bold">
                يجب أن تكون السلة من مضاعفات ٥٠٪ لإتمام الطلب (٥٠٪، ١٠٠٪، ١٥٠٪...)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
