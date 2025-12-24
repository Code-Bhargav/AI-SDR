import { useState } from 'react';
import { CSVUploader } from './components/CSVUploader';
import { ValidationResults } from './components/ValidationResults';
import { WebhookConfig } from './components/WebhookConfig';
import { parseCSVFile } from './utils/csvParser';
import { validateCSVFile } from './utils/csvValidator';
import { sendToN8NWebhook } from './utils/n8nIntegration';
import { downloadSampleCSV } from './utils/sampleCSVGenerator';
import { ValidationResult, ParsedCSVData } from './types/csvTypes';
import './styles/App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setSendError('Invalid file type. Please upload a CSV file.');
      return;
    }

    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setSendError('File size exceeds the maximum limit of 10MB. Please upload a smaller file.');
      return;
    }

    if (file.size === 0) {
      setSendError('The file is empty. Please upload a valid CSV file.');
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);
    setValidationResult(null);
    setParsedData(null);
    setSendSuccess(false);
    setSendError(null);

    try {
      // Parse the CSV file
      const data = await parseCSVFile(file);

      // Check if file has headers
      if (!data.headers || data.headers.length === 0) {
        throw new Error('CSV file appears to be empty or has no headers. Please check your file format.');
      }

      // Check if file has data rows
      if (!data.rows || data.rows.length === 0) {
        throw new Error('CSV file has no data rows. Please ensure your file contains data.');
      }

      // Validate the headers
      const validation = validateCSVFile(data.headers);

      setParsedData(data);
      setValidationResult(validation);
    } catch (error) {
      console.error('Error processing CSV file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process CSV file. Please ensure the file is a valid CSV format.';
      setValidationResult({
        isValid: false,
        missingFields: [],
        headers: [],
      });
      setSendError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToN8N = async () => {
    if (!parsedData || !webhookUrl) {
      setSendError('Please configure the N8N webhook URL first');
      return;
    }

    setIsSending(true);
    setSendSuccess(false);
    setSendError(null);

    try {
      const response = await sendToN8NWebhook(webhookUrl, parsedData);
      if (response.success) {
        setSendSuccess(true);
        setSendError(null);
      } else {
        setSendSuccess(false);
        setSendError(response.error || 'Failed to send data to N8N');
      }
    } catch (error) {
      setSendSuccess(false);
      setSendError(error instanceof Error ? error.message : 'Failed to send data to N8N');
    } finally {
      setIsSending(false);
    }
  };

  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
  };

  const handleDownloadSample = () => {
    downloadSampleCSV();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>A.I SDR Workflow</h1>
        <p className="app-subtitle">
          Upload your CSV file to validate required fields and send to N8N workflow
        </p>
        <div className="csv-instructions">
          <p className="csv-instructions-title">CSV Header Format Instructions:</p>
          <ul className="csv-instructions-list">
            <li>Use only lowercase letters for column headers</li>
            <li>Use spaces (" ") instead of underscores ("_") in header names</li>
          </ul>
        </div>
      </header>

      <main className="app-main">
        <WebhookConfig onUrlChange={handleWebhookUrlChange} />

        <CSVUploader
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
          acceptedFile={selectedFile}
        />

        <div className="sample-csv-container">
          <button className="download-sample-button" onClick={handleDownloadSample}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Sample CSV
          </button>
        </div>

        {(validationResult || sendError) && (
          <ValidationResults
            validationResult={validationResult}
            onSendToN8N={validationResult?.isValid ? handleSendToN8N : undefined}
            isSending={isSending}
            sendSuccess={sendSuccess}
            sendError={sendError && validationResult?.isValid ? sendError : null}
            parseError={sendError && !validationResult ? sendError : null}
          />
        )}
      </main>
    </div>
  );
}

export default App;

