"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { Product, Category } from '../../types';
import { calculateProductPricing, formatCurrency } from '../../utils/calculations';
import FormattedPrice from '../Shared/FormattedPrice';

const Dashboard: React.FC = () => {
  const {
    products,
    categories,
    settings,
    language,
    updateProduct,
    deleteProduct,
    addProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    isLoading,
    error,
    searchTerm,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'business'>('inventory');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: settings.whatsappNumber,
    currencyLabel: settings.currencyLabel,
    conversionRate: settings.conversionRate,
  });

  useEffect(() => {
    setSettingsForm({
      whatsappNumber: settings.whatsappNumber,
      currencyLabel: settings.currencyLabel,
      conversionRate: settings.conversionRate,
    });
  }, [settings]);

  const t = {
    title: 'لوحة التحكم',
    subtitle: 'إدارة المخزون، الفئات، وإعدادات العمل من مكان واحد.',
    newPallet: 'إضافة طبلية',
    newCategory: 'إضافة فئة',
    tabs: { inventory: 'المخزون', categories: 'الفئات', business: 'الإعدادات' },
    stats: { total: 'إجمالي الطلبيات', active: 'نشط', margin: 'هامش الربح', potential: 'قيمة المخزون' },
    table: { details: 'تفاصيل', breakdown: 'السعر', metrics: 'التكلفة', profit: 'الربح', actions: 'إجراءات' },
  };

  const totalPallets = products.length;
  const activePallets = products.filter((p) => p.isActive).length;
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + calculateProductPricing(p, settings.conversionRate).wholesalePricePerPalletILS,
    0
  );
  const averageMargin = products.length
    ? products.reduce((acc, p) => acc + calculateProductPricing(p, settings.conversionRate).profitMarginPercent, 0) /
      products.length
    : 0;
  
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      // In a real app, use the configured API_URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error('Upload failed', err);
      return null;
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Omit<Product, 'id'> = {
      name: { ar: formData.get('nameAr') as string, en: formData.get('nameAr') as string },
      description: { ar: formData.get('descAr') as string, en: formData.get('descAr') as string },
      categoryId: formData.get('category') as string,
      itemsPerPallet: Number(formData.get('itemsPerPallet')),
      baseCostEGP: Number(formData.get('baseCostEGP')),
      conversionRate: settings.conversionRate,
      deliveryCostPerItemILS: Number(formData.get('deliveryCostILS')),
      sellingPricePerItemILS: Number(formData.get('sellingPriceILS')),
      isActive: formData.get('isActive') === 'on',
      images: editingProduct?.images || ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'],
    };

    try {
      if (editingProduct?.id) {
        await updateProduct({ ...editingProduct, ...productData });
        setEditingProduct(null);
      } else {
        await addProduct(productData);
        setEditingProduct(null);
      }
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData: Omit<Category, 'id'> = {
      name: { ar: formData.get('nameAr') as string, en: formData.get('nameAr') as string },
      image:
        (formData.get('imageUrl') as string) ||
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    };

    try {
      if (editingCategory) {
        await updateCategory({ ...editingCategory, ...categoryData });
        setEditingCategory(null);
      } else {
        await addCategory(categoryData);
        setIsAddingCategory(false);
      }
    } catch (err) {
      console.error('Failed to save category', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateSettings({
        whatsappNumber: settingsForm.whatsappNumber,
        currencyLabel: settingsForm.currencyLabel,
        conversionRate: Number(settingsForm.conversionRate),
      });
    } catch (err) {
      console.error('Failed to update settings', err);
    }
  };

  const productSearchFilter = (p: Product) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.name.en.toLowerCase().includes(term) ||
      p.name.ar.toLowerCase().includes(term) ||
      p.description.en.toLowerCase().includes(term) ||
      p.description.ar.toLowerCase().includes(term)
    );
  };

  const categorySearchFilter = (c: Category) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return c.name.en.toLowerCase().includes(term) || c.name.ar.toLowerCase().includes(term);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t.title}</h1>
              <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <button
                onClick={() => setEditingProduct({
                  id: '',
                  categoryId: categories[0]?.id || '',
                  images: [],
                  name: { en: '', ar: '' },
                  description: { en: '', ar: '' },
                  itemsPerPallet: 1,
                  baseCostEGP: 0,
                  conversionRate: settings.conversionRate,
                  deliveryCostPerItemILS: 0,
                  sellingPricePerItemILS: 0,
                  isActive: true
                })}
                className="flex-1 md:flex-none bg-orange-500 text-white px-5 md:px-6 py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:scale-105 transition-all shadow-lg"
              >
                {t.newPallet}
              </button>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="flex-1 md:flex-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-200 px-5 md:px-6 py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-sm"
              >
                {t.newCategory}
              </button>
            </div>
          </div>

          <div className="flex gap-8 md:gap-10 mt-10 overflow-x-auto no-scrollbar">
            {[
              { id: 'inventory', label: t.tabs.inventory, icon: '📦' },
              { id: 'categories', label: t.tabs.categories, icon: '📂' },
              { id: 'business', label: t.tabs.business, icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-5 text-xs md:text-sm font-black transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-500'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {activeTab === 'inventory' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: t.stats.total, value: totalPallets, sub: 'إجمالي الطلبيات', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/15' },
                { label: t.stats.active, value: activePallets, sub: 'حاليًا نشط', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/15' },
                { label: t.stats.margin, value: `${averageMargin.toFixed(1)}%`, sub: 'هامش الربح >15%', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/15' },
                { label: t.stats.potential, value: totalInventoryValue, sub: 'قيمة المخزون', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600', isCurrency: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md"
                >
                  <span className={`inline-block mb-4 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${stat.color}`}>{stat.label}</span>
                  <div className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white english-nums">
                    {stat.isCurrency ? (
                        <FormattedPrice amount={Number(stat.value)} currency="ILS" className="text-2xl md:text-3xl" />
                    ) : (
                        stat.value
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-bold mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[800px]" dir="rtl">
                  <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="px-6 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">{t.table.details}</th>
                      <th className="px-6 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">{t.table.breakdown}</th>
                      <th className="px-6 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">{t.table.metrics}</th>
                      <th className="px-6 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">{t.table.profit}</th>
                      <th className="px-6 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-left">{t.table.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {isLoading && (
                      <tr>
                        <td colSpan={5} className="px-6 md:px-8 py-8 text-center text-gray-400 font-black">
                          جاري تحميل البيانات من الخادم...
                        </td>
                      </tr>
                    )}
                    {error && !isLoading && (
                      <tr>
                        <td colSpan={5} className="px-6 md:px-8 py-4 text-center text-red-500 font-black">
                          {error}
                        </td>
                      </tr>
                    )}
                    {products.filter(productSearchFilter).map((p) => {
                      const pricing = calculateProductPricing(p, settings.conversionRate);
                      const catName = categories.find((c) => c.id === p.categoryId)?.name[language] || 'غير معروف';
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 md:px-8 py-5">
                            <div className="flex items-center gap-4">
                              <img src={p.images[0]} className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl object-cover shadow-sm" alt="" />
                              <div>
                                <p className="font-black text-gray-900 dark:text-white text-sm md:text-base mb-1">{p.name[language]}</p>
                                <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-800 text-gray-400 px-2.5 py-1 rounded-lg uppercase">{catName}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-5 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <FormattedPrice 
                                    amount={pricing.wholesalePricePerPalletILS} 
                                    currency="ILS" 
                                    className="text-sm md:text-base font-black text-gray-900 dark:text-white justify-center"
                                />
                                <p className="text-[11px] text-gray-400 font-bold uppercase english-nums mt-1">{p.itemsPerPallet} وحدة/طبلية</p>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-5 text-center">
                            <div className="flex items-center justify-center gap-1">
                                <FormattedPrice 
                                    amount={pricing.wholesalePricePerItemILS} 
                                    currency="ILS" 
                                    className="text-xs md:text-sm font-black text-gray-700 dark:text-gray-300"
                                />
                                <span className="text-xs md:text-sm font-black text-gray-700 dark:text-gray-300">/ وحدة</span>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-5 text-center">
                                <FormattedPrice 
                                    amount={pricing.totalPotentialProfitPerPalletILS} 
                                    currency="ILS" 
                                    className="text-sm md:text-base font-black text-orange-600 justify-center"
                                />
                            <div className="text-[10px] font-black text-orange-500/80 english-nums">{pricing.profitMarginPercent.toFixed(1)}%</div>
                          </td>
                          <td className="px-6 md:px-8 py-5 text-left">
                            <div className="flex gap-1 md:gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
                              >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id).catch((err) => console.error('Failed to delete', err))}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                              >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">إدارة الفئات</h3>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="bg-orange-500 text-white px-5 py-3 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg"
              >
                + إضافة فئة
              </button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {categories.filter(categorySearchFilter).map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-6 gap-4">
                    <div className="flex items-center gap-4">
                      <img src={c.image} className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800" />
                      <div>
                        <p className="font-black text-gray-900 dark:text-white">{c.name[language]}</p>
                        <p className="text-xs text-gray-400 font-bold">{c.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCategory(c)}
                        className="px-3 py-2 rounded-lg text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'business' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm p-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">إعدادات العمل</h3>
              <form className="space-y-6" onSubmit={handleSaveSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase">رقم الواتساب</label>
                    <input
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl dark:text-white font-bold outline-none focus:ring-2 ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase">رمز العملة</label>
                    <input
                      value={settingsForm.currencyLabel}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, currencyLabel: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl dark:text-white font-bold outline-none focus:ring-2 ring-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase">سعر تحويل الجنيه إلى الشيكل</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={settingsForm.conversionRate}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, conversionRate: Number(e.target.value) }))}
                    className="w-full bg-orange-50 p-4 rounded-xl dark:text-white font-black outline-none focus:ring-2 ring-orange-500"
                  />
                  <p className="text-xs text-gray-400 font-bold">يتم تطبيق هذا السعر على جميع المنتجات.</p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black hover:scale-105 transition-all shadow-lg"
                  >
                    حفظ الإعدادات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {(editingProduct) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-4 overflow-hidden">
          <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-md" onClick={() => setEditingProduct(null)} />
          <form
            onSubmit={handleSaveProduct}
            className="relative bg-white dark:bg-gray-900 w-full h-full md:h-auto md:max-w-4xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[100vh] md:max-h-[95vh] transition-all border-none md:border border-gray-100 dark:border-gray-800"
          >
            <div className="px-6 md:px-10 py-6 md:py-8 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                {editingProduct?.id ? 'تعديل المنتج' : 'إضافة طبلية جديدة'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">اسم المنتج</label>
                  <input
                    name="nameAr"
                    defaultValue={editingProduct?.name.ar}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl md:rounded-2xl dark:text-white text-right outline-none focus:ring-2 ring-orange-500 font-bold shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">وصف المنتج</label>
                  <textarea
                    name="descAr"
                    defaultValue={editingProduct?.description.ar}
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl md:rounded-2xl dark:text-white h-24 md:h-32 text-right outline-none focus:ring-2 ring-orange-500 shadow-inner"
                  />
                </div>
                <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl">
                   <div className="space-y-2">
                     <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">صور المنتج</label>
                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {editingProduct.images.length > 0 && editingProduct.images.map((img, idx) => (
                           <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-700">
                             <img src={img} className="w-full h-full object-cover" />
                             <button
                                type="button"
                                onClick={() => setEditingProduct(prev => prev ? ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }) : null)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all text-xs font-black backdrop-blur-sm"
                             >
                                حذف
                             </button>
                           </div>
                        ))}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all group">
                             <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                             <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-orange-500">إضافة</span>
                             <input
                               type="file"
                               accept="image/*"
                               multiple
                               className="hidden"
                               onChange={async (e) => {
                                 if (e.target.files) {
                                   const newImages: string[] = [];
                                   for (let i = 0; i < e.target.files.length; i++) {
                                      const url = await handleImageUpload(e.target.files[i]);
                                      if (url) newImages.push(url);
                                   }
                                   if (newImages.length > 0) {
                                     setEditingProduct(prev => prev ? ({ ...prev, images: [...prev.images, ...newImages] }) : null);
                                   }
                                 }
                               }}
                             />
                        </label>
                     </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingProduct?.isActive ?? true}
                    className="w-6 h-6 rounded-lg text-orange-600 focus:ring-orange-500 dark:bg-gray-800"
                  />
                  <span className="font-black text-orange-900 text-sm">المنتج نشط ومتوافر</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">سعر الشراء (EGP)</label>
                    <input
                      name="baseCostEGP"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.baseCostEGP}
                      className="w-full bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl md:rounded-2xl dark:text-white font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">تكلفة التوصيل (ILS)</label>
                    <input
                      name="deliveryCostILS"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.deliveryCostPerItemILS}
                      className="w-full bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl md:rounded-2xl dark:text-white font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">سعر البيع (ILS)</label>
                  <input
                    name="sellingPriceILS"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.sellingPricePerItemILS}
                    className="w-full bg-orange-50 p-4 md:p-5 rounded-xl md:rounded-2xl text-orange-600 font-black text-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">وحدات/طبلية</label>
                    <input
                      name="itemsPerPallet"
                      type="number"
                      defaultValue={editingProduct?.itemsPerPallet || 1}
                      className="w-full bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl md:rounded-2xl dark:text-white font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase">الفئة</label>
                    <select
                      name="category"
                      defaultValue={editingProduct?.categoryId}
                      className="w-full bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl md:rounded-2xl dark:text-white font-bold appearance-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name[language]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-10 border-t border-gray-50 dark:border-gray-900 flex justify-end gap-4 md:gap-6 bg-gray-50/50 dark:bg-gray-800/20">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-6 md:px-8 py-3 md:py-4 text-gray-400 font-black hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-grow md:flex-none px-10 md:px-16 py-3 md:py-4 bg-orange-500 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl"
              >
                حفظ المنتج
              </button>
            </div>
          </form>
        </div>
      )}

      {(isAddingCategory || editingCategory) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-md" onClick={() => { setIsAddingCategory(false); setEditingCategory(null); }} />
          <form
            onSubmit={handleSaveCategory}
            className="relative bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{editingCategory ? 'تعديل الفئة' : 'إضافة فئة'}</h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                }}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase">اسم الفئة</label>
                <input
                  name="nameAr"
                  defaultValue={editingCategory?.name.ar}
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl dark:text-white font-bold outline-none focus:ring-2 ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase">صورة</label>
                 <input
                   type="file"
                   accept="image/*"
                   onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                       const url = await handleImageUpload(file);
                       if (url) {
                         setEditingCategory(prev => prev ? ({ ...prev, image: url }) : null);
                         const input = document.getElementById('catImageUrl') as HTMLInputElement;
                         if(input) input.value = url;
                       }
                     }
                   }}
                   className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/30 dark:file:text-orange-400"
                 />
                 <input
                  id="catImageUrl"
                  name="imageUrl"
                  type="hidden"
                  defaultValue={editingCategory?.image}
                />
                 
                 {(editingCategory?.image || (document.getElementById('catImageUrl') as HTMLInputElement)?.value) && (
                   <img 
                      src={editingCategory?.image} 
                      className="w-full h-32 object-cover rounded-xl mt-2 bg-gray-50" 
                      id="preview-cat-image"
                   />
                 )}
              </div>
            </div>
            <div className="px-8 py-6 border-t border-gray-50 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/60 dark:bg-gray-800/30">
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                }}
                className="px-5 py-3 text-gray-500 font-black hover:text-gray-900 dark:hover:text-white"
              >
                إلغاء
              </button>
              <button type="submit" className="px-8 py-3 bg-orange-500 text-white rounded-xl font-black shadow-lg">
                حفظ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
