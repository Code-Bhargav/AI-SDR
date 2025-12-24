export const REQUIRED_FIELDS = [
  'account_linkedin_url',
  'prospect_linkedin_url',
  'product pitched',
  'email',
  'first name',
  'last name',
  'title',
  'department',
  'domain',
  'company name',
  'industry',
  'country',
  'region',
  'esp host',
] as const;

export type RequiredField = typeof REQUIRED_FIELDS[number];

export interface CSVRow {
  [key: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  headers: string[];
}

export interface ParsedCSVData {
  headers: string[];
  rows: CSVRow[];
  rawData: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

