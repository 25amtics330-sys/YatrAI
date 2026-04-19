/**
 * Budget formatting utilities for Indian Rupee
 */

/**
 * Format number to INR with ₹ symbol
 * @param {number} amount
 * @returns {string}
 */
export function toINR(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compact INR formatting (e.g., ₹1.5L, ₹25K)
 * @param {number} amount
 * @returns {string}
 */
export function compactINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

/**
 * Get budget category label
 * @param {number} perDay - Budget per day
 * @returns {string}
 */
export function budgetLabel(perDay) {
  if (perDay < 2000) return 'Budget';
  if (perDay < 5000) return 'Moderate';
  if (perDay < 15000) return 'Luxury';
  return 'Ultra Luxury';
}

/**
 * Split a total budget into category percentages
 * @param {number} total
 * @returns {object}
 */
export function splitBudget(total) {
  return {
    hotel: Math.round(total * 0.35),
    food: Math.round(total * 0.20),
    transport: Math.round(total * 0.15),
    activities: Math.round(total * 0.20),
    shopping: Math.round(total * 0.10),
  };
}

/**
 * Calculate budget utilization percentage
 * @param {number} spent
 * @param {number} total
 * @returns {number}
 */
export function budgetUtilization(spent, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((spent / total) * 100));
}

/**
 * Get budget status color based on spend percentage
 * @param {number} percent
 * @returns {string}
 */
export function budgetStatusColor(percent) {
  if (percent < 60) return 'var(--color-success)';
  if (percent < 85) return 'var(--color-warning)';
  return 'var(--color-danger)';
}
