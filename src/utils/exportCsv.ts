import type { Transaction } from '../types';
import { formatDateSegment } from './formatters';

export const downloadTransactionsCsv = (transactions: Transaction[]) => {
  if (!transactions || transactions.length === 0) {
    console.warn('No transactions available to export.');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Amount', 'Category', 'Type'];
  
  // Format transactions to CSV rows
  const csvRows = transactions.map(tx => {
    // Extract required fields
    const date = formatDateSegment(tx.date, { year: 'numeric', month: '2-digit', day: '2-digit' });
    const amount = tx.amount.toFixed(2);
    const category = tx.category;
    // Capitalize type
    const type = tx.type.charAt(0).toUpperCase() + tx.type.slice(1);
    
    // Construct row array and handle edge cases where text might contain commas
    return [
      `"${date}"`, 
      amount, 
      `"${category}"`, 
      `"${type}"`
    ].join(',');
  });

  // Combine headers and rows
  const csvString = [headers.join(','), ...csvRows].join('\n');
  
  // Create Blob and trigger download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'finance-report.csv');
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
