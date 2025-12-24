# CSV Validation Frontend

A React + TypeScript frontend application that validates CSV file structure against required fields and integrates with N8N workflow via webhook.

## Features

- 📤 Drag-and-drop CSV file upload
- ✅ Validates CSV files against 14 required fields (case-sensitive)
- 🔍 Shows detailed validation results with missing fields
- 🔗 Sends validated data to N8N workflow via webhook
- 🎨 Modern, responsive UI
- ⚡ Real-time validation feedback

## Required Fields

The following fields must be present in your CSV file (case-sensitive):

- `account_linkedin_url`
- `prospect_linkedin_url`
- `product pitched`
- `email`
- `first name`
- `last name`
- `title`
- `department`
- `domain`
- `company name`
- `industry`
- `country`
- `region`
- `esp host`

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. (Optional) Configure N8N webhook URL via environment variable:

Create a `.env` file in the root directory:

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

Alternatively, you can configure the webhook URL directly in the application UI.

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build:

```bash
npm run preview
```

## Usage

1. **Configure Webhook URL**: Enter your N8N webhook URL in the configuration section at the top of the page. This can also be set via the `VITE_N8N_WEBHOOK_URL` environment variable.

2. **Upload CSV File**: Click the upload area or drag and drop a CSV file.

3. **Review Validation**: The application will automatically validate the CSV file and display:
   - ✅ Success message if all required fields are present
   - ❌ Error message listing missing fields if validation fails

4. **Send to N8N**: If validation is successful, click "Send to N8N Workflow" to send the data to your configured webhook.

## Project Structure

```
src/
├── components/          # React components
│   ├── CSVUploader.tsx      # File upload component
│   ├── ValidationResults.tsx # Validation results display
│   └── WebhookConfig.tsx    # Webhook URL configuration
├── utils/               # Utility functions
│   ├── csvParser.ts         # CSV parsing logic
│   ├── csvValidator.ts      # Field validation logic
│   └── n8nIntegration.ts    # N8N webhook integration
├── types/               # TypeScript type definitions
│   └── csvTypes.ts
├── styles/              # CSS styles
│   └── App.css
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **PapaParse** - CSV parsing library

## Error Handling

The application handles various error scenarios:

- Invalid file types (non-CSV files)
- File size limits (10MB maximum)
- Empty files
- CSV parsing errors
- Network errors when sending to webhook
- Invalid webhook URLs
- Request timeouts (30 seconds)

## License

MIT

# AI-SDR
