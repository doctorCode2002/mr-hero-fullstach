import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false, // We're using simple password auth for admin
  },
});

// Helper types for database tables
export type Database = {
  Category: {
    id: string;
    nameEn: string;
    nameAr: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
  Product: {
    id: string;
    categoryId: string;
    nameEn: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr: string;
    imagesRaw: string;
    itemsPerPallet: number;
    baseCostEGP: number;
    conversionRate: number;
    deliveryCostPerItemILS: number;
    sellingPricePerItemILS: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  AppSettings: {
    id: number;
    whatsappNumber: string;
    currencyLabel: string;
    conversionRate: number;
    createdAt: string;
    updatedAt: string;
  };
};
