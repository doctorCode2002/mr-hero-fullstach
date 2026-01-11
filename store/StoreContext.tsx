"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AppSettings, CartItem, Category, Language, Product, Theme, PalletFillState,
  CartItemWithDetails,
  Notification
} from '../types';
import { calculateProductPricing, calculateItemPalletContribution, calculateTotalPalletFill, getRemainingCapacityForProduct } from '../utils/calculations';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

interface StoreState {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
  cart: CartItem[];
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  theme: Theme;
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setSearchTerm: (term: string) => void;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getPalletFillState: () => PalletFillState;
  getCartItemsWithDetails: () => CartItemWithDetails[];
  canCheckout: boolean;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ 
    whatsappNumber: '', 
    currencyLabel: '$', 
    conversionRate: 47,
    deliveryCostPerPalletUSD: 2200,
    halfPalletDeliveryCostUSD: 1200
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pw_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState<Theme>('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [language, setLanguage] = useState<Language>('ar');

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    // Only show one notification at a time
    setNotifications([{ id, message, type }]);
    // Auto remove after 3 seconds
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    // Theme persistence disabled or always light
    // if (savedTheme) setTheme(savedTheme as Theme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pw_theme', theme);
  }, [theme]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('pw_cart', JSON.stringify(cart));
  }, [cart]);

  // Load data from Supabase
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Check if we have data in localStorage first (for offline support)
        const storedProducts = localStorage.getItem('pw_products');
        const storedCategories = localStorage.getItem('pw_categories');
        const storedSettings = localStorage.getItem('pw_settings');

        if (storedProducts && storedCategories && storedSettings) {
          // Load from localStorage immediately for fast initial render
          try {
            const parsedCategories = JSON.parse(storedCategories);
            // Check for stale data structure (name should be string, not object)
            if (Array.isArray(parsedCategories) && parsedCategories.length > 0 && typeof parsedCategories[0].name === 'object') {
                console.warn("Detected stale category data structure. Clearing localStorage.");
                localStorage.removeItem('pw_categories');
                // Don't set state, wait for Supabase fetch
            } else {
                setCategories(parsedCategories);
            }

            const parsedProducts = JSON.parse(storedProducts);
            if (Array.isArray(parsedProducts) && parsedProducts.length > 0 && typeof parsedProducts[0].name === 'object') {
                 console.warn("Detected stale product data structure. Clearing localStorage.");
                 localStorage.removeItem('pw_products');
            } else {
                setProducts(parsedProducts);
            }

            const parsedSettings = JSON.parse(storedSettings);
            if (typeof parsedSettings.deliveryCostPerPalletUSD === 'undefined') {
                 console.warn("Detected stale settings data. Clearing localStorage.");
                 localStorage.removeItem('pw_settings');
                 // Uses default state values (2200/1200) until Supabase loads
            } else {
                setSettings(parsedSettings);
            }
          } catch (e) {
            console.error("Error parsing localStorage data", e);
            localStorage.clear();
          }
        }

        // Try to load from Supabase (this will work once schema is migrated)
        try {
          const { supabase } = await import('../lib/supabase');
          
          // Load categories
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('Category')
            .select('*')
            .order('createdAt', { ascending: false });

          if (!categoriesError && categoriesData && categoriesData.length > 0) {
            const mappedCategories = categoriesData.map((cat: any) => ({
              id: cat.id,
              name: cat.name || cat.nameAr || '',
              image: cat.image,
            }));
            setCategories(mappedCategories);
            localStorage.setItem('pw_categories', JSON.stringify(mappedCategories));
          }

          // Load products
          const { data: productsData, error: productsError } = await supabase
            .from('Product')
            .select('*')
            .order('createdAt', { ascending: false });

          if (!productsError && productsData && productsData.length > 0) {
            const mappedProducts = productsData.map((p: any) => ({
              id: p.id,
              productId: p.product_id || p.id, // Fallback to ID if product_id not migrated
              categoryId: p.categoryId,
              name: p.name || p.nameAr || '', // Support both schemas
              description: p.description || p.descriptionAr || '', // Support both schemas
              images: p.imagesRaw ? p.imagesRaw.split('|') : [],
              itemsPerPallet: p.itemsPerPallet,
              baseCostEGP: p.baseCostEGP,
              sellingPricePerItemUSD: p.sellingPricePerItemUSD || p.sellingPricePerItemILS || 0,
              isActive: p.isActive,
            }));
            setProducts(mappedProducts);
            localStorage.setItem('pw_products', JSON.stringify(mappedProducts));
          }

          // Load settings
          const { data: settingsData, error: settingsError } = await supabase
            .from('AppSettings')
            .select('*')
            .eq('id', 1)
            .single();

          if (!settingsError && settingsData) {
            const mappedSettings = {
              whatsappNumber: settingsData.whatsappNumber,
              currencyLabel: settingsData.currencyLabel,
              conversionRate: settingsData.conversionRate,
              deliveryCostPerPalletUSD: settingsData.deliveryCostPerPalletUSD || 2200,
              halfPalletDeliveryCostUSD: settingsData.halfPalletDeliveryCostUSD || 1200,
            };
            setSettings(mappedSettings);
            localStorage.setItem('pw_settings', JSON.stringify(mappedSettings));
          }
        } catch (supabaseError) {
          console.log('Supabase not available or schema not migrated yet, using localStorage/seed data');
          
          // If Supabase fails and we don't have localStorage, use seed data
          if (!storedProducts || !storedCategories || !storedSettings) {
            const seedCategories = [
              { id: '1', name: 'أزياء رجالية', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800' },
              { id: '2', name: 'أزياء نسائية', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
              { id: '3', name: 'جوارب وإكسسوارات', image: 'https://images.unsplash.com/photo-1582967702221-412239ecd56d?auto=format&fit=crop&q=80&w=800' },
            ];

            const seedProducts = [
              {
                id: '1',
                productId: 'PROD-001',
                categoryId: '1',
                name: 'تيشيرتات قطنية فاخرة',
                description: 'تيشيرتات قطنية ١٠٠٪ عالية الجودة بألوان متنوعة.',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
                itemsPerPallet: 300,
                baseCostEGP: 50,
                sellingPricePerItemUSD: 2,
                isActive: true,
              },
              {
                id: '2',
                productId: 'PROD-002',
                categoryId: '3',
                name: 'حزمة جوارب رياضية',
                description: 'جوارب رياضية قابلة للتنفس للاستخدام الاحترافي.',
                images: ['https://images.unsplash.com/photo-1582967702221-412239ecd56d?auto=format&fit=crop&q=80&w=800'],
                itemsPerPallet: 300,
                baseCostEGP: 10,
                sellingPricePerItemUSD: 0.5,
                isActive: true,
              },
            ];

            const seedSettings = {
              whatsappNumber: '972501234567',
              currencyLabel: '$',
              conversionRate: 47,
              deliveryCostPerPalletUSD: 2200,
              halfPalletDeliveryCostUSD: 1200,
            };

            setCategories(seedCategories);
            setProducts(seedProducts);
            setSettings(seedSettings);
            localStorage.setItem('pw_categories', JSON.stringify(seedCategories));
            localStorage.setItem('pw_products', JSON.stringify(seedProducts));
            localStorage.setItem('pw_settings', JSON.stringify(seedSettings));
          }
        }
      } catch (err: any) {
        setError(err?.message ?? 'فشل تحميل البيانات');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);


  const getAuthHeaders = () => (adminToken ? { 'x-admin-token': adminToken } : {});

    const loginAdmin = async (username: string, password: string) => {
    try {
      const envUsername = (import.meta as any).env?.VITE_ADMIN_USERNAME;
      const envPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD;

      if (username === envUsername && password === envPassword) {
        setAdminToken('mock-token');
        setIsAdminAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login Exception:', err);
      setIsAdminAuthenticated(false);
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setIsAdminAuthenticated(false);
  };

  const addProduct = async (p: Omit<Product, 'id'>) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;
    
    // Check for duplicate product_id
    if (products.some(prod => prod.productId === p.productId)) {
      throw new Error(`Product ID "${p.productId}" already exists. Please use a unique ID.`);
    }
    
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.from('Product').insert([{
        id, // Generate ID frontend-side for database consistency
        product_id: p.productId,
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        imagesRaw: p.images.join('|'),
        itemsPerPallet: p.itemsPerPallet,
        baseCostEGP: p.baseCostEGP,
        sellingPricePerItemUSD: p.sellingPricePerItemUSD,
        isActive: p.isActive
      }]).select();

      if (error) {
        console.warn('Supabase save error, using local fallback:', error);
      }
      
      let newProduct: Product;
      if (data && data[0]) {
        const pData = data[0];
        newProduct = {
          ...p,
          id: pData.id,
        };
      } else {
        newProduct = { ...p, id };
      }
      
      const updated = [newProduct, ...products]; // Newest first
      setProducts(updated);
      localStorage.setItem('pw_products', JSON.stringify(updated));
    } catch (err) {
      console.error('Supabase save failed completely, falling back to local only:', err);
      const newProduct = { ...p, id: `local-${Date.now()}` };
      const updated = [newProduct, ...products];
      setProducts(updated);
      localStorage.setItem('pw_products', JSON.stringify(updated));
    }
  };

  const updateProduct = async (p: Product) => {
    // Check for duplicate product_id (excluding current product)
    if (products.some(prod => prod.productId === p.productId && prod.id !== p.id)) {
      throw new Error(`Product ID "${p.productId}" already exists. Please use a unique ID.`);
    }
    
    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.from('Product').update({
        product_id: p.productId,
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        imagesRaw: p.images.join('|'),
        itemsPerPallet: p.itemsPerPallet,
        baseCostEGP: p.baseCostEGP,
        sellingPricePerItemUSD: p.sellingPricePerItemUSD,
        isActive: p.isActive
      }).eq('id', p.id);

      if (error) throw error;
    } catch (err) {
      console.error('Supabase update failed:', err);
    }
    const updated = products.map((x) => (x.id === p.id ? p : x));
    setProducts(updated);
    localStorage.setItem('pw_products', JSON.stringify(updated));
  };

  const deleteProduct = async (id: string) => {
    try {
      const { supabase } = await import('../lib/supabase');
      await supabase.from('Product').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete failed:', err);
    }
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('pw_products', JSON.stringify(updated));
  };

  const addCategory = async (c: Omit<Category, 'id'>) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`;
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.from('Category').insert([{
        id, // Explicit ID for Supabase
        name: c.name,
        image: c.image
      }]).select();

      if (error) {
        console.warn('Supabase cat save error:', error);
      }
      
      let newCat: Category;
      if (data && data[0]) {
        const cData = data[0];
        newCat = {
          ...c,
          id: cData.id,
          name: cData.nameAr || c.name
        };
      } else {
        newCat = { ...c, id: data?.[0]?.id || id };
      }
      
      const updated = [newCat, ...categories];
      setCategories(updated);
      localStorage.setItem('pw_categories', JSON.stringify(updated));
    } catch (err) {
      const newCat = { ...c, id: `local-cat-${Date.now()}` };
      const updated = [newCat, ...categories];
      setCategories(updated);
      localStorage.setItem('pw_categories', JSON.stringify(updated));
    }
  };

  const updateCategory = async (c: Category) => {
    try {
      const { supabase } = await import('../lib/supabase');
      await supabase.from('Category').update({
        name: c.name,
        image: c.image
      }).eq('id', c.id);
    } catch (err) {
      console.error('Supabase cat update failed:', err);
    }
    const updated = categories.map((x) => (x.id === c.id ? c : x));
    setCategories(updated);
    localStorage.setItem('pw_categories', JSON.stringify(updated));
  };

  const deleteCategory = async (id: string) => {
    try {
      const { supabase } = await import('../lib/supabase');
      await supabase.from('Category').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase cat delete failed:', err);
    }
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('pw_categories', JSON.stringify(updated));
  };

  const updateSettings = async (s: AppSettings) => {
    try {
      const { supabase } = await import('../lib/supabase');
      // Assuming settings is a single row in AppSettings table, or we just update by some key
      await supabase.from('AppSettings').upsert({
        id: 'global', // Using a fixed ID for global settings
        whatsappNumber: s.whatsappNumber,
        currencyLabel: s.currencyLabel,
        conversionRate: s.conversionRate,
        deliveryCostPerPalletUSD: s.deliveryCostPerPalletUSD,
        halfPalletDeliveryCostUSD: s.halfPalletDeliveryCostUSD
      });
    } catch (err) {
      console.error('Settings sync failed:', err);
    }
    setSettings(s);
    localStorage.setItem('pw_settings', JSON.stringify(s));
  };

  const toggleTheme = () => {
    // Theme toggle disabled
    setTheme('light');
  };

  // Get cart items with full product details and pricing
  const getCartItemsWithDetails = (): CartItemWithDetails[] => {
    return cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      const pricing = calculateProductPricing(product, settings.conversionRate);
      const fillPercentage = calculateItemPalletContribution(product.itemsPerPallet, item.quantity);
      return { ...item, product, pricing, fillPercentage };
    }).filter(Boolean) as CartItemWithDetails[];
  };

  // Calculate pallet fill state
  const getPalletFillState = (): PalletFillState => {
    const cartItems = getCartItemsWithDetails();
    const totalFillPercentage = calculateTotalPalletFill(cartItems.map(item => ({ quantity: item.quantity, product: item.product })));
    
    // Determine status and validation
    // Valid states: 50, 100, 150, 200... (multiples of 50)
    const isValid = totalFillPercentage > 0 && totalFillPercentage % 50 === 0;
    
    let status: PalletFillState['status'];
    let message = '';
    
    const palletsCount = Math.floor(totalFillPercentage / 100);
    const currentPalletFill = totalFillPercentage % 100;

    if (totalFillPercentage === 0) {
      status = 'empty';
      message = 'السلة فارغة. أضف منتجات لتبدأ';
    } else if (isValid) {
      status = totalFillPercentage % 100 === 0 ? 'at-100' : 'at-50';
      if (totalFillPercentage === 50) message = '✓ جاهز: نصف طبلية';
      else if (totalFillPercentage === 100) message = '✓ جاهز: طبلية كاملة';
      else {
        const fullPallets = Math.floor(totalFillPercentage / 100);
        const hasHalf = totalFillPercentage % 100 === 50;
        message = `✓ جاهز: ${fullPallets} طبلية${hasHalf ? ' ونصف' : ''}`;
      }
    } else if (currentPalletFill < 50) {
      status = 'under-50';
      message = `أكمل حتى ٥٠٪ أو ١٠٠٪ من الطبلية الحالية (الحالي: ${totalFillPercentage}٪)`;
    } else {
      status = 'between-50-100';
      message = `أكمل حتى ١٠٠٪ أو أنقص لـ ٥٠٪ من الطبلية الحالية (الحالي: ${totalFillPercentage}٪)`;
    }
    
    // Calculate segments (e.g. 150% -> [100, 50])
    const segments: number[] = [];
    let remainingPercentage = totalFillPercentage;
    while (remainingPercentage > 100) {
      segments.push(100);
      remainingPercentage -= 100;
    }
    if (remainingPercentage > 0 || totalFillPercentage === 0) {
      segments.push(remainingPercentage);
    }

    return {
      totalFillPercentage,
      segments,
      isValid,
      canCheckout: isValid,
      remainingToFifty: 50 - currentPalletFill > 0 ? 50 - currentPalletFill : 0,
      remainingToHundred: 100 - currentPalletFill > 0 ? 100 - currentPalletFill : 0,
      status,
      message,
    };
  };

  // Checkout availability derived from pallet fill state
  const canCheckout = useMemo(() => {
    return getPalletFillState().isValid;
  }, [cart, products]);


  const addToCart = (productId: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      
      // Calculate new fill percentage if we add this quantity
      const product = products.find(p => p.id === productId);
      if (!product) return prev;
      
      const currentFill = calculateTotalPalletFill(prev.map(item => {
        const p = products.find(pr => pr.id === item.productId);
        return p ? { quantity: item.quantity, product: p } : null;
      }).filter(Boolean) as any[]);
      
      const newQuantity = existing ? existing.quantity + quantity : quantity;
      const newItemFill = calculateItemPalletContribution(product.itemsPerPallet, newQuantity);
      const oldItemFill = existing ? calculateItemPalletContribution(product.itemsPerPallet, existing.quantity) : 0;
      const newTotalFill = currentFill - oldItemFill + newItemFill;
      
      // Removed 100% limit block to allow multi-pallet buying
      
      showNotification('تمت الإضافة للسلة بنجاح', 'success');
      
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => setCart((prev) => prev.filter((i) => i.productId !== productId));
  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const product = products.find(p => p.id === productId);
      if (!product) return prev;

      const currentFill = calculateTotalPalletFill(prev.map(item => {
        const p = products.find(pr => pr.id === item.productId);
        return p ? { quantity: item.quantity, product: p } : null;
      }).filter(Boolean) as any[]);

      const existing = prev.find(i => i.productId === productId);
      const oldItemFill = existing ? calculateItemPalletContribution(product.itemsPerPallet, existing.quantity) : 0;
      const newItemFill = calculateItemPalletContribution(product.itemsPerPallet, Math.max(1, quantity));
      const newTotalFill = currentFill - oldItemFill + newItemFill;

      // Removed 100% limit block
      return prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i));
    });
  };
  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        language,
        setLanguage,
        notifications,
        showNotification,
        removeNotification,
        theme,
        isAdmin,
        isAdminAuthenticated,
        isLoading,
        error,
        setTheme,
        toggleTheme,
        setIsAdmin,
        searchTerm,
        setSearchTerm,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getPalletFillState,
        getCartItemsWithDetails,
        canCheckout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
