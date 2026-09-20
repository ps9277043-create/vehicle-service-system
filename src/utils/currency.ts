/**
 * Formats a numeric value into Indian Rupee (₹) representation.
 * Supports standard Indian numbering format (e.g., ₹1,45,000).
 */
export const formatINR = (amount: number, showDecimals: boolean = false): string => {
  if (isNaN(amount)) return '₹0';
  
  if (showDecimals) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
