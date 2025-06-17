import { NextApiRequest, NextApiResponse } from 'next';

interface RecommendationRequest {
  currency: string;
  timeframe: string;
  riskAppetite: string;
}

interface RecommendationResponse {
  recommendation: string;
  orderDetails: object;
}

import { userTokenBalances, consumeTokens } from './tokenStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecommendationResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { currency, timeframe, riskAppetite } = req.body as RecommendationRequest;

  if (!currency || !timeframe || !riskAppetite) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simulate token consumption
  const tokenCost = 800;
  if (!consumeTokens(tokenCost)) {
    return res.status(402).json({ error: 'Insufficient tokens' });
  }

  // Mock recommendation logic
  const recommendation = `Based on your ${riskAppetite} risk appetite for ${currency} over the ${timeframe} timeframe, we recommend a diversified approach.`;
  const orderDetails = {
    currency,
    action: 'BUY',
    amount: Math.random() * 10, // Random amount for mock
    price: Math.random() * 50000, // Random price for mock
  };

  return res.status(200).json({ recommendation, orderDetails });
}
