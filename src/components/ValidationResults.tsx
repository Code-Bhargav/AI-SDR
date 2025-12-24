import React from 'react';
import { ValidationResult } from '../types/csvTypes';
import './ValidationResults.css';

interface ValidationResultsProps {
  validationResult: ValidationResult | null;
  onSendToN8N?: () => void;
  isSending?: boolean;
  sendSuccess?: boolean;
  sendError?: string | null;
  parseError?: string | null;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  validationResult,
  onSendToN8N,
  isSending = false,
  sendSuccess = false,
  sendError = null,
  parseError = null,
}) => {
  // Show parse error if present (even without validation result)
  if (parseError && !validationResult) {
    return (
      <div className="validation-results-container">
        <div className="validation-error">
          <div className="error-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="validation-title">Error Processing File</h2>
          <p className="validation-message">{parseError}</p>
        </div>
      </div>
    );
  }

  if (!validationResult) {
    return null;
  }

  return (
    <div className="validation-results-container">
      {validationResult.isValid ? (
        <div className="validation-success">
          <div className="success-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="validation-title">Validation Successful</h2>
          <p className="validation-message">
            All required fields are present in your CSV file.
          </p>
          {onSendToN8N && (
            <button
              className="send-button"
              onClick={onSendToN8N}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <span className="button-spinner"></span>
                  Sending to N8N...
                </>
              ) : (
                'Send to N8N Workflow'
              )}
            </button>
          )}
          {sendSuccess && (
            <div className="send-success-message">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Successfully sent to N8N workflow!
            </div>
          )}
          {sendError && (
            <div className="send-error-message">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Error: {sendError}
            </div>
          )}
        </div>
      ) : (
        <div className="validation-error">
          <div className="error-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="validation-title">Validation Failed</h2>
          <p className="validation-message">
            The following required fields are missing from your CSV file:
          </p>
          <ul className="missing-fields-list">
            {validationResult.missingFields.map((field, index) => (
              <li key={index} className="missing-field-item">
                <code>{field}</code>
              </li>
            ))}
          </ul>
          <p className="validation-hint">
            Please update your CSV file to include all required fields and try again.
          </p>
        </div>
      )}
    </div>
  );
};

