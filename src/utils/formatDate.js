/**
 * Date formatting utilities for Indian locale
 */

/**
 * Format a date string to Indian format (DD MMM YYYY)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatToIndian(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Calculate days remaining until a future date
 * @param {string|Date} targetDate
 * @returns {number}
 */
export function daysUntil(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Check if a festival is happening within the next 30 days
 * @param {string|Date} festivalDate
 * @returns {boolean}
 */
export function isFestivalSoon(festivalDate) {
  const days = daysUntil(festivalDate);
  return days > 0 && days <= 30;
}

/**
 * Get season label based on month
 * @param {number} month - 0-indexed month (0 = Jan, 11 = Dec)
 * @returns {string}
 */
export function getSeasonLabel(month) {
  if (month === undefined || month === null) {
    month = new Date().getMonth();
  }
  if (month >= 2 && month <= 5) return 'Summer ☀️';
  if (month >= 6 && month <= 8) return 'Monsoon 🌧️';
  if (month >= 9 && month <= 10) return 'Autumn 🍂';
  return 'Winter ❄️';
}

/**
 * Format a date range for display
 * @param {string|Date} start
 * @param {string|Date} end
 * @returns {string}
 */
export function formatDateRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const startStr = s.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const endStr = e.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

/**
 * Get a relative time string (e.g., "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatToIndian(date);
}

/**
 * Format time string for chat timestamps
 * @param {string|Date} date
 * @returns {string}
 */
export function formatChatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
