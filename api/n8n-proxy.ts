import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Get the webhook URL from query parameter or body
  const webhookUrl = (request.query.url as string) || request.body?.webhookUrl;

  if (!webhookUrl) {
    return response.status(400).json({ error: 'Webhook URL is required' });
  }

  // Validate URL format
  try {
    new URL(webhookUrl);
  } catch {
    return response.status(400).json({ error: 'Invalid webhook URL format' });
  }

  // Get the data to forward
  const { headers, rows, rowCount } = request.body;

  try {
    // Forward the request to N8N webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headers,
        rows,
        rowCount,
      }),
    });

    const responseData = await n8nResponse.text();

    // Forward the response
    response.status(n8nResponse.status).json({
      success: n8nResponse.ok,
      data: responseData,
    });
  } catch (error) {
    console.error('Error proxying to N8N:', error);
    response.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
