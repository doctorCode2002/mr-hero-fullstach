
import { Product, CalculatedPricing } from '../types';

/**
 * Calculate product pricing for display to guest
 * @param product - Product with baseCostEGP and sellingPricePerItemUSD
 * @param conversionRate - EGP to USD conversion rate (e.g. 47 means 47 EGP = 1 USD)
 * @returns Pricing information for display
 */
export const calculateProductPricing = (product: Product, conversionRate: number): CalculatedPricing => {
  // Guard against zero division
  const safeRate = conversionRate === 0 ? 47 : conversionRate;
  
  // Base cost in EGP (shown directly to guest)
  const baseCostEGP = product.baseCostEGP;
  
  // Expected selling price in USD (from admin input)
  const sellingPriceUSD = product.sellingPricePerItemUSD;
  
  // Convert base cost to USD for profit calculation
  const baseCostUSD = baseCostEGP / safeRate;
  
  // Profit per item in USD (selling price - base cost in USD)
  // Note: Delivery cost is calculated separately based on total pallet fill
  const profitPerItemUSD = sellingPriceUSD - baseCostUSD;
  
  // Profit for full pallet (before delivery cost)
  const profitPerPalletUSD = profitPerItemUSD * product.itemsPerPallet;
  
  // Profit margin percentage
  const profitMarginPercent = sellingPriceUSD > 0 
    ? (profitPerItemUSD / sellingPriceUSD) * 100 
    : 0;

  return {
    baseCostEGP,
    sellingPriceUSD,
    profitPerItemUSD,
    profitPerPalletUSD,
    profitMarginPercent,
  };
};

/**
 * Calculate delivery cost based on total pallet fill percentage
 * @param totalFillPercentage - Total fill percentage (e.g. 150 for 1.5 pallets)
 * @param deliveryCostPerPalletUSD - Cost for full pallet delivery
 * @param halfPalletDeliveryCostUSD - Cost for half pallet delivery
 * @returns Total delivery cost in USD
 */
export const calculateDeliveryCost = (
  totalFillPercentage: number,
  deliveryCostPerPalletUSD: number,
  halfPalletDeliveryCostUSD: number
): number => {
  // No delivery cost if less than 50%
  if (totalFillPercentage < 50) {
    return 0;
  }
  
  // Calculate number of full pallets
  const fullPallets = Math.floor(totalFillPercentage / 100);
  const remainder = totalFillPercentage % 100;
  
  // Case 1: First Pallet (or less)
  if (fullPallets === 0) {
    // If only half pallet (50%), use the configured Half Pallet Price (e.g. 1200)
    return remainder >= 50 ? halfPalletDeliveryCostUSD : 0;
  }
  
  // Case 2: One or more full pallets
  let deliveryCost = fullPallets * deliveryCostPerPalletUSD;
  
  // Add half pallet cost if remainder is >= 50%
  if (remainder >= 50) {
    // For extra pallets (> 100%), the half price is strictly Half of the Full Price (e.g. 1100)
    // as per user requirement, overriding the configured Half Pallet Price.
    deliveryCost += (deliveryCostPerPalletUSD / 2);
  }
  
  return deliveryCost;
};

export const formatCurrency = (amount: number, currency: string = 'ILS', lang: string = 'en') => {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
};

// Pallet Fill Logic

/**
 * Calculate how much a specific quantity of items contributes to pallet fill
 * Formula: (selectedQuantity / unitsForFullPallet) * 100
 * @param itemsPerPallet - Units that equal 100% pallet fill for this product
 * @param quantity - Number of items being added
 * @returns Fill percentage (0-100)
 */
export const calculateItemPalletContribution = (itemsPerPallet: number, quantity: number): number => {
  if (itemsPerPallet <= 0) return 0;
  // Precision handling to avoid float issues in comparisons
  return parseFloat(((quantity / itemsPerPallet) * 100).toFixed(2));
};

/**
 * Calculate total pallet fill from all cart items
 * @param cartItems - Array of cart items with product details
 * @returns Total fill percentage
 */
export const calculateTotalPalletFill = (cartItems: Array<{ quantity: number; product: Product }>): number => {
  const total = cartItems.reduce((acc, item) => {
    return acc + ((item.quantity / item.product.itemsPerPallet) * 100);
  }, 0);
  // Consistent rounding for comparison
  return parseFloat(total.toFixed(2));
};

/**
 * Get remaining capacity for a specific product to reach target fill percentage
 * @param currentTotalFill - Current total fill percentage of the cart
 * @param targetFill - Target fill (50 or 100)
 * @param productItemsPerPallet - Units for 100% of the product in question
 * @returns Number of items needed of THIS product to reach target
 */
export const getRemainingCapacityForProduct = (currentTotalFill: number, targetFill: number, productItemsPerPallet: number): number => {
  const remainingPercentage = targetFill - currentTotalFill;
  if (remainingPercentage <= 0) return 0;
  return Math.ceil((remainingPercentage / 100) * productItemsPerPallet);
};
