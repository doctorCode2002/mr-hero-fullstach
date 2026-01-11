import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { calculateProductPricing, calculateDeliveryCost } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';
import FormattedPrice from '../Shared/FormattedPrice';
import { HiOutlineCheckCircle, HiOutlinePaperAirplane, HiOutlineShoppingBag } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const OrderConfirmation: React.FC = () => {
    const { getCartItemsWithDetails, getPalletFillState, settings, language, clearCart } = useStore();
    const navigate = useNavigate();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const cartItems = getCartItemsWithDetails();
    const palletFillState = getPalletFillState();
    
    // Calculate Totals using new logic
    const totalItemsPriceEGP = cartItems.reduce((acc, item) => acc + (item.product.baseCostEGP * item.quantity), 0);
    const totalDeliveryCostUSD = calculateDeliveryCost(
        palletFillState.totalFillPercentage, 
        settings?.deliveryCostPerPalletUSD || 0, 
        settings?.halfPalletDeliveryCostUSD || 0
    );
    const totalGrossProfitUSD = cartItems.reduce((acc, item) => acc + (item.pricing.profitPerItemUSD * item.quantity), 0);
    const totalProfitUSD = totalGrossProfitUSD - totalDeliveryCostUSD;
    
    const { canCheckout } = useStore();

    const handleSendToWhatsApp = () => {
        if (!canCheckout) {
            alert('يجب أن تكون السلة من مضاعفات ٥٠٪ لإتمام الطلب');
            return;
        }
        setIsRedirecting(true);
        
        let message = `مرحباً مستر هيرو،\n\nأرغب في إتمام الطلب التالي:\n\n`;
        message += `━━━━━━━━━━━━━━\n📦 تفاصيل المنتج\n━━━━━━━━━━━━━━\n`;
        
        cartItems.forEach(item => {
            message += `• المنتج: ${item.product.name}\n`;
            message += `• الكود: ${item.product.productId}\n`;
            message += `• الكمية: ${item.quantity} قطعة\n`;
            message += `• نسبة من الطبلية: ${item.fillPercentage.toFixed(1)}٪\n`;
            message += `• السعر: ${(item.product.baseCostEGP * item.quantity).toLocaleString()} EGP\n\n`;
        });

        message += `━━━━━━━━━━━━━━\n📊 ملخص الطلب\n━━━━━━━━━━━━━━\n`;
        message += `• نسبة ملء الطبلية: ${palletFillState.totalFillPercentage.toFixed(1)}٪\n`;
        message += `• إجمالي المنتجات: ${totalItemsPriceEGP.toLocaleString()} EGP\n`;
        message += `• تكلفة التوصيل: ${totalDeliveryCostUSD.toLocaleString()} USD\n`;
        message += `• الربح المتوقع: ${totalProfitUSD.toLocaleString()} USD\n\n`;
        message += `يرجى تأكيد الطلب وترتيب الشحن.\nشكراً لكم 🌸`;

        const encodedMessage = encodeURIComponent(message);
        
        // Use WhatsApp number from settings
        const phoneNumber = settings?.whatsappNumber || "972501234567";
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        
        // Clear cart after opening new tab and redirect to home
        setTimeout(() => {
            clearCart();
            navigate('/');
        }, 1000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
                <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
                <button onClick={() => navigate('/')} className="text-orange-500 font-bold">العودة للمتجر</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-tajawal">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-green-600 p-8 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                                <HiOutlineCheckCircle className="text-5xl" />
                            </div>
                            <h1 className="text-3xl font-black text-white mb-2">جاهز للإرسال!</h1>
                            <p className="text-green-100 font-medium text-lg">راجع تفاصيل طلبك قبل الإرسال عبر واتساب</p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    <div className="p-8">
                        {/* Pallet Fill Status */}
                        <div className="mb-6 p-6 bg-gradient-to-r from-orange-500/10 to-orange-500/5 rounded-3xl border-2 border-orange-500/20">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-black text-gray-700">توزيع الطبلية</span>
                                <span className="text-3xl font-black text-orange-500">{palletFillState.totalFillPercentage.toFixed(1)}٪</span>
                            </div>
                            
                            <div className="space-y-3">
                                {palletFillState.segments.map((segmentFill, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase px-1">
                                            <span>طبلية #{index + 1}</span>
                                            <span>{segmentFill.toFixed(1)}٪</span>
                                        </div>
                                        <div className="relative h-4 bg-gray-200/50 rounded-full overflow-hidden border border-gray-100">
                                            <div 
                                                className="h-full bg-orange-500 transition-all duration-500"
                                                style={{ width: `${segmentFill}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-4 font-bold bg-white/50 p-2 rounded-lg text-center">
                                {palletFillState.message}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {cartItems.map(item => (
                                <div key={item.productId} className="flex items-center gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <img src={item.product.images[0]} alt={item.product.name[language]} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500">الكمية: <span className="font-black text-gray-900">{item.quantity}</span> قطعة</p>
                                        <p className="text-xs text-orange-500 font-bold">{item.fillPercentage.toFixed(1)}٪ من الطبلية</p>
                                    </div>
                                    <div className="text-left">
                                        <FormattedPrice amount={item.product.baseCostEGP * item.quantity} currency="EGP" className="font-black text-lg text-gray-900" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-gray-50 rounded-2xl p-6 space-y-3">
                            <div className="flex justify-between items-center text-gray-600">
                                <span>عدد الأصناف</span>
                                <span className="font-bold">{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600">
                                <span>إجمالي القطع</span>
                                <span className="font-bold">{cartItems.reduce((a, b) => a + b.quantity, 0)} قطعة</span>
                            </div>
                            <div className="h-px bg-gray-200 my-2"></div>
                            
                            {/* Costs Breakdown */}
                            <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                                <span>إجمالي المنتجات</span>
                                <FormattedPrice amount={totalItemsPriceEGP} currency="EGP" className="text-gray-900" />
                            </div>
                            
                            <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                                <span>تكلفة التوصيل</span>
                                <FormattedPrice amount={totalDeliveryCostUSD} currency="USD" className="text-orange-600" />
                            </div>

                            <div className="h-px bg-gray-200 my-2"></div>

                            <div className="flex justify-between items-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                                <span className="font-bold">ربحك المتوقع من هذه الصفقة</span>
                                <FormattedPrice amount={totalProfitUSD} currency="USD" className="font-black" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button 
                                onClick={handleSendToWhatsApp}
                                disabled={isRedirecting}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-black text-xl shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                {isRedirecting ? (
                                    <span>جاري التحويل...</span>
                                ) : (
                                    <>
                                        <FaWhatsapp className="text-2xl" />
                                        <span>إرسال الطلب عبر واتساب</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-4 font-medium">سيقوم فريق المبيعات بالرد عليك فور استلام الرسالة لتأكيد الدفع والشحن.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
