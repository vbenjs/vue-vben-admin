import { NextApiRequest, NextApiResponse } from 'next';

interface ApiKeyRequest {
  exchange: string;
  apiKey: string;
  apiSecret: string;
}

interface ApiKeyResponse {
  message: string;
  exchange: string;
}

// Mock storage for API keys (in-memory, not for production)
const apiKeysStore: Array<ApiKeyRequest> = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiKeyResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { exchange, apiKey, apiSecret } = req.body as ApiKeyRequest;

  if (!exchange || !apiKey || !apiSecret) {
    return res.status(400).json({ error: 'Missing required fields: exchange, apiKey, and apiSecret' });
  }

  // Simulate saving API keys
  // In a real application, these would be securely stored and encrypted.
  apiKeysStore.push({ exchange, apiKey, apiSecret });

  console.log(`API Keys stored for ${exchange}:`, { apiKey: '***', apiSecret: '***' }); // Log masking sensitive data

  return res.status(201).json({ message: `API keys for ${exchange} saved successfully.`, exchange });
}
