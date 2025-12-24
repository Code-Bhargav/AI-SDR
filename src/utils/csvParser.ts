import Papa from 'papaparse';
import { ParsedCSVData, CSVRow } from '../types/csvTypes';

export interface ParseCSVOptions {
  onComplete?: (result: ParsedCSVData) => void;
  onError?: (error: Error) => void;
}

export async function parseCSVFile(file: File): Promise<ParsedCSVData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;

      if (!text) {
        reject(new Error('Failed to read file'));
        return;
      }

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const headers = results.meta.fields || [];
            const rows = results.data as CSVRow[];

            resolve({
              headers,
              rows,
              rawData: text,
            });
          } catch (error) {
            reject(new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

export function extractHeaders(csvText: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      preview: 1,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        resolve(headers);
      },
      error: (error) => {
        reject(new Error(`Failed to extract headers: ${error.message}`));
      },
    });
  });
}

