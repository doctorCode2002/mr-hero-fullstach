import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { Product, Category } from '../../types';
import { calculateProductPricing, formatCurrency } from '../../utils/calculations';
import FormattedPrice from '../Shared/FormattedPrice';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../../utils/upload';

const Dashboard: React.FC = () => {
    const { 
        products, 
        categories, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        addCategory, 
        updateCategory,
        deleteCategory,
        settings,
        updateSettings,
        language,
        setLanguage,
        notifications,
        showNotification,
        removeNotification,
        isAdminAuthenticated,
        logoutAdmin
    } = useStore();

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'business'>('inventory');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    
    // Form States
    const [prodForm, setProdForm] = useState({
        productId: '', name: '', description: '',
        baseCostEGP: '', sellingPricePerItemUSD: '', 
        itemsPerPallet: '',  categoryId: '', images: [] as string[]
    });

    const [catForm, setCatForm] = useState({
        name: '', image: ''
    });

    const [businessSettings, setBusinessSettings] = useState({
        whatsappNumber: settings.whatsappNumber,
        conversionRate: settings.conversionRate,
        deliveryCostPerPalletUSD: settings.deliveryCostPerPalletUSD,
        halfPalletDeliveryCostUSD: settings.halfPalletDeliveryCostUSD
    });

    useEffect(() => {
        setBusinessSettings({
            whatsappNumber: settings.whatsappNumber,
            conversionRate: settings.conversionRate,
            deliveryCostPerPalletUSD: settings.deliveryCostPerPalletUSD,
            halfPalletDeliveryCostUSD: settings.halfPalletDeliveryCostUSD
        });
    }, [settings]);

    useEffect(() => {
        if (!isAdminAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAdminAuthenticated, navigate]);

    // ... (Helper functions for forms - Simplified for this implementation)
    const resetForm = () => {
        setProdForm({
            productId: '', name: '', description: '',
            baseCostEGP: '', sellingPricePerItemUSD: '',
            itemsPerPallet: '',  categoryId: categories[0]?.id || '', images: []
        });
        setImageUrlInput('');
    };

    const handleSaveProduct = async () => {
        const productData: any = {
            productId: prodForm.productId,
            name: prodForm.name,
            description: prodForm.description,
            baseCostEGP: Number(prodForm.baseCostEGP),
            sellingPricePerItemUSD: Number(prodForm.sellingPricePerItemUSD),
            itemsPerPallet: Number(prodForm.itemsPerPallet),
            categoryId: prodForm.categoryId,
            images: prodForm.images,
            isActive: true
        };

        try {
            if (editingProduct) {
                // For update, include the id
                await updateProduct({ ...productData, id: editingProduct.id });
            } else {
                // For create, omit the id
                await addProduct(productData);
            }
            showNotification('تم حفظ المنتج بنجاح', 'success');
            setIsAddingProduct(false);
            setEditingProduct(null);
            resetForm();
        } catch (error: any) {
            console.error('Error saving product:', error);
            showNotification(error.message || 'فشل في حفظ المنتج. تأكد من إعدادات التصنيف والبيانات.', 'error');
        }
    };

    const openEdit = (p: Product) => {
        setEditingProduct(p);
        setProdForm({
            productId: p.productId,
            name: p.name,
            description: p.description,
            baseCostEGP: p.baseCostEGP.toString(),
            sellingPricePerItemUSD: p.sellingPricePerItemUSD.toString(),
            itemsPerPallet: p.itemsPerPallet.toString(),
            categoryId: p.categoryId,
            images: p.images
        });
        setIsAddingProduct(true);
    };

    const handleAddImage = () => {
        if (imageUrlInput) {
            setProdForm({...prodForm, images: [...prodForm.images, imageUrlInput]});
            setImageUrlInput('');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            if (type === 'product') {
                setProdForm(prev => ({ ...prev, images: [...prev.images, url] }));
            } else {
                setCatForm(prev => ({ ...prev, image: url }));
            }
            showNotification('تم رفع الصورة بنجاح', 'success');
        } catch (error) {
            console.error('Upload failed:', error);
            showNotification('فشل رفع الصورة. تأكد من إعدادات Cloudinary أو حجم الملف.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveCategory = async () => {
        const categoryData = {
            name: catForm.name,
            image: catForm.image
        };

        try {
            if (editingCategory) {
                await updateCategory({ ...categoryData, id: editingCategory.id } as any);
            } else {
                await addCategory(categoryData);
            }
            showNotification('تم حفظ التصنيف بنجاح', 'success');
            setIsAddingCategory(false);
            setEditingCategory(null);
            setCatForm({ name: '', image: '' });
        } catch (error) {
            showNotification('فشل حفظ التصنيف', 'error');
        }
    };

    const openEditCategory = (c: Category) => {
        setEditingCategory(c);
        setCatForm({
            name: c.name,
            image: c.image
        });
        setIsAddingCategory(true);
    };

    const handleSaveSettings = async () => {
        try {
            await updateSettings({
                ...settings,
                whatsappNumber: businessSettings.whatsappNumber,
                conversionRate: businessSettings.conversionRate
            });
            showNotification('تم حفظ الإعدادات بنجاح', 'success');
        } catch (error) {
            showNotification('فشل حفظ الإعدادات', 'error');
        }
    };

    const handleResetAllData = async () => {
        if (window.confirm('هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذه الخطوة.')) {
            try {
                // Clear localStorage
                localStorage.removeItem('pw_products');
                localStorage.removeItem('pw_categories');
                localStorage.removeItem('pw_settings');
                
                // Reload page to re-initialize with seed or empty state
                window.location.reload();
            } catch (error) {
                showNotification('فشل في مسح البيانات', 'error');
            }
        }
    };

    // Derived Data
    const totalRevenue = 450000; // Mock or calculate
    const totalOrders = 120; // Mock
    const activeProducts = products.filter(p => p.isActive).length;

    if (!isAdminAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-tajawal transition-colors duration-300">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                            <span className="material-icons">admin_panel_settings</span>
                        </div>
                        <h1 className="text-xl font-black text-gray-900 hidden md:block">لوحة التحكم</h1>
                    </div>
                    
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {[
                            { id: 'inventory', label: 'المخزون', icon: 'inventory_2' },
                            { id: 'categories', label: 'التصنيفات', icon: 'category' },
                            { id: 'business', label: 'الإعدادات', icon: 'settings' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex cursor-pointer items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <span className="material-icons text-base">{tab.icon}</span>
                                <span className="hidden md:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => logoutAdmin()} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="تسجيل الخروج">
                            <span className="material-icons">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
                {activeTab === 'inventory' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-orange-50 shadow-xl shadow-orange-500/5 transition-all hover:scale-[1.02]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                        <span className="material-icons text-3xl">category</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full">نشط الآن</span>
                                    </div>
                                </div>
                                <h3 className="text-gray-500 font-bold mb-1 text-lg">إجمالي التصنيفات</h3>
                                <p className="text-4xl font-black text-gray-900">{categories.length}</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-xl shadow-blue-500/5 transition-all hover:scale-[1.02]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                        <span className="material-icons text-3xl">inventory_2</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full">متاح للبيع</span>
                                    </div>
                                </div>
                                <h3 className="text-gray-500 font-bold mb-1 text-lg">إجمالي المنتجات</h3>
                                <p className="text-4xl font-black text-gray-900">{products.length}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96 group">
                                <span className="material-icons absolute right-4 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors">search</span>
                                <input 
                                    type="text" 
                                    placeholder="بحث في المخزون..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-12 pl-4 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold"
                                />
                            </div>
                            <button 
                                onClick={() => { setEditingProduct(null); resetForm(); setIsAddingProduct(true); }}
                                className="w-full cursor-pointer md:w-auto bg-gray-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-icons">add</span>
                                <span>إضافة منتج</span>
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-x-auto shadow-sm custom-scrollbar">
                            <table className="w-full text-right min-w-[800px]">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 text-sm font-black text-gray-500">المنتج</th>
                                        <th className="p-6 text-sm font-black text-gray-500">التكلفة (EGP)</th>
                                        <th className="p-6 text-sm font-black text-gray-500">البيع المقترح (USD)</th>
                                        <th className="p-6 text-sm font-black text-gray-500">الربح (USD)</th>
                                        <th className="p-6 text-sm font-black text-gray-500">الحالة</th>
                                        <th className="p-6 text-sm font-black text-gray-500">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.filter(p => p.name.includes(searchTerm)).map(product => {
                                        const pricing = calculateProductPricing(product, settings.conversionRate);
                                        return (
                                        <tr key={product.id} className="group hover:bg-gray-50 transition-colors ">
                                            <td className="p-6 ">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                                                        <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{product.name}</h4>
                                                        <p className="text-xs text-gray-400 font-bold mt-1 text-left" dir="ltr">{product.productId}</p>
                                                        <p className="text-xs text-gray-400 font-bold mt-1">{product.itemsPerPallet} قطعة/طبلية</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 ">
                                                <FormattedPrice amount={product.baseCostEGP} currency="EGP" className="font-bold text-gray-900" />
                                            </td>
                                            <td className="p-6">
                                                <FormattedPrice amount={product.sellingPricePerItemUSD} currency="USD" className="text-gray-500 font-medium" />
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <FormattedPrice amount={pricing.profitPerPalletUSD} currency="USD" className="font-bold text-green-600" />
                                                    <span className="text-xs text-gray-400">للطبلية ({pricing.profitMarginPercent.toFixed(0)}%)</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-black ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {product.isActive ? 'نشط' : 'غير نشط'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEdit(product)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                                        <span className="material-icons text-sm">edit</span>
                                                    </button>
                                                    <button onClick={() => deleteProduct(product.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                                                        <span className="material-icons text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* Simplified placeholder for other tabs */}
                {/* Settings Tab */}
                {activeTab === 'business' && (
                    <div className="space-y-6">
                        {/* Header */}
                        {/* Header */}
                        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-8 py-5 flex items-center justify-between shadow-sm rounded-xl mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">إعدادات المتجر</h2>
                                <p className="text-sm text-gray-500 mt-1">إدارة التكوينات العالمية وتفاصيل الاتصال بالمنصة</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors">
                                    <span className="material-icons text-xl">notifications</span>
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors">
                                    <span className="material-icons text-xl">help</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-2">
                                <span className="material-icons text-orange-500 text-xl">tune</span>
                                <h3 className="font-bold text-gray-800 text-sm">المتغيرات العامة</h3>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-8">
                                {/* Contact Section */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-dashed border-gray-100">
                                    <div className="md:col-span-4">
                                        <label className="block text-sm font-bold text-gray-900 mb-1">معلومات التواصل</label>
                                        <p className="text-xs text-gray-500 leading-relaxed">حدد رقم الواتساب الذي سيتم استخدامه لاستقبال الطلبات من التجار.</p>
                                    </div>
                                    <div className="md:col-span-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب للأعمال</label>
                                        <div className="relative flex rounded-lg shadow-sm border border-gray-200 overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                                            <span className="inline-flex items-center px-4 rounded-r-lg border-l border-gray-200 bg-gray-50 text-gray-500 sm:text-sm font-medium tracking-wider ltr">
                                                +
                                            </span>
                                            <input 
                                                className="block w-full border-0 py-3 px-4 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm ltr text-right bg-transparent"  
                                                placeholder="972..." 
                                                type="text" 
                                                value={businessSettings.whatsappNumber}
                                                onChange={(e) => setBusinessSettings({ ...businessSettings, whatsappNumber: e.target.value.replace(/[^\d+]/g, '') })}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="material-icons text-gray-400 text-lg">chat</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Economics Section */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-4">
                                        <label className="block text-sm font-bold text-gray-900 mb-1">الإعدادات المالية</label>
                                        <p className="text-xs text-gray-500 leading-relaxed">تحكم في العملة وسعر الصرف المستخدم لحساب الهوامش والأسعار.</p>
                                    </div>
                                    <div className="md:col-span-8 flex flex-col gap-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Read-only Currency */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">عملة المتجر</label>
                                                <div className="relative">
                                                    <input 
                                                        className="block w-full rounded-lg border-gray-200 bg-gray-100 py-3 px-4 text-gray-500 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm cursor-not-allowed" 
                                                        disabled 
                                                        type="text" 
                                                        value="USD ($)"
                                                    />
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="material-icons text-gray-400 text-lg">lock</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Highlighted Conversion Rate */}
                                            <div className="group">
                                                <label className=" text-sm font-bold text-orange-500 mb-2 flex items-center gap-1">
                                                    {/* <span className="material-icons text-xs">conversion_path</span> */}
                                                    سعر صرف الدولار (USD → EGP)
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        className="block w-full rounded-lg border-orange-500 bg-orange-500/5 py-3 px-4 text-orange-500 font-black shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm text-center" 
                                                        type="number" 
                                                        step="0.01"
                                                        value={businessSettings.conversionRate}
                                                        onChange={(e) => setBusinessSettings({ ...businessSettings, conversionRate: parseFloat(e.target.value) || 0 })}
                                                    />
                                                    {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="material-icons text-orange-500/60 text-lg">currency_exchange</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Full Pallet Delivery Cost */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">تكلفة توصيل طبلية كاملة (USD)</label>
                                                <div className="relative">
                                                    <input 
                                                        className="block w-full rounded-lg border-gray-200 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" 
                                                        type="number" 
                                                        min="0"
                                                        value={businessSettings.deliveryCostPerPalletUSD}
                                                        onChange={(e) => setBusinessSettings({ ...businessSettings, deliveryCostPerPalletUSD: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            {/* Half Pallet Delivery Cost */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">تكلفة توصيل نصف طبلية (USD)</label>
                                                <div className="relative">
                                                    <input 
                                                        className="block w-full rounded-lg border-gray-200 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" 
                                                        type="number" 
                                                        min="0"
                                                        value={businessSettings.halfPalletDeliveryCostUSD}
                                                        onChange={(e) => setBusinessSettings({ ...businessSettings, halfPalletDeliveryCostUSD: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Warning Note */}
                                        <div className="rounded-lg bg-orange-50 border border-orange-100 p-4 flex gap-3 items-start">
                                            <span className="material-icons text-orange-500 mt-0.5 shrink-0">info</span>
                                            <div className="text-sm text-orange-900/80 leading-relaxed">
                                                <span className="font-bold text-orange-800">تنبيه هام:</span> 
                                                تحديث سعر التحويل سيؤدي تلقائياً إلى إعادة حساب هوامش الربح وأسعار البيع المقترحة لجميع المنصات (Pallets) الموجودة حالياً في المخزون. يرجى التحقق قبل الحفظ.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl">
                                    <button 
                                        type="button"
                                        onClick={() => window.location.reload()}
                                        className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                                    >
                                        إلغاء
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleSaveSettings}
                                        className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-icons text-[18px]">save</span>
                                        حفظ التغييرات
                                    </button>
                                </div>

                                {/* Reset Data Section */}
                                <div className="mt-12 pt-8 border-t border-red-100">
                                    <h3 className="text-lg font-black text-red-600 mb-2 flex items-center gap-2">
                                        <span className="material-icons">dangerous</span>
                                        منطقة الخطر
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6 font-medium">مسح جميع البيانات المخزنة محلياً وإعادة ضبط المتجر للحالة الأصلية.</p>
                                    <button 
                                        onClick={handleResetAllData}
                                        className="px-6 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <span className="material-icons text-[18px]">delete_forever</span>
                                        مسح جميع البيانات (Reset)
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-4">
                        <p className="text-xs text-gray-400">
                            Mr Hero Admin Panel v2.4.0 © 2026
                        </p>
                        </div>
                    </div>
                )}
                
                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96 group">
                                <span className="material-icons absolute right-4 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors">search</span>
                                <input 
                                    type="text" 
                                    placeholder="بحث في التصنيفات..." 
                                    value={categorySearchTerm}
                                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-12 pl-4 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold"
                                />
                            </div>
                            <button 
                                onClick={() => { setEditingCategory(null); setCatForm({ nameAr: '', nameEn: '', image: '' }); setIsAddingCategory(true); }}
                                className="w-full md:w-auto cursor-pointer bg-gray-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-icons">add</span>
                                <span>إضافة تصنيف</span>
                            </button>
                        </div>

                         {/* Categories Grid */}
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.filter(c => c.name.toLowerCase().includes(categorySearchTerm.toLowerCase())).map(category => (
                                <div key={category.id} className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditCategory(category)} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-orange-600 transition-all">
                                                    <span className="material-icons">edit</span>
                                                </button>
                                                <button onClick={() => deleteCategory(category.id)} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                                    <span className="material-icons">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-black text-gray-900 mb-2">{category.name}</h3>
                                        <div className="flex justify-between items-center text-sm text-gray-500 font-bold">
                                            <span>{products.filter(p => p.categoryId === category.id).length} منتج</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </main>

            {/* Premium Modal for Add/Edit Product */}
            {isAddingProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsAddingProduct(false)} />
                    <div className="bg-white w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-[2.5rem] relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                                <p className="text-sm text-gray-400 font-bold mt-1">أدخل تفاصيل المنتج بدقة لضمان عرض صحيح</p>
                            </div>
                            <button onClick={() => setIsAddingProduct(false)} className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Column: Images & Meta */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200 text-center group transition-all relative">
                                        <div className="aspect-square rounded-xl bg-white mb-4 overflow-hidden relative">
                                            {prodForm.images.length > 0 ? (
                                                <div className="relative h-full">
                                                    <img src={prodForm.images[0]} alt="Preview" className="w-full h-full object-cover" />
                                                    <button 
                                                        onClick={() => setProdForm({ ...prodForm, images: prodForm.images.slice(1) })}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <span className="material-icons text-xs">delete</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                    <span className="material-icons text-4xl mb-2">add_photo_alternate</span>
                                                    <span className="text-xs font-bold">صورة رئيسية</span>
                                                </div>
                                            )}
                                            
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {/* Local File Upload */}
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    id="prod-image-upload"
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, 'product')}
                                                />
                                                <label 
                                                    htmlFor="prod-image-upload"
                                                    className="flex items-center justify-center gap-2 w-full py-3 bg-orange-100 text-orange-700 rounded-xl text-xs font-black cursor-pointer hover:bg-orange-200 transition-all border-2 border-dashed border-orange-300"
                                                >
                                                    <span className="material-icons text-sm">upload_file</span>
                                                    رفع من الجهاز
                                                </label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="h-[1px] bg-gray-200 flex-grow"></div>
                                                <span className="text-[10px] text-gray-400 font-bold">أو رابط مباشرة</span>
                                                <div className="h-[1px] bg-gray-200 flex-grow"></div>
                                            </div>

                                            <div className="flex gap-2">
                                                <input 
                                                    value={imageUrlInput}
                                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                                    placeholder="URL..."
                                                    className="flex-grow bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-orange-500 outline-none ltr"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={handleAddImage}
                                                    className="bg-gray-900 text-white px-3 rounded-xl hover:bg-orange-600 transition-colors"
                                                >
                                                    <span className="material-icons text-sm">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                                        <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                                            <span className="material-icons text-sm">tips_and_updates</span>
                                            نصائح
                                        </h4>
                                        <ul className="text-xs text-orange-800/80 space-y-2 list-disc list-inside font-medium leading-relaxed">
                                            <li>استخدم صور عالية الدقة (1000x1000)</li>
                                            <li>تأكد من دقة سعر التحويل العالمي</li>
                                            <li>اكتب وصفاً جذاباً للمنتج</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Column: Form Fields */}
                                <div className="lg:col-span-8 space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 mr-2">اسم المنتج</label>
                                            <input placeholder="مثال: قميص رجالي قطن" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="input-field w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all border border-transparent focus:border-orange-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 mr-2">معرف المنتج (Product ID)</label>
                                            <input placeholder="مثال: PROD-123" value={prodForm.productId} onChange={e => setProdForm({...prodForm, productId: e.target.value})} className="input-field w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all border border-transparent focus:border-orange-500 text-left ltr uppercase" />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 mr-2">الوصف</label>
                                        <textarea rows={3} placeholder="اكتب وصفاً تفصيلياً للمنتج..." value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className="input-field w-full p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-all border border-transparent focus:border-orange-500 resize-none" />
                                    </div>

                                    <div className="h-px bg-gray-100 my-2" />

                                    {/* Pricing & Logistics */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 mr-2 text-blue-500">التكلفة الأساسية (EGP)</label>
                                            <div className="relative">
                                                <input type="number" placeholder="0.00" value={prodForm.baseCostEGP} onChange={e => setProdForm({...prodForm, baseCostEGP: e.target.value})} className="input-field w-full p-4 pl-12 bg-blue-50/50 rounded-xl font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-transparent focus:border-blue-500 ltr text-right" />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400">EGP</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 mr-2 text-green-500">سعر البيع المقترح (USD)</label>
                                            <div className="relative">
                                                <input type="number" step="0.01" placeholder="0.00" value={prodForm.sellingPricePerItemUSD} onChange={e => setProdForm({...prodForm, sellingPricePerItemUSD: e.target.value})} className="input-field w-full p-4 pl-12 bg-green-50/50 rounded-xl font-black outline-none focus:ring-2 focus:ring-green-500/20 transition-all border border-transparent focus:border-green-500 ltr text-right" />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-400">USD</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 mr-2">قطع بالطبلية</label>
                                            <div className="relative">
                                                <input type="number" placeholder="0" value={prodForm.itemsPerPallet} onChange={e => setProdForm({...prodForm, itemsPerPallet: e.target.value})} className="input-field w-full p-4 pl-12 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all border border-transparent focus:border-orange-500 ltr text-right" />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">pcs</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <label className="text-xs font-bold text-gray-500 mr-2">التصنيف</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setProdForm({...prodForm, categoryId: cat.id})}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                                        prodForm.categoryId === cat.id
                                                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-500/30'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                                                    }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                            <button onClick={handleSaveProduct} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-gray-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                                <span className="material-icons">save</span>
                                <span>حفظ التغييرات</span>
                            </button>
                            <button onClick={() => setIsAddingProduct(false)} className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Modal for Add/Edit Category */}
            {isAddingCategory && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsAddingCategory(false)} />
                    <div className="bg-white w-full max-w-2xl overflow-hidden rounded-[2.5rem] relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">{editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</h2>
                            </div>
                            <button onClick={() => setIsAddingCategory(false)} className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 mr-2">الاسم</label>
                                    <input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="input-field w-full p-4 bg-gray-50 rounded-xl font-bold border border-transparent focus:border-orange-500 outline-none" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-500 mr-2">صورة التصنيف</label>
                                <div className="aspect-video rounded-2xl bg-gray-100 overflow-hidden relative border-2 border-dashed border-gray-200">
                                    {catForm.image ? (
                                        <img src={catForm.image} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <span className="material-icons text-4xl mb-2">image</span>
                                            <span className="text-xs font-bold">معاينة الصورة</span>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex gap-4">
                                    <div className="flex-1 relative">
                                        <input 
                                            type="file" 
                                            id="cat-image-upload"
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'category')}
                                        />
                                        <label 
                                            htmlFor="cat-image-upload"
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-orange-100 text-orange-700 rounded-xl text-xs font-black cursor-pointer hover:bg-orange-200 transition-all border-2 border-dashed border-orange-300"
                                        >
                                            <span className="material-icons text-sm">upload_file</span>
                                            رفع من الجهاز
                                        </label>
                                    </div>
                                    <div className="flex-[2] relative">
                                        <input 
                                            placeholder="أو ضع رابط الصورة هنا..." 
                                            value={catForm.image} 
                                            onChange={e => setCatForm({...catForm, image: e.target.value})} 
                                            className="w-full p-4 bg-gray-50 rounded-xl font-bold border border-transparent focus:border-orange-500 outline-none ltr text-right" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                            <button onClick={handleSaveCategory} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-600 transition-all">
                                <span>حفظ التصنيف</span>
                            </button>
                            <button onClick={() => setIsAddingCategory(false)} className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold">
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
