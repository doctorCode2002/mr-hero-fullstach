
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface Category {
  id: string;
  image: string;
  name: string; // Arabic only
}

export interface Product {
  id: string;
  productId: string; // Unique product identifier (admin input)
  categoryId: string;
  images: string[];
  name: string; // Arabic only
  description: string; // Arabic only
  itemsPerPallet: number;
  baseCostEGP: number; // Cost per item in EGP
  sellingPricePerItemUSD: number; // Expected selling price per item in USD
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number; // Number of ITEMS (not pallets)
}

export interface PalletFillState {
  totalFillPercentage: number; // 0-100+
  segments: number[]; // e.g. [100, 50] for 150% fill
  isValid: boolean; // true if exactly 50% or 100%
  canCheckout: boolean; // same as isValid
  remainingToFifty: number; // items needed to reach 50%
  remainingToHundred: number; // items needed to reach 100%
  status: 'empty' | 'under-50' | 'at-50' | 'between-50-100' | 'at-100' | 'over-100';
  message: string; // Arabic guidance message
}

export interface CartItemWithDetails extends CartItem {
  product: Product;
  fillPercentage: number; // How much this item contributes to pallet fill
  pricing: CalculatedPricing;
}

export interface AppSettings {
  whatsappNumber: string;
  currencyLabel: string; // e.g. "$" or "USD"
  conversionRate: number; // global EGP->USD (e.g. 47)
  deliveryCostPerPalletUSD: number; // Full pallet delivery cost in USD
  halfPalletDeliveryCostUSD: number; // Half pallet delivery cost in USD
}

export interface CalculatedPricing {
  baseCostEGP: number; // Item cost in EGP (shown to guest)
  sellingPriceUSD: number; // Expected selling price per item in USD
  profitPerItemUSD: number; // Profit per item in USD
  profitPerPalletUSD: number; // Total profit for full pallet in USD
  profitMarginPercent: number; // Profit margin percentage
}
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
