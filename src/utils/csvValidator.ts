import { ValidationResult, REQUIRED_FIELDS } from '../types/csvTypes';

export function validateCSVHeaders(headers: string[]): ValidationResult {
  const headerSet = new Set(headers);
  const missingFields: string[] = [];

  // Check each required field (case-sensitive)
  for (const field of REQUIRED_FIELDS) {
    if (!headerSet.has(field)) {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    headers,
  };
}

export function validateCSVFile(headers: string[]): ValidationResult {
  return validateCSVHeaders(headers);
}

