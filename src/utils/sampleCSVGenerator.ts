import { REQUIRED_FIELDS } from '../types/csvTypes';

/**
 * Generates a sample CSV string with only the required headers (no data rows)
 * @returns CSV string with headers matching the required fields exactly
 */
export function generateSampleCSV(): string {
  // Join the required fields with commas to create the header row
  return REQUIRED_FIELDS.join(',') + '\n';
}

/**
 * Triggers a download of a sample CSV file with required headers
 */
export function downloadSampleCSV(): void {
  const csvContent = generateSampleCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

