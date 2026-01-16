import { ParsedCSVData, WebhookResponse } from '../types/csvTypes';

export async function sendToN8NWebhook(
  webhookUrl: string,
  csvData: ParsedCSVData
): Promise<WebhookResponse> {
  // Validate webhook URL
  if (!webhookUrl || !webhookUrl.trim()) {
    return {
      success: false,
      error: 'Webhook URL is not configured. Please set the N8N webhook URL.',
    };
  }

  try {
    // Validate URL format
    new URL(webhookUrl);
  } catch {
    return {
      success: false,
      error: 'Invalid webhook URL format. Please check the URL and try again.',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    // Use proxy in development to avoid CORS issues
    const isDevelopment = import.meta.env.DEV;
    let requestUrl: string;
    let requestBody: {
      webhookUrl?: string;
      headers: string[];
      rows: { [key: string]: string | undefined }[];
      rowCount: number;
    };

    const csvPayload = {
      headers: csvData.headers,
      rows: csvData.rows,
      rowCount: csvData.rows.length,
    };

    if (isDevelopment) {
      // In development, use Vite proxy if URL matches the configured pattern
      if (webhookUrl.includes('n8n-connector-208576477784.asia-south1.run.app')) {
        // Use Vite proxy in development
        requestUrl = webhookUrl.replace(
          'https://n8n-connector-208576477784.asia-south1.run.app',
          '/api/n8n'
        );
        requestBody = csvPayload;
      } else {
        // For other URLs in development, try direct fetch (may fail due to CORS)
        // This allows testing with different webhook URLs in development
        requestUrl = webhookUrl;
        requestBody = csvPayload;
      }
    } else {
      // Use Vercel serverless function in production to bypass CORS
      requestUrl = `/api/n8n-proxy?url=${encodeURIComponent(webhookUrl)}`;
      requestBody = {
        webhookUrl: webhookUrl,
        ...csvPayload,
      };
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorText = '';
      try {
        const responseText = await response.text();
        // Try to parse as JSON first
        try {
          const responseData = JSON.parse(responseText);
          // Handle proxy error response format
          if (responseData.error) {
            errorText = responseData.error;
          } else if (responseData.data) {
            errorText = responseData.data;
          } else {
            errorText = responseText;
          }
        } catch {
          // Not JSON, use the text as-is
          errorText = responseText;
        }
      } catch {
        errorText = response.statusText;
      }
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText || response.statusText}`,
      };
    }

    // Try to parse JSON response, but don't fail if it's not JSON
    try {
      await response.json();
    } catch {
      // Non-JSON response is fine for webhooks
    }

    return {
      success: true,
      message: 'Data successfully sent to N8N workflow',
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out. Please check your connection and try again.',
        };
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return {
          success: false,
          error: 'Network error. Please check your connection and webhook URL.',
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Unknown error occurred while sending data to N8N',
    };
  }
}

export function getWebhookUrl(): string {
  // First check environment variable (for production/build)
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (envUrl) {
    return envUrl;
  }

  // Check localStorage for user-configured URL
  const storedUrl = localStorage.getItem('n8n_webhook_url');
  if (storedUrl) {
    return storedUrl;
  }

  // Return empty string if not configured
  return '';
}

export function setWebhookUrl(url: string): void {
  localStorage.setItem('n8n_webhook_url', url);
}

