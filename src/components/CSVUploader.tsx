import React, { useRef, useState, DragEvent } from 'react';
import './CSVUploader.css';

interface CSVUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  acceptedFile?: File | null;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({
  onFileSelect,
  isLoading = false,
  acceptedFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      onFileSelect(file);
    } else {
      alert('Please select a CSV file. Only .csv files are accepted.');
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      onFileSelect(file);
    } else {
      alert('Please drop a CSV file. Only .csv files are accepted.');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="csv-uploader-container">
      <div
        className={`csv-uploader-dropzone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        <div className="upload-icon">
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </div>
        <p className="upload-text">
          {isLoading
            ? 'Processing CSV file...'
            : acceptedFile
            ? 'Click or drag to replace CSV file'
            : 'Click or drag CSV file here to upload'}
        </p>
        {acceptedFile && (
          <div className="file-info">
            <p className="file-name">{acceptedFile.name}</p>
            <p className="file-size">{formatFileSize(acceptedFile.size)}</p>
          </div>
        )}
        <p className="upload-hint">Only CSV files are accepted</p>
      </div>
    </div>
  );
};

