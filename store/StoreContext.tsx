"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, CartItem, Category, Language, Product, Theme } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface StoreState {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
  cart: CartItem[];
  language: Language;
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
  loginAdmin: (password: string) => Promise<boolean>;
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
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ whatsappNumber: '', currencyLabel: 'ILS', conversionRate: 0.1 });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<Theme>('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const language: Language = 'ar';

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

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const loadResource = async (path: string) => {
          const res = await fetch(`${API_URL}${path}`);
          if (!res.ok) throw new Error('فشل تحميل البيانات من الخادم');
          return res.json();
        };
        const [productsRes, categoriesRes, settingsRes] = await Promise.all([
          loadResource('/products'),
          loadResource('/categories'),
          loadResource('/settings'),
        ]);
        setProducts(productsRes);
        setCategories(categoriesRes);
        setSettings(settingsRes);
      } catch (err: any) {
        setError(err?.message ?? 'فشل تحميل البيانات من الخادم');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const getAuthHeaders = () => (adminToken ? { 'x-admin-token': adminToken } : {});

  const loginAdmin = async (password: string) => {
    try {
      console.log('Attempting login to:', `${API_URL}/auth/login`);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Login Failed:', res.status, res.statusText, errorText);
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setAdminToken(data.token);
      setIsAdminAuthenticated(true);
      return true;
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
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const saved = await res.json();
    setProducts((prev) => [...prev, saved]);
  };

  const updateProduct = async (p: Product) => {
    const res = await fetch(`${API_URL}/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error('Failed to update product');
    const saved = await res.json();
    setProducts((prev) => prev.map((old) => (old.id === saved.id ? saved : old)));
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete product');
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = async (c: Omit<Category, 'id'>) => {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(c),
    });
    if (!res.ok) throw new Error('Failed to create category');
    const saved = await res.json();
    setCategories((prev) => [...prev, saved]);
  };

  const updateCategory = async (c: Category) => {
    const res = await fetch(`${API_URL}/categories/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(c),
    });
    if (!res.ok) throw new Error('Failed to update category');
    const saved = await res.json();
    setCategories((prev) => prev.map((old) => (old.id === saved.id ? saved : old)));
  };

  const deleteCategory = async (id: string) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete category');
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateSettings = async (s: AppSettings) => {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(s),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const saved = await res.json();
    setSettings(saved);
  };

  const toggleTheme = () => {
    // Theme toggle disabled
    setTheme('light');
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => setCart((prev) => prev.filter((i) => i.productId !== productId));
  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
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
