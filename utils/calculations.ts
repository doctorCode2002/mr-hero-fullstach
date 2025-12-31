
import { Product, CalculatedPricing } from '../types';

export const calculateProductPricing = (product: Product, overrideConversionRate?: number): CalculatedPricing => {
  const conversionRate = overrideConversionRate ?? product.conversionRate;
  const convertedCostILS = product.baseCostEGP * conversionRate;
  const profitPerItemILS = product.sellingPricePerItemILS - (convertedCostILS + product.deliveryCostPerItemILS);
  const profitMarginPercent = (profitPerItemILS / product.sellingPricePerItemILS) * 100;

  const itemCostPerPalletILS = convertedCostILS * product.itemsPerPallet;
  const deliveryCostPerPalletILS = product.deliveryCostPerItemILS * product.itemsPerPallet;
  
  const totalSellingPricePerPalletILS = product.sellingPricePerItemILS * product.itemsPerPallet;
  const totalCostPerPalletILS = itemCostPerPalletILS + deliveryCostPerPalletILS;
  const totalProfitPerPalletILS = totalSellingPricePerPalletILS - totalCostPerPalletILS;

  return {
    convertedCostILS,
    profitPerItemILS,
    profitMarginPercent,
    itemCostPerPalletILS,
    deliveryCostPerPalletILS,
    totalCostPerPalletILS,
    totalSellingPricePerPalletILS,
    totalProfitPerPalletILS,
  };
};

export const formatCurrency = (amount: number, currency: string = 'ILS', lang: string = 'en') => {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
};
