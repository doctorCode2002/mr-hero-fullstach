
import { Product, CalculatedPricing } from '../types';

export const calculateProductPricing = (product: Product, overrideConversionRate?: number): CalculatedPricing => {
  // Conversion Rate is now expected to be "How many EGP in 1 ILS" (e.g. 13.5)
  // To get ILS from EGP, we DIVIDE by the rate.
  const conversionRate = overrideConversionRate ?? product.conversionRate;
  
  // Guard against zero division
  const safeRate = conversionRate === 0 ? 1 : conversionRate;
  const convertedCostILS = product.baseCostEGP / safeRate;

  // Cost per item (Base + Delivery) -> This is now the "Wholesale Price" the customer pays.
  const wholesalePricePerItemILS = convertedCostILS + product.deliveryCostPerItemILS;

  // Profit (margin for the customer) = Their Selling Price (RRP) - What they pay us (Wholesale)
  const potentialProfitPerItemILS = product.sellingPricePerItemILS - wholesalePricePerItemILS;
  const profitMarginPercent = (potentialProfitPerItemILS / product.sellingPricePerItemILS) * 100;

  // Pallet Totals
  const wholesalePricePerPalletILS = wholesalePricePerItemILS * product.itemsPerPallet;
  
  // The "Total Profit" for the customer if they sell the whole pallet
  const totalPotentialProfitPerPalletILS = potentialProfitPerItemILS * product.itemsPerPallet;

  return {
    convertedCostILS,
    wholesalePricePerItemILS, // Was profitPerItemILS (renamed concept)
    potentialProfitPerItemILS,
    profitMarginPercent,
    wholesalePricePerPalletILS, // The main price to show
    totalPotentialProfitPerPalletILS,
  };
};

export const formatCurrency = (amount: number, currency: string = 'ILS', lang: string = 'en') => {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
};
