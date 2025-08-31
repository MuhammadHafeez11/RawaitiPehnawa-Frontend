/**
 * Format price in Pakistani Rupees
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Format price without currency symbol
 */
export const formatPriceNumber = (price: number): string => {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};