/**
 * Common formatting algorithms standardizing parsing logic application-wide.
 */

export const formatCurrency = (amount: number, type?: 'income' | 'expense', minimal: boolean = false): string => {
  const prefix = type ? (type === 'income' ? '+' : '-') : '';
  const formatted = amount.toLocaleString('en-US', { 
    minimumFractionDigits: minimal ? 0 : 2,
    maximumFractionDigits: minimal ? 0 : 2
  });
  return `${prefix}$${formatted}`;
};

export const formatDateSegment = (dateString: string | Date, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }): string => {
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
