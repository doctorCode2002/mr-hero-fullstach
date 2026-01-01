
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface Category {
  id: string;
  image: string;
  name: {
    en: string;
    ar: string;
  };
}

export interface Product {
  id: string;
  categoryId: string;
  images: string[];
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  itemsPerPallet: number;
  baseCostEGP: number;
  conversionRate: number; // EGP to ILS
  deliveryCostPerItemILS: number;
  sellingPricePerItemILS: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number; // Number of pallets
}

export interface AppSettings {
  whatsappNumber: string;
  currencyLabel: string; // ILS
  conversionRate: number; // global EGP->ILS
}

export interface CalculatedPricing {
  convertedCostILS: number;
  wholesalePricePerItemILS: number;
  potentialProfitPerItemILS: number;
  profitMarginPercent: number;
  wholesalePricePerPalletILS: number;
  totalPotentialProfitPerPalletILS: number;
}
